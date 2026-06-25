import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import TicketType from '#models/ticket_type'
import { MbiyopayService } from '#services/mbiyopay_service'

export default class CheckPayments extends BaseCommand {
  static commandName = 'check:payments'
  static description =
    'Check stuck payment orders against Mbiyopay API and clean up abandoned orders'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.number({
    alias: 'p',
    description: 'Processing/reserved timeout in minutes (default: 5)',
  })
  declare processingTimeout: number

  @flags.number({ alias: 's', description: 'Pending order staleness in hours (default: 24)' })
  declare staleHours: number

  @flags.number({ alias: 'c', description: 'Max parallel API calls (default: 5)' })
  declare concurrency: number

  @flags.boolean({ description: 'Show what would be done without executing' })
  declare dryRun: boolean

  async run() {
    const processingMin = this.processingTimeout ?? 5
    const staleHrs = this.staleHours ?? 24
    const batchSize = this.concurrency ?? 5
    const dry = this.dryRun ?? false

    if (dry) this.logger.info('[DRY RUN] No changes will be persisted')

    const cutoffProcessing = `NOW() - INTERVAL '${processingMin} MINUTES'`
    const cutoffPending = `NOW() - INTERVAL '${staleHrs} HOURS'`

    const selectCols = ['id', 'orderNumber', 'paymentIntentId', 'status'] as const

    // Phase 1 — Processing orders with a real paymentIntentId
    const processingOrders = await Order.query()
      .select(...selectCols)
      .where('status', 'processing')
      .whereNotNull('paymentIntentId')
      .whereRaw('payment_intent_id != ?', ['pending'])
      .whereRaw(`created_at < ${cutoffProcessing}`)

    // Phase 2 — Processing orders stuck from fire-and-forget timeout
    const timeoutOrders = await Order.query()
      .select(...selectCols)
      .where('status', 'processing')
      .where('paymentIntentId', 'pending')
      .whereRaw(`created_at < ${cutoffProcessing}`)

    // Phase 3 — Reserved orders (PIN never entered)
    const reservedOrders = await Order.query()
      .select(...selectCols)
      .where('status', 'reserved')
      .whereNotNull('paymentIntentId')
      .whereRaw(`created_at < ${cutoffProcessing}`)

    // Phase 4 — Pending orders (abandoned)
    const pendingOrders = await Order.query()
      .select(...selectCols)
      .where('status', 'pending')
      .whereRaw(`created_at < ${cutoffPending}`)

    const total =
      processingOrders.length +
      timeoutOrders.length +
      reservedOrders.length +
      pendingOrders.length

    if (total === 0) {
      this.logger.info('No stuck orders found')
      return
    }

    this.logger.info(
      `Found ${total} stuck: ${processingOrders.length} processing, ${timeoutOrders.length} timeout, ${reservedOrders.length} reserved, ${pendingOrders.length} pending`
    )

    // --- Phase 4 first: pending orders don't need API ---
    if (pendingOrders.length > 0) {
      this.logger.info(`Phase 4: cleaning up ${pendingOrders.length} abandoned pending orders`)
      for (const o of pendingOrders) {
        if (!dry) {
          o.status = 'failed'
          await o.save()
          await this.releaseReserved(o.id)
          this.logger.success(`${o.orderNumber} → failed (abandoned)`)
        } else {
          this.logger.info(`  [DRY] ${o.orderNumber} → would mark failed + release reserve`)
        }
      }
    }

    // --- Phase 2: timeout orders that never got a transaction ID ---
    if (timeoutOrders.length > 0) {
      this.logger.info(
        `Phase 2: marking ${timeoutOrders.length} timeout orders as failed (no transaction_id)`
      )
      for (const o of timeoutOrders) {
        if (!dry) {
          o.status = 'failed'
          await o.save()
          await this.releaseReserved(o.id)
          this.logger.success(`${o.orderNumber} → failed (timeout)`)
        } else {
          this.logger.info(`  [DRY] ${o.orderNumber} → would mark failed (timeout)`)
        }
      }
    }

    // --- Phase 1 + 3 combined: both need Mbiyopay status checks ---
    const apiOrders = [...processingOrders, ...reservedOrders]

    if (apiOrders.length > 0) {
      this.logger.info(`Checking ${apiOrders.length} orders against Mbiyopay...`)
      let paid = 0
      let failed = 0
      let errors = 0

      const mbiyopay = new MbiyopayService()

      for (let i = 0; i < apiOrders.length; i += batchSize) {
        const batch = apiOrders.slice(i, i + batchSize)
        const settled = await Promise.allSettled(
          batch.map(async (o) => {
            try {
              const status = await mbiyopay.checkStatus(o.paymentIntentId!)
              return { order: o, mbiyoStatus: status }
            } catch {
              return { order: o, mbiyoStatus: null }
            }
          })
        )

        for (const result of settled) {
          if (result.status === 'rejected') {
            const o = result.reason?.order
            if (o && !dry) {
              o.status = 'failed'
              await o.save()
              await this.releaseReserved(o.id)
            }
            errors++
            this.logger.warning(`  ${o?.orderNumber ?? '?'} → API error, marked failed`)
            continue
          }

          const { order, mbiyoStatus } = result.value

          if (!mbiyoStatus) {
            if (!dry) {
              order.status = 'failed'
              await order.save()
              await this.releaseReserved(order.id)
            }
            errors++
            this.logger.warning(`  ${order.orderNumber} → Mbiyo API returned null, marked failed`)
            continue
          }

          const mStatus = mbiyoStatus.status

          if (mStatus === 'successful') {
            if (!dry) {
              await MbiyopayService.processSuccessfulPayment(order.id)
            }
            paid++
            this.logger.success(`  ${order.orderNumber} → paid`)
          } else if (mStatus === 'failed' || mStatus === 'cancelled') {
            if (!dry) {
              await MbiyopayService.processFailedPayment(order.id)
            }
            failed++
            this.logger.info(`  ${order.orderNumber} → failed (Mbiyopay: ${mStatus})`)
          } else {
            this.logger.info(`  ${order.orderNumber} → still ${mStatus}, leaving as-is`)
          }
        }
      }

      this.logger.info(`API results: ${paid} paid, ${failed} failed, ${errors} errors`)
    }

    this.logger.info('Done')
  }

  private async releaseReserved(orderId: string) {
    const items = await OrderItem.query()
      .where('orderId', orderId)
      .select('ticketTypeId', 'quantity')
    for (const item of items) {
      if (item.ticketTypeId) {
        await TicketType.query()
          .where('id', item.ticketTypeId)
          .decrement('quantityReserved', item.quantity)
      }
    }
  }
}
