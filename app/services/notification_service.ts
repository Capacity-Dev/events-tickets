import Order from '#models/order'
import Event from '#models/event'
import Ticket from '#models/ticket'
import { WhatsAppService } from './whatsapp_service.js'
import { MailService } from './mail_service.js'
import logger from '@adonisjs/core/services/logger'

export class NotificationService {
  static async dispatch(order: Order): Promise<void> {
    try {
      const orderItems = await order
        .related('items')
        .query()
        .preload('ticketType')
        .preload('tickets')

      const tickets: Ticket[] = []
      for (const item of orderItems) {
        const itemTickets = await item.related('tickets').query()
        tickets.push(...itemTickets)
      }

      if (tickets.length === 0) return

      const firstTicket = tickets[0]
      const event = await Event.find(firstTicket.eventId)
      if (!event) return

      const buyerName =
        (order as any).guestName ??
        (await order.load('buyer').then(() => order.buyer?.fullName)) ??
        'Client'

      const eventDate = event.startDate.toFormat('EEEE d MMMM yyyy · h:mm a')
      const appUrl = process.env.APP_URL ?? 'http://localhost:3333'

      const ticketData = {
        buyerName,
        eventTitle: event.title,
        eventDate,
        venueName: event.venueName ?? 'N/A',
        ticketCount: tickets.length,
        ticketNumbers: tickets.map((t) => t.ticketNumber),
        orderNumber: order.orderNumber,
        ticketLinks: tickets.map((t) => `${appUrl}/tickets/${t.uuid}`),
        totalAmount: String(order.totalGrossAmount),
        currency: order.currency ?? 'USD',
      }

      const payloadBase = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        eventId: event.id,
        eventTitle: event.title,
        ticketCount: tickets.length,
      }

      // Send via WhatsApp
      if (order.guestPhone) {
        try {
          const logId = await WhatsAppService.logQueued('buyer', order.guestPhone, payloadBase)
          await WhatsAppService.sendTicketNotification(logId, order.guestPhone, ticketData)
        } catch (error) {
          logger.error('WhatsApp notification failed:', error)
        }
      }

      // Send via Email
      if (order.guestEmail) {
        try {
          await MailService.sendTicketEmail(order.guestEmail, ticketData)
        } catch (error) {
          logger.error('Email notification failed:', error)
        }
      }
    } catch (error) {
      logger.error('Notification dispatch failed:', error)
    }
  }
}
