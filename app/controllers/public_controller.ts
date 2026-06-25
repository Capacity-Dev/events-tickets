import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import Event from '#models/event'
import Category from '#models/category'
import Ticket from '#models/ticket'
import { loadActiveCurrencies, getCurrencySymbol } from '../helpers/currency.js'

export default class PublicController {
  async home({ view }: HttpContext) {
    const currencies = await loadActiveCurrencies()

    const enrich = (events: Event[]) =>
      events.map((e) => {
        const serialized = e.toJSON() as Record<string, unknown>
        serialized.minPrice = (e as unknown as { minPrice: number | null }).minPrice ?? null
        serialized.formattedDate = e.startDate.toFormat('MMMM d, yyyy · h:mm a')
        serialized.currencySymbol = getCurrencySymbol(currencies, (e as any).currency)
        return serialized
      })

    const featuredEvents = await Event.query()
      .where('status', 'published')
      .andWhere('is_frozen', false)
      .andWhere('isFeatured', true)
      .preload('category')
      .select('*')
      .select(
        Event.query()
          .from('ticket_types')
          .whereRaw('ticket_types.event_id = events.id')
          .andWhere('ticket_types.status', 'active')
          .min('base_price')
          .as('min_price')
      )
      .orderBy('startDate', 'asc')
      .limit(6)

    const recentEvents = await Event.query()
      .where('status', 'published')
      .andWhere('is_frozen', false)
      .andWhere('isFeatured', false)
      .preload('category')
      .select('*')
      .select(
        Event.query()
          .from('ticket_types')
          .whereRaw('ticket_types.event_id = events.id')
          .andWhere('ticket_types.status', 'active')
          .min('base_price')
          .as('min_price')
      )
      .orderBy('startDate', 'asc')
      .limit(6)

    return view.render('home', {
      featuredEvents: enrich(featuredEvents),
      recentEvents: enrich(recentEvents),
    })
  }

  async index({ view, request }: HttpContext) {
    const currencies = await loadActiveCurrencies()
    const page = Number(request.input('page', 1))
    const categorySlug = request.input('category', '')
    const q = request.input('q', '')
    const from = request.input('from', '')
    const to = request.input('to', '')
    const limit = 12

    const query = Event.query()
      .where('events.status', 'published')
      .andWhere('events.is_frozen', false)
      .preload('category')
      .orderBy('startDate', 'asc')

    if (categorySlug) {
      const category = await Category.findBy('slug', categorySlug)
      if (category) {
        query.where('categoryId', category.id)
      }
    }

    if (from) {
      query.where('startDate', '>=', new Date(from))
    }

    if (to) {
      query.where('startDate', '<=', new Date(to))
    }

    if (q) {
      query.whereILike('title', `%${q}%`)
    }

    const events = await query.paginate(page, limit)
    const categories = await Category.query().orderBy('displayOrder', 'asc')

    const queryString = new URLSearchParams()
    if (categorySlug) queryString.set('category', categorySlug)
    if (q) queryString.set('q', q)
    if (from) queryString.set('from', from)
    if (to) queryString.set('to', to)

    return view.render('events/index', {
      events: events.all(),
      total: events.getMeta().total,
      page: events.getMeta().currentPage,
      pages: events.getMeta().lastPage,
      categories,
      selectedCategory: categorySlug,
      q,
      from,
      to,
      queryString: queryString.toString(),
      currencySymbol: currencies.length > 0 ? currencies[0].symbol : '$',
    })
  }

