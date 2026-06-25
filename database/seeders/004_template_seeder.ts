import WhatsAppTemplate from '#models/whatsapp_template'

export default class TemplateSeeder {
  async run() {
    const defaults = [
      {
        id: crypto.randomUUID(),
        name: 'Purchase Confirmation — WhatsApp',
        category: 'utility',
        languageCode: 'fr',
        status: 'active',
        channel: 'whatsapp',
        type: 'purchase_confirmation',
        variables: ['buyerName', 'firstName', 'orderNumber', 'eventTitle', 'eventDate', 'venueName', 'ticketCount', 'ticketList'],
        body: [
          `🎫 *Vos billets sont prêts !*`,
          ``,
          `Bonjour {{firstName}},`,
          ``,
          `Votre commande #{{orderNumber}} a été confirmée.`,
          ``,
          `📅 *Événement :* {{eventTitle}}`,
          `📍 *Lieu :* {{venueName}}`,
          `🗓 *Date :* {{eventDate}}`,
          `🎟 *Billets :* {{ticketCount}} billets`,
          ``,
          `{{ticketList}}`,
          ``,
          `Présentez ce billet à l'entrée. À bientôt !`,
        ].join('\n'),
        subject: null,
      },
      {
        id: crypto.randomUUID(),
        name: 'Purchase Confirmation — Email',
        category: 'marketing',
        languageCode: 'fr',
        status: 'active',
        channel: 'email',
        type: 'purchase_confirmation',
        variables: ['firstName', 'orderNumber', 'eventTitle', 'eventDate', 'venueName', 'ticketCount', 'ticketRowsHtml'],
        body: [
          `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF1F2;padding:40px 0">`,
          `<tr><td align="center">`,
          `<table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden">`,
          `<tr><td style="background-color:#E11D48;padding:24px 32px;text-align:center"><h1 style="color:#FFFFFF;margin:0;font-size:24px">Mbiyo Events</h1></td></tr>`,
          `<tr><td style="padding:32px">`,
          `<h2 style="margin:0 0 8px;font-size:20px">{{firstName}}, vos billets sont prêts !</h2>`,
          `<p style="color:#666;margin:0 0 24px">Votre commande #{{orderNumber}} a été confirmée.</p>`,
          `<div style="background-color:#F0ECF2;border-radius:8px;padding:16px;margin-bottom:24px">`,
          `<p style="margin:4px 0;font-weight:600">{{eventTitle}}</p>`,
          `<p style="margin:4px 0;color:#555">📅 {{eventDate}}</p>`,
          `<p style="margin:4px 0;color:#555">📍 {{venueName}}</p>`,
          `<p style="margin:4px 0;color:#555">🎟 {{ticketCount}} billets</p>`,
          `</div>`,
          `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">`,
          `<tr style="background-color:#FECDD3"><td style="padding:8px 12px;font-weight:600;font-size:13px">Numéro</td><td style="padding:8px 12px;font-weight:600;font-size:13px">Billet</td></tr>`,
          `{{ticketRowsHtml}}`,
          `</table>`,
          `<p style="font-size:13px;color:#555">Présentez ce billet à l'entrée. Vous pouvez également présenter le QR code sur votre téléphone.</p>`,
          `</td></tr>`,
          `<tr><td style="border-top:1px solid #EEE;padding:16px 32px;text-align:center"><p style="color:#9D7B87;font-size:12px;margin:0">Mbiyo Events — Tous droits réservés.</p></td></tr>`,
          `</table></td></tr></table>`,
        ].join('\n'),
        subject: 'Vos billets pour {{eventTitle}}',
      },
      {
        id: crypto.randomUUID(),
        name: 'Event Reminder J-3',
        category: 'utility',
        languageCode: 'fr',
        status: 'active',
        channel: 'whatsapp',
        type: 'reminder_3d',
        variables: ['firstName', 'eventTitle', 'eventDate', 'venueName'],
        body: [
          `📅 *Rappel*`,
          ``,
          `Bonjour {{firstName}},`,
          ``,
          `L'événement *{{eventTitle}}* commence dans 3 jours !`,
          ``,
          `Date : {{eventDate}}`,
          `Lieu : {{venueName}}`,
          ``,
          `À bientôt !`,
        ].join('\n'),
        subject: null,
      },
      {
        id: crypto.randomUUID(),
        name: 'Event Reminder J-1',
        category: 'utility',
        languageCode: 'fr',
        status: 'active',
        channel: 'whatsapp',
        type: 'reminder_1d',
        variables: ['firstName', 'eventTitle', 'eventDate', 'venueName'],
        body: [
          `⏰ *Dernier rappel*`,
          ``,
          `Bonjour {{firstName}},`,
          ``,
          `L'événement *{{eventTitle}}* commence *demain* !`,
          ``,
          `Date : {{eventDate}}`,
          `Lieu : {{venueName}}`,
          ``,
          `À demain !`,
        ].join('\n'),
        subject: null,
      },
    ]

    for (const tpl of defaults) {
      const existing = await WhatsAppTemplate.query()
        .where('channel', tpl.channel)
        .where('type', tpl.type)
        .first()
      if (!existing) {
        await WhatsAppTemplate.create(tpl as any)
        console.log(`[Seeder] Created template: ${tpl.name}`)
      }
    }
  }
}
