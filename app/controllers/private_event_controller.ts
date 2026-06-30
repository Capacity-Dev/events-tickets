import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import Event from '#models/event'
import { loadActiveCurrencies, getCurrencySymbol } from '../helpers/currency.js'

export default class PrivateEventController {
  async show({ view, response, params, session }: HttpContext) {
    const currencies = await loadActiveCurrencies()

    const event = await Event.query()
      .where('private_slug', params.privateSlug)
      .where('status', 'published')
      .andWhere('is_frozen', false)
      .preload('category')
      .preload('organizer')
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    if ((event as any).accessPassword) {
      const granted = session.get(`private_access_${event.id}`)
      if (!granted) {
        return view.render('events/private_gate', {
          title: event.title,
          privateSlug: params.privateSlug,
          error: null,
        })
      }
    }

    const ticketTypes = await event.related('ticketTypes').query().orderBy('sortOrder', 'asc')
    const eventCurrency = (event as any).currency ?? 'USD'

    const enrichedTicketTypes = ticketTypes.map((t) => {
      const sold = t.quantitySold ?? 0
      const reserved = t.quantityReserved ?? 0
      const remaining = t.quantityTotal - sold - reserved
      let availabilityClass = ''
      if (t.status === 'sold_out') {
        availabilityClass = 'sold-out'
      } else if (remaining > 0 && remaining <= 10) {
        availabilityClass = 'low'
      }
      return {
        ...t.toJSON(),
        remaining: Math.max(remaining, 0),
        availabilityClass,
        currencySymbol: getCurrencySymbol(currencies, (t as any).currency ?? eventCurrency),
      }
    })

    const appUrlVal = env.get('APP_URL')

    return view.render('events/show', {
      title: event.title,
      event,
      ticketTypes: enrichedTicketTypes,
      appUrl: appUrlVal,
      pageHead: '',
      isPrivate: true,
    })
  }

  async verifyPassword({ request, response, params, session, view }: HttpContext) {
    const event = await Event.query()
      .where('private_slug', params.privateSlug)
      .where('status', 'published')
      .andWhere('is_frozen', false)
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    const password = request.input('password', '')
    const valid = await hash.verify((event as any).accessPassword, password)

    if (!valid) {
      return view.render('events/private_gate', {
        title: event.title,
        privateSlug: params.privateSlug,
        error: 'Invalid password',
      })
    }

    session.put(`private_access_${event.id}`, true)
    return response.redirect(`/e/${params.privateSlug}`)
  }
}
