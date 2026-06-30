import Order from '#models/order'
import OrderItem from '#models/order_item'
import Ticket from '#models/ticket'
import TicketType from '#models/ticket_type'
import type Event from '#models/event'
import { DateTime } from 'luxon'
import { NotificationService } from './notification_service.js'
import logger from '@adonisjs/core/services/logger'

interface GuestData {
  name: string
  email?: string
  phone?: string
  sendWhatsApp?: boolean
  sendEmail?: boolean
}

export class GuestInvitationService {
  static async invite(
    event: Event,
    ticketType: TicketType,
    guests: GuestData[]
  ): Promise<{ success: number; failed: number; orders: string[] }> {
    let success = 0
    let failed = 0
    const orderIds: string[] = []

    for (const guest of guests) {
      try {
        const orderId = crypto.randomUUID()
        const paidAt = DateTime.now()
        const num = `${String(Date.now()).slice(-6)}${String(guest.name.length).padStart(2, '0')}`
        const orderNumber = `INV-${num}`

        const order = await Order.create({
          id: orderId,
          orderNumber,
          buyerId: null,
          guestName: guest.name,
          guestEmail: guest.email ?? null,
          guestPhone: guest.phone ?? null,
          status: 'paid',
          source: 'manual_invite',
          totalGrossAmount: '0',
          platformFeeAmount: '0',
          organizerNetAmount: '0',
          currency: ticketType.currency ?? 'USD',
          paymentMethod: 'free',
          paidAt,
        } as any)

        const itemId = crypto.randomUUID()
        await OrderItem.create({
          id: itemId,
          orderId: order.id,
          ticketTypeId: ticketType.id,
          unitPrice: '0',
          quantity: 1,
          lineTotal: '0',
        } as any)

        const ticketUuid = crypto.randomUUID()
        const ticketNum = `${String(Date.now()).slice(-6)}${String(success).padStart(2, '0')}`
        await Ticket.create({
          id: crypto.randomUUID(),
          orderItemId: itemId,
          eventId: event.id,
          ticketTypeId: ticketType.id,
          ticketNumber: `TKT-${ticketNum}`,
          uuid: ticketUuid,
          qrToken: ticketUuid,
          status: 'valid',
        })

        await TicketType.query().where('id', ticketType.id).increment('quantitySold', 1)

        const contactAvailable =
          (guest.sendWhatsApp !== false && order.guestPhone) ||
          (guest.sendEmail !== false && order.guestEmail)

        if (contactAvailable) {
          try {
            await NotificationService.dispatch(order)
          } catch (err) {
            logger.error({ err, orderId }, 'Guest invitation notification failed')
          }
        }

        orderIds.push(order.id)
        success++
      } catch (err) {
        logger.error({ err, guest }, 'Guest invitation creation failed')
        failed++
      }
    }

    return { success, failed, orders: orderIds }
  }
}