  async show({ view, response, params }: HttpContext) {
    const currencies = await loadActiveCurrencies()
    const event = await Event.query()
      .where('slug', params.slug)
      .where('status', 'published')
      .andWhere('is_frozen', false)
      .preload('category')
      .preload('organizer')
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
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
    const safeDesc = event.description ? event.description.replace(/"/g, '\\"').slice(0, 500) : ''
    const head = `
    <meta name="description" content="${event.description ? event.description.slice(0, 160) : 'Event details'}" />
    <meta property="og:site_name" content="Mbiyo Events" />
    <meta property="og:title" content="${event.title}" />
    <meta property="og:description" content="${event.description ? event.description.slice(0, 200) : ''}" />
    <meta property="og:url" content="${appUrlVal}/events/${event.slug}" />
    <meta property="og:type" content="website" />
    ${event.coverImageUrl
      ? `<meta property="og:image" content="${appUrlVal}${event.coverImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />`
      : ``
    }
    <meta name="twitter:card" content="${event.coverImageUrl ? 'summary_large_image' : 'summary'}" />
    <meta name="twitter:title" content="${event.title}" />
    <meta name="twitter:description" content="${event.description ? event.description.slice(0, 200) : ''}" />
    <meta name="twitter:image" content="${appUrlVal}${event.coverImageUrl || ''}" />
    <meta name="twitter:image:alt" content="${event.title}" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "${event.title}",
        "description": "${safeDesc}",
        "startDate": "${event.startDate.toISO()}",
        ${event.endDate ? `"endDate": "${event.endDate.toISO()}",` : ''}
        "location": {
          "@type": "Place",
          "name": "${event.venueName ?? ''}",
          "address": "${event.venueAddress ?? ''}"
        },
        "organizer": {
          "@type": "Person",
          "name": "${event.organizer.fullName ?? 'Organizer'}"
        }
      }
    </script>
  `

    return view.render('events/show', {
      event,
      ticketTypes: enrichedTicketTypes,
      appUrl: appUrlVal,
      pageHead: head,
    })
  }

  async search({ request }: HttpContext) {
    const q = request.input('q', '')
    const categorySlug = request.input('category', '')
    const page = Number(request.input('page', 1))
    const limit = 20

    const query = Event.query()
      .where('status', 'published')
      .andWhere('is_frozen', false)
      .preload('category')
      .orderBy('startDate', 'asc')

    if (q) {
      query.whereILike('title', `%${q}%`)
    }

    if (categorySlug) {
      const category = await Category.findBy('slug', categorySlug)
      if (category) {
        query.where('categoryId', category.id)
      }
    }

    const result = await query.paginate(page, limit)
    const events = result.all().map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      category: e.category?.name ?? null,
      date: e.startDate.toISO(),
      venue: e.venueName,
      status: e.status,
    }))

    return {
      data: events,
      meta: {
        total: result.getMeta().total,
        page: result.getMeta().currentPage,
        lastPage: result.getMeta().lastPage,
      },
    }
  }

  async showTicket({ params, view }: HttpContext) {
    const ticket = await Ticket.query()
      .where('uuid', params.uuid)
      .preload('event', (q) => q.preload('category'))
      .preload('ticketType')
      .preload('orderItem', (q) => q.preload('order'))
      .first()

    if (!ticket) {
      return view.render('errors/not_found')
    }

    return view.render('tickets/show', { ticket, appUrl: env.get('APP_URL') })
  }

  async sitemap({ response }: HttpContext) {
    const events = await Event.query()
      .where('status', 'published')
      .andWhere('is_frozen', false)
      .select('slug', 'updatedAt')
      .orderBy('updatedAt', 'desc')

    const baseUrl = env.get('APP_URL')
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n  </url>\n`
    xml += `  <url>\n    <loc>${baseUrl}/events</loc>\n    <priority>0.9</priority>\n  </url>\n`
    for (const e of events) {
      xml += `  <url>\n    <loc>${baseUrl}/events/${e.slug}</loc>\n`
      if (e.updatedAt) {
        xml += `    <lastmod>${e.updatedAt.toISODate()}</lastmod>\n`
      }
      xml += `    <priority>0.7</priority>\n  </url>\n`
    }
    xml += `</urlset>`

    response.header('Content-Type', 'application/xml')
    return xml
  }
}
