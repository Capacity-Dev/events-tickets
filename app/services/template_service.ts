import WhatsAppTemplate from '#models/whatsapp_template'
import logger from '@adonisjs/core/services/logger'

interface TemplateData {
  [key: string]: string | number | undefined
}

interface ResolvedTemplate {
  body: string
  subject: string | null
}

export class TemplateService {
  async resolve(channel: string, type: string, data: TemplateData): Promise<ResolvedTemplate> {
    const template = await WhatsAppTemplate.query()
      .where('channel', channel)
      .where('type', type)
      .where('status', 'active')
      .orderBy('createdAt', 'desc')
      .first()

    if (!template || !(template as any).body) {
      logger.warn(`[TemplateService] No active template for ${channel}/${type}, using fallback`)
      return this.#fallback(channel, type, data)
    }

    let body = (template as any).body as string
    const subject = (template as any).subject ?? null

    body = this.#substitute(body, data)

    return { body, subject: subject ? this.#substitute(subject, data) : null }
  }

  async resolveOrDefault(channel: string, type: string, data: TemplateData): Promise<ResolvedTemplate> {
    try {
      const result = await this.resolve(channel, type, data)
      if (result.body) return result
    } catch (err) {
      logger.warn({ err }, `[TemplateService] Failed to resolve ${channel}/${type}`)
    }
    return this.#fallback(channel, type, data)
  }

  #substitute(template: string, data: TemplateData): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
      return String(data[key] ?? `{{${key}}}`)
    })
  }

  #fallback(channel: string, type: string, data: TemplateData): ResolvedTemplate {
    if (channel === 'whatsapp') {
      if (type === 'purchase_confirmation') {
        const ticketList = (data.ticketList as string) ?? ''
        const firstName = (data.firstName as string) ?? 'Client'

        const body = [
          `🎫 *Vos billets sont prêts !*`,
          ``,
          `Bonjour ${firstName},`,
          ``,
          `Votre commande #${data.orderNumber ?? ''} a été confirmée.`,
          ``,
          `📅 *Événement :* ${data.eventTitle ?? ''}`,
          `📍 *Lieu :* ${data.venueName ?? ''}`,
          `🗓 *Date :* ${data.eventDate ?? ''}`,
          `🎟 *Billets :* ${data.ticketCount ?? 0} ticket${(data.ticketCount as number) > 1 ? 's' : ''}`,
          ``,
          ticketList,
          ``,
          `Présentez ce billet à l'entrée. À bientôt !`,
        ].join('\n')

        return { body, subject: null }
      }
      if (type === 'reminder_3d') {
        return {
          body: `📅 *Rappel*\n\nBonjour ${data.firstName ?? 'Client'},\n\nL'événement "${data.eventTitle ?? ''}" commence dans 3 jours !\n\nDate : ${data.eventDate ?? ''}\nLieu : ${data.venueName ?? ''}\n\nÀ bientôt !`,
          subject: null,
        }
      }
      if (type === 'reminder_1d') {
        return {
          body: `⏰ *Dernier rappel*\n\nBonjour ${data.firstName ?? 'Client'},\n\nL'événement "${data.eventTitle ?? ''}" commence demain !\n\nDate : ${data.eventDate ?? ''}\nLieu : ${data.venueName ?? ''}\n\nÀ demain !`,
          subject: null,
        }
      }
    }

    if (channel === 'email') {
      if (type === 'purchase_confirmation') {
        const ticketRowsHtml = (data.ticketRowsHtml as string) ?? ''
        const firstName = (data.firstName as string) ?? 'Client'
        const venueName = (data.venueName as string) ?? ''

        const body = [
          `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF1F2;padding:40px 0">`,
          `<tr><td align="center">`,
          `<table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden">`,
          `<tr><td style="background-color:#E11D48;padding:24px 32px;text-align:center"><h1 style="color:#FFFFFF;margin:0;font-size:24px">Mbiyo Events</h1></td></tr>`,
          `<tr><td style="padding:32px">`,
          `<h2 style="margin:0 0 8px;font-size:20px">${firstName}, vos billets sont prêts !</h2>`,
          `<p style="color:#666;margin:0 0 24px">Votre commande #${data.orderNumber ?? ''} a été confirmée.</p>`,
          `<div style="background-color:#F0ECF2;border-radius:8px;padding:16px;margin-bottom:24px">`,
          `<p style="margin:4px 0;font-weight:600">${data.eventTitle ?? ''}</p>`,
          `<p style="margin:4px 0;color:#555">📅 ${data.eventDate ?? ''}</p>`,
          venueName ? `<p style="margin:4px 0;color:#555">📍 ${venueName}</p>` : '',
          `<p style="margin:4px 0;color:#555">🎟 ${data.ticketCount ?? 0} billets</p>`,
          `</div>`,
          `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">`,
          `<tr style="background-color:#FECDD3"><td style="padding:8px 12px;font-weight:600;font-size:13px">Numéro</td><td style="padding:8px 12px;font-weight:600;font-size:13px">Billet</td></tr>`,
          ticketRowsHtml,
          `</table>`,
          `<p style="font-size:13px;color:#555">Présentez ce billet à l'entrée. Vous pouvez également présenter le QR code sur votre téléphone.</p>`,
          `</td></tr>`,
          `<tr><td style="border-top:1px solid #EEE;padding:16px 32px;text-align:center"><p style="color:#9D7B87;font-size:12px;margin:0">Mbiyo Events — Tous droits réservés.</p></td></tr>`,
          `</table></td></tr></table>`,
        ].join('\n')

        return { body, subject: `Vos billets pour ${data.eventTitle ?? ''}` }
      }
    }

    return { body: '', subject: null }
  }
}

export const templateService = new TemplateService()
