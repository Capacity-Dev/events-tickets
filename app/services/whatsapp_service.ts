import whatsappConfig from '#config/whatsapp'
import { BaileysProvider } from './whatsapp_providers/baileys_provider.js'
import NotificationLog from '#models/notification_log'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export class WhatsAppService {
  static async initialize(): Promise<void> {
    if (whatsappConfig.provider === 'disabled') return
    if (whatsappConfig.provider === 'baileys') {
      await BaileysProvider.initialize()
    }
  }

  static getStatus() {
    return BaileysProvider.getStatus()
  }

  static async disconnect(): Promise<void> {
    await BaileysProvider.disconnect()
  }

  static async reset(): Promise<void> {
    await BaileysProvider.reset()
  }

  static async sendText(logId: string, phone: string, message: string): Promise<void> {
    if (whatsappConfig.provider === 'disabled') return
    try {
      await BaileysProvider.sendMessage(phone, message)
      const log = await NotificationLog.find(logId)
      if (log) {
        log.status = 'sent'
        log.sentAt = DateTime.now()
        log.payload = { ...((log.payload as any) ?? {}), message }
        await log.save()
      }
    } catch (error: any) {
      const log = await NotificationLog.find(logId)
      if (log) {
        log.status = 'failed'
        ;(log as any).errorDetails = { message: error.message }
        await log.save()
      }
    }
  }

  static async sendTicketNotification(
    logId: string,
    phone: string,
    data: {
      buyerName: string
      eventTitle: string
      eventDate: string
      venueName: string
      ticketCount: number
      ticketNumbers: string[]
      orderNumber: string
      ticketLinks: string[]
    }
  ): Promise<void> {
    try {
      if (whatsappConfig.provider === 'disabled') return

      await BaileysProvider.sendTicketNotification(phone, data)
      await NotificationLog.query().where('id', logId).update({
        status: 'sent',
        sentAt: new Date(),
      })
    } catch (error) {
      await NotificationLog.query()
        .where('id', logId)
        .update({
          status: 'failed',
          errorDetails: JSON.stringify({ message: (error as Error).message }),
        })
    }
  }

  static async logQueued(
    recipientType: string,
    recipientIdentifier: string,
    payload: Record<string, unknown>
  ): Promise<string> {
    const log = await NotificationLog.create({
      id: crypto.randomUUID(),
      recipientType,
      recipientIdentifier,
      channel: 'whatsapp',
      status: 'queued',
      payload: payload as any,
    })
    return log.id
  }
}
