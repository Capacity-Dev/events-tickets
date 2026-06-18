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
      const venueStr = data.venueName && data.venueName !== 'N/A'
        ? `<p style="margin:0 0 4px;font-size:14px;color:#6B4452">📍 ${data.venueName}</p>`
        : ''

      const rows = data.ticketNumbers
        .map(
          (num, i) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #F0ECF2;font-size:14px;color:#1F0A14;font-family:monospace">${num}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #F0ECF2" align="right">
            <a href="${data.ticketLinks[i]}" style="display:inline-block;background-color:#E11D48;color:#FFFFFF;padding:6px 14px;border-radius:6px;font-size:13px;text-decoration:none;font-weight:600">Voir le billet</a>
          </td>
        </tr>`
        )
        .join('')

      const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background-color:#FFF1F2;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF1F2;padding:30px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
<tr><td style="background-color:#E11D48;padding:24px 32px;text-align:center"><h1 style="color:#FFFFFF;margin:0;font-size:24px">Events Tickets</h1></td></tr>
<tr><td style="padding:32px">
<h2 style="color:#1F0A14;margin:0 0 8px;font-size:20px">${data.buyerName}, vos billets sont prêts !</h2>
<p style="color:#6B4452;margin:0 0 24px;font-size:14px;line-height:1.5">Votre commande <strong>#${data.orderNumber}</strong> a été confirmée.</p>
<div style="background-color:#F0ECF2;border-radius:8px;padding:20px;margin-bottom:24px">
<p style="margin:0 0 8px;font-size:18px;font-weight:bold;color:#1F0A14">${data.eventTitle}</p>
<p style="margin:0 0 4px;font-size:14px;color:#6B4452">📅 ${data.eventDate}</p>
${venueStr}
<p style="margin:0;font-size:14px;color:#6B4452">🎟 ${data.ticketCount} billet${data.ticketCount > 1 ? 's' : ''}</p>
</div>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
<tr style="background-color:#FECDD3"><td style="padding:8px 12px;font-size:12px;font-weight:bold;color:#881337">Numéro</td><td style="padding:8px 12px;font-size:12px;font-weight:bold;color:#881337" align="right">Billet</td></tr>
${rows}
</table>
<p style="color:#6B4452;font-size:13px;line-height:1.5;margin:0 0 16px">Présentez vos billets à l'entrée. Cliquez sur "Voir le billet" pour afficher le QR code.</p>
<p style="color:#9D7B87;font-size:12px;margin:0">Events Tickets — Tous droits réservés.</p>
</td></tr>
</table>
</td></tr>
</table>
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
            htmlbody: html,
          }),
        }
      )

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
      await NotificationLog.query().where('id', logId).update({
        status: 'failed',
        errorDetails: JSON.stringify({ message: (error as Error).message }),
      })
      throw error
    }
  }
}
