import Order from '#models/order'
import Event from '#models/event'
import Ticket from '#models/ticket'
import { WhatsAppService } from './whatsapp_service.js'
import { MailService } from './mail_service.js'
import { templateService } from './template_service.js'
import Setting from '#models/setting'
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
      const firstName = buyerName.split(' ')[0]

      const eventDate = event.startDate.toFormat('EEEE d MMMM yyyy · h:mm a')
      const appUrl = process.env.APP_URL ?? 'http://localhost:3333'

      const ticketNumbers = tickets.map((t) => t.ticketNumber)
      const ticketLinks = tickets.map((t) => `${appUrl}/tickets/${t.uuid}`)
      const ticketList = ticketLinks.map((link, i) => `${ticketNumbers[i]}: ${link}`).join('\n')
      const ticketRowsHtml = ticketLinks
        .map(
          (link, i) =>
            `<tr><td style="padding:8px 12px;font-family:monospace;font-size:13px;border-top:1px solid #EEE">${ticketNumbers[i]}</td><td style="padding:8px 12px;border-top:1px solid #EEE"><a href="${link}" style="display:inline-block;background-color:#E11D48;color:#FFF;border-radius:6px;padding:4px 12px;text-decoration:none;font-size:12px;font-weight:600">Voir le billet</a></td></tr>`
        )
        .join('\n')

      const templateData: Record<string, any> = {
        buyerName,
        firstName,
        orderNumber: order.orderNumber,
        eventTitle: event.title,
        eventDate,
        venueName: event.venueName ?? '',
        ticketCount: tickets.length,
        ticketList,
        ticketRowsHtml,
        ticketNumbers: ticketNumbers.join(', '),
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

      const settings = await Setting.query()
      const settingsMap: Record<string, string> = {}
      for (const s of settings) {
        settingsMap[s.key] = (s as any).value ?? ''
      }

      if (order.guestPhone && settingsMap.notify_purchase_whatsapp !== '0') {
        try {
          const { body } = await templateService.resolveOrDefault(
            'whatsapp',
            'purchase_confirmation',
            templateData
          )
          const logId = await WhatsAppService.logQueued('buyer', order.guestPhone, payloadBase)
          await WhatsAppService.sendText(logId, order.guestPhone, body)
        } catch (error) {
          logger.error('WhatsApp notification failed:', error)
        }
      }

      if (order.guestEmail && settingsMap.notify_purchase_email !== '0') {
        try {
          const { body, subject } = await templateService.resolveOrDefault(
            'email',
            'purchase_confirmation',
            templateData
          )
          await MailService.sendEmail(order.guestEmail, subject ?? '', body, templateData as any)
        } catch (error) {
          logger.error('Email notification failed:', error)
        }
      }
    } catch (error) {
      logger.error('Notification dispatch failed:', error)
    }
  }
}
