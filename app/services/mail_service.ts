import mailConfig from '#config/mail'
import NotificationLog from '#models/notification_log'
import crypto from 'node:crypto'

interface TicketEmailData {
  buyerName: string
  orderNumber: string
  eventTitle: string
  eventDate: string
  venueName: string | null
  ticketCount: number
  ticketNumbers: string[]
  ticketLinks: string[]
  totalAmount: string
  currency: string
}

export class MailService {
  static async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    data?: TicketEmailData
  ): Promise<string> {
    const logId = crypto.randomUUID()
    await NotificationLog.create({
      id: logId,
      recipientType: 'buyer',
      recipientIdentifier: to,
      channel: 'email',
      status: 'queued',
      payload: data as any,
    })

    try {
      const wrapperHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background-color:#FFF1F2;font-family:Arial,Helvetica,sans-serif">
${htmlBody}
</body>
</html>`

      const response = await fetch('https://api.zeptomail.com/v1.1/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Zoho-enczapikey ${mailConfig.zeptomail.token}`,
        },
        body: JSON.stringify({
          from: {
            address: mailConfig.from.address,
            name: mailConfig.from.name,
          },
          to: [{ email_address: { address: to } }],
          subject: subject || `Vos billets`,
          htmlbody: wrapperHtml,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`ZeptoMail error: ${response.status} ${errorText}`)
      }

      const log = await NotificationLog.find(logId)
      if (log) {
        log.status = 'sent'
        log.sentAt = new Date() as any
        await log.save()
      }

      return logId
    } catch (error: any) {
      const log = await NotificationLog.find(logId)
      if (log) {
        log.status = 'failed'
        ;(log as any).errorDetails = { message: error.message }
        await log.save()
      }
      throw error
    }
  }

  static async sendTicketEmail(to: string, data: TicketEmailData): Promise<string> {
    const logId = crypto.randomUUID()
    await NotificationLog.create({
      id: logId,
      recipientType: 'buyer',
      recipientIdentifier: to,
      channel: 'email',
      status: 'queued',
      payload: data as any,
    })

    try {
      const { templateService } = await import('./template_service.js')

      const ticketList = data.ticketLinks
        .map((link, i) => `${data.ticketNumbers[i]}: ${link}`)
        .join('\n')
      const ticketRowsHtml = data.ticketLinks
        .map(
          (link, i) =>
            `<tr><td style="padding:10px 12px;border-bottom:1px solid #F0ECF2;font-size:14px;color:#1F0A14;font-family:monospace">${data.ticketNumbers[i]}</td><td style="padding:10px 12px;border-bottom:1px solid #F0ECF2" align="right"><a href="${link}" style="display:inline-block;background-color:#E11D48;color:#FFFFFF;padding:6px 14px;border-radius:6px;font-size:13px;text-decoration:none;font-weight:600">Voir le billet</a></td></tr>`
        )
        .join('\n')

      const { body } = await templateService.resolveOrDefault('email', 'purchase_confirmation', {
        buyerName: data.buyerName,
        firstName: data.buyerName.split(' ')[0],
        orderNumber: data.orderNumber,
        eventTitle: data.eventTitle,
        eventDate: data.eventDate,
        venueName: data.venueName ?? '',
        ticketCount: data.ticketCount,
        ticketList,
        ticketRowsHtml,
        ticketNumbers: data.ticketNumbers.join(', '),
        totalAmount: data.totalAmount,
        currency: data.currency,
      })

      const wrapperHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background-color:#FFF1F2;font-family:Arial,Helvetica,sans-serif">
${body}
</body>
</html>`

      const response = await fetch('https://api.zeptomail.com/v1.1/email', {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-enczapikey ${mailConfig.zeptomail.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: {
            address: mailConfig.from.address,
            name: mailConfig.from.name,
          },
          to: [{ email_address: { address: to } }],
          subject: `Vos billets pour ${data.eventTitle}`,
          htmlbody: wrapperHtml,
        }),
      })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(`ZeptoMail error ${response.status}: ${errBody}`)
      }

      await NotificationLog.query().where('id', logId).update({
        status: 'sent',
        sentAt: new Date(),
      })

      return logId
    } catch (error) {
      await NotificationLog.query()
        .where('id', logId)
        .update({
          status: 'failed',
          errorDetails: JSON.stringify({ message: (error as Error).message }),
        })
      throw error
    }
  }
}
