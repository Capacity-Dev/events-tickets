import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import Ticket from '#models/ticket'
import TicketType from '#models/ticket_type'
import OrderItem from '#models/order_item'
import { MbiyopayService } from '#services/mbiyopay_service'

export default class BuyerController {
  async orders({ inertia, auth }: HttpContext) {
    const orders = await Order.query()
      .where('buyerId', auth.user!.id)
      .preload('items', (q: any) => q.preload('ticketType'))
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('dashboard/buyer/orders', { orders })
  }

  async tickets({ inertia, auth }: HttpContext) {
    const tickets = await Ticket.query()
      .whereHas('orderItem', (q: any) => {
        q.whereHas('order', (oq: any) => {
          oq.where('buyerId', auth.user!.id)
        })
      })
      .preload('event')
      .preload('ticketType')
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('dashboard/buyer/tickets', { tickets })
  }

  async showOrder({ inertia, params, auth }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .where('buyerId', auth.user!.id)
      .preload('items', (q: any) => q.preload('ticketType'))
      .first()

    if (!order) {
      return inertia.render('errors/not_found', {} as any)
    }

    return (inertia.render as any)('dashboard/buyer/orders_show', { order })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.all()
    const items = data.items as Array<{ ticketTypeId: string; quantity: number }>

    if (!items || items.length === 0) {
      return response.status(400).json({ error: 'Cart is empty' })
    }

    const ticketTypes = await TicketType.query().whereIn(
      'id',
      items.map((i) => i.ticketTypeId)
    )

    let totalGross = 0
    const orderItems: Array<{
      id: string
      ticketTypeId: string
      unitPrice: number
      quantity: number
      lineTotal: number
    }> = []

    for (const item of items) {
      const ticketType = ticketTypes.find((t) => t.id === item.ticketTypeId)
      if (!ticketType) {
        return response.status(400).json({ error: `Ticket type ${item.ticketTypeId} not found` })
      }

      const lineTotal = Number(ticketType.basePrice) * item.quantity
      totalGross += lineTotal

      orderItems.push({
        id: crypto.randomUUID(),
        ticketTypeId: ticketType.id,
        unitPrice: Number(ticketType.basePrice),
        quantity: item.quantity,
        lineTotal,
      })
    }

    const now = new Date()
    const orderNumber = `ORD-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`

    const order = await Order.create({
      id: crypto.randomUUID(),
      orderNumber,
      buyerId: auth.user!.id,
      status: 'pending',
      totalGrossAmount: totalGross,
      platformFeeAmount: 0,
      organizerNetAmount: totalGross,
      paymentProcessorFee: 0,
      currency: 'USD',
    })

    await OrderItem.createMany(
      orderItems.map((oi) => ({
        ...oi,
        orderId: order.id,
      }))
    )

    for (const item of items) {
      await TicketType.query()
        .where('id', item.ticketTypeId)
        .increment('quantityReserved', item.quantity)
    }

    response.redirect().toRoute('dashboard.buyer.orders.show', { id: order.id })
  }

  async payForm({ inertia, params, auth }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .where('buyerId', auth.user!.id)
      .first()

    if (!order || order.status !== 'pending') {
      return inertia.render('errors/not_found', {} as any)
    }

    return (inertia.render as any)('dashboard/buyer/pay', { order })
  }

  async pay({ params, request, response, auth, session, inertia }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .where('buyerId', auth.user!.id)
      .first()

    if (!order) return response.status(404).json({ error: 'Order not found' })
    if (order.status !== 'pending') return response.status(400).json({ error: 'Order cannot be paid' })

    const phone = request.input('phone')
    const network = request.input('network')

    if (!phone || !network) {
      session.flash('error', 'Phone number and network are required.')
      return response.redirect().back()
    }

    try {
      const mbiyopay = new MbiyopayService()

      const result = await mbiyopay.initiatePayin({
        amount: Number(order.totalGrossAmount),
        currency: order.currency ?? 'USD',
        phoneNumber: phone,
        network,
        countryCode: 'CD',
        orderId: order.orderNumber,
      })

      order.paymentIntentId = result.transaction_id
      order.status = 'reserved'
      await order.save()

      if (result.auth_mode === 'pin') {
        session.put('pending_payment', {
          transactionId: result.transaction_id,
          orderId: order.id,
        })
        session.flash('info', 'Payment requires PIN verification.')
        return (inertia.render as any)('dashboard/buyer/pay', {
          order,
          pinRequired: true,
          transactionId: result.transaction_id,
          instructions: result.instructions,
        })
      }

      if (result.redirect_url) {
        return response.redirect(result.redirect_url)
      }

      session.flash('success', 'Payment initiated. Waiting for confirmation.')
      response.redirect().toRoute('dashboard.buyer.orders.show', { id: order.id })
    } catch (error: any) {
      session.flash('error', `Payment failed: ${error.message}`)
      response.redirect().back()
    }
  }
}
