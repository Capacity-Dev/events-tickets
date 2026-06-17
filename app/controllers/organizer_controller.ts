import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { writeFile, mkdir } from 'node:fs/promises'
import Event from '#models/event'
import Category from '#models/category'
import Currency from '#models/currency'
import TicketType from '#models/ticket_type'
import Ticket from '#models/ticket'
import Order from '#models/order'
import Payout from '#models/payout'
import { createEventValidator, updateEventValidator } from '#validators/event'
import { loadActiveCurrencies } from '../helpers/currency.js'

export default class OrganizerController {
  async index({ inertia, auth }: HttpContext) {
    const currencies = await loadActiveCurrencies()
    const events = await Event.query()
      .where('organizerId', auth.user!.id)
      .preload('category')
      .preload('ticketTypes')
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('dashboard/organizer/events', { events, currencies })
  }

  async create({ inertia }: HttpContext) {
    const categories = await Category.query().orderBy('displayOrder', 'asc')
    const currencies = await Currency.query().where('isActive', true).orderBy('sortOrder', 'asc')
    return (inertia.render as any)('dashboard/organizer/events_create', { categories, currencies })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const raw = (await request.validateUsing(createEventValidator)) as any

    try {
      let coverImageUrl: string | null = null
      const coverImage = raw.coverImage
      if (coverImage && typeof coverImage === 'string' && coverImage.startsWith('data:image/')) {
        const matches = coverImage.match(/^data:image\/(\w+);base64,(.+)$/)
        if (matches) {
          const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
          const base64Data = matches[2]
          const fileName = `${crypto.randomUUID()}.${ext}`
          const filePath = `public/uploads/${fileName}`
          await mkdir('public/uploads', { recursive: true })
          await writeFile(filePath, Buffer.from(base64Data, 'base64'))
          coverImageUrl = `/uploads/${fileName}`
        }
      }

      const safeTitle = String(raw.title).trim()
      const event = await Event.create({
        id: crypto.randomUUID(),
        organizerId: auth.user!.id,
        title: safeTitle,
        slug: safeTitle
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        description: raw.description ?? null,
        categoryId: raw.categoryId || null,
        venueName: raw.venueName ?? null,
        venueAddress: raw.venueAddress ?? null,
        startDate: DateTime.fromISO(raw.startDate),
        endDate: raw.endDate ? DateTime.fromISO(raw.endDate) : null,
        coverImageUrl: coverImageUrl ?? null,
        status: 'draft',
        isFeatured: false,
      })

      if (raw.ticketTypes && Array.isArray(raw.ticketTypes)) {
        await TicketType.createMany(
          raw.ticketTypes.map((t: any) => ({
            id: crypto.randomUUID(),
            eventId: event.id,
            name: String(t.name),
            description: t.description ? String(t.description) : null,
            basePrice: t.basePrice,
            currency: t.currency ?? 'USD',
            quantityTotal: t.quantityTotal,
            quantitySold: 0,
            quantityReserved: 0,
            maxPerOrder: t.maxPerOrder ? t.maxPerOrder : null,
            salesStartAt: t.salesStartAt ?? null,
            salesEndAt: t.salesEndAt ?? null,
            status: 'active',
            sortOrder: t.sortOrder ?? 0,
          })) as any
        )
      }

      session.flash('success', 'Événement créé avec succès')
      return response.redirect().toRoute('dashboard.events')
    } catch (err: any) {
      session.flash('error', 'Erreur lors de la création : ' + (err.message || 'Erreur inconnue'))
      return response.redirect().back()
    }
  }

  async edit({ inertia, params, response, auth }: HttpContext) {
    if (!params.id || params.id === 'undefined') return response.notFound()
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .preload('ticketTypes')
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    const categories = await Category.query().orderBy('displayOrder', 'asc')
    const currencies = await Currency.query().where('isActive', true).orderBy('sortOrder', 'asc')
    return (inertia.render as any)('dashboard/organizer/events_create', {
      event: event.toJSON(),
      categories,
      currencies,
    })
  }

  async update({ request, response, params, auth, session }: HttpContext) {
    if (!params.id || params.id === 'undefined') return response.notFound()
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) {
      session.flash('error', 'Événement introuvable')
      return response.redirect().toRoute('dashboard.events')
    }

    const raw = (await request.validateUsing(updateEventValidator)) as any

    try {
      let coverImageUrl: string | null = null
      const coverImage = raw.coverImage
      if (coverImage && typeof coverImage === 'string' && coverImage.startsWith('data:image/')) {
        const matches = coverImage.match(/^data:image\/(\w+);base64,(.+)$/)
        if (matches) {
          const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
          const base64Data = matches[2]
          const fileName = `${crypto.randomUUID()}.${ext}`
          const filePath = `public/uploads/${fileName}`
          await mkdir('public/uploads', { recursive: true })
          await writeFile(filePath, Buffer.from(base64Data, 'base64'))
          coverImageUrl = `/uploads/${fileName}`
        }
      }

      event.merge({
        title: raw.title ?? event.title,
        description: raw.description ?? event.description,
        categoryId: raw.categoryId ?? event.categoryId,
        venueName: raw.venueName ?? event.venueName,
        venueAddress: raw.venueAddress ?? event.venueAddress,
        startDate: raw.startDate ? DateTime.fromISO(raw.startDate) : event.startDate,
        endDate: raw.endDate ? DateTime.fromISO(raw.endDate) : event.endDate,
        coverImageUrl: coverImageUrl ?? event.coverImageUrl,
      })
      await event.save()

      if (raw.ticketTypes && Array.isArray(raw.ticketTypes)) {
        await TicketType.query().where('eventId', event.id).delete()

        await TicketType.createMany(
          raw.ticketTypes.map((t: any) => ({
            id: crypto.randomUUID(),
            eventId: event.id,
            name: String(t.name),
            description: t.description ? String(t.description) : null,
            basePrice: t.basePrice,
            currency: t.currency ?? 'USD',
            quantityTotal: t.quantityTotal,
            quantitySold: 0,
            quantityReserved: 0,
            maxPerOrder: t.maxPerOrder ? t.maxPerOrder : null,
            salesStartAt: t.salesStartAt ?? null,
            salesEndAt: t.salesEndAt ?? null,
            status: 'active',
            sortOrder: t.sortOrder ?? 0,
          })) as any
        )
      }

      session.flash('success', 'Événement mis à jour')
      return response.redirect().toRoute('dashboard.events')
    } catch (err: any) {
      session.flash(
        'error',
        'Erreur lors de la mise à jour : ' + (err.message || 'Erreur inconnue')
      )
      return response.redirect().back()
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    if (!params.id || params.id === 'undefined') return response.notFound()
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    await event.delete()
    response.redirect().toRoute('dashboard.events')
  }

  async publish({ params, response, auth }: HttpContext) {
    if (!params.id || params.id === 'undefined') return response.notFound()
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    event.status = 'published'
    await event.save()

    response.redirect().toRoute('dashboard.events')
  }

  async analytics({ inertia, params, auth }: HttpContext) {
    if (!params.id || params.id === 'undefined')
      return inertia.render('errors/not_found', {} as any)
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .preload('ticketTypes')
      .preload('category')
      .first()

    if (!event) return inertia.render('errors/not_found', {} as any)

    const ticketTypes = event.ticketTypes
    const totalSold = ticketTypes.reduce((s, t) => s + (t.quantitySold ?? 0), 0)
    const totalCapacity = ticketTypes.reduce((s, t) => s + t.quantityTotal, 0)

    const ticketCountResult = await Ticket.query().where('eventId', event.id).count('* as total')
    const checkedInResult = await Ticket.query()
      .where('eventId', event.id)
      .whereNotNull('checkedInAt')
      .count('* as total')

    const orderItemRows = await Ticket.query()
      .where('eventId', event.id)
      .join('order_items', 'order_items.id', 'tickets.order_item_id')
      .select('order_items.order_id')
      .distinct()

    const orderIds = orderItemRows.map((r) => (r.$extras as any).order_id as string)

    let totalRevenue = 0
    const recentOrders: any[] = []
    const buyerMap = new Map<string, any>()
    const dailySales = new Map<string, { count: number; revenue: number }>()

    if (orderIds.length > 0) {
      const orders = await Order.query()
        .whereIn('id', orderIds)
        .where('status', 'paid')
        .preload('items', (iq) => {
          iq.whereHas('tickets', (tq) => tq.where('eventId', event.id))
          iq.preload('ticketType')
          iq.preload('tickets')
        })
        .preload('buyer')
        .orderBy('createdAt', 'desc')

      totalRevenue = orders.reduce((s, o) => s + Number(o.totalGrossAmount), 0)

      for (const order of orders) {
        const dateKey = order.createdAt ? order.createdAt.toISODate()! : ''
        const dayEntry = dailySales.get(dateKey) || { count: 0, revenue: 0 }
        dayEntry.count += order.items.reduce((s, i) => s + i.quantity, 0)
        dayEntry.revenue += Number(order.totalGrossAmount)
        dailySales.set(dateKey, dayEntry)

        const ticketCount = order.items.reduce((s, i) => s + i.quantity, 0)

        recentOrders.push({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalGrossAmount: order.totalGrossAmount,
          ticketCount,
          createdAt: order.createdAt?.toISO() ?? null,
          buyerName: order.buyer?.fullName ?? order.guestEmail ?? order.guestPhone ?? 'Guest',
          buyerEmail: order.buyer?.email ?? order.guestEmail ?? null,
        })

        if (order.buyer) {
          const buyer = order.buyer
          const existing = buyerMap.get(String(buyer.id))
          if (existing) {
            existing.totalSpent += Number(order.totalGrossAmount)
            existing.ticketCount += ticketCount
          } else {
            buyerMap.set(String(buyer.id), {
              id: buyer.id,
              name: buyer.fullName ?? 'Unknown',
              email: buyer.email ?? null,
              totalSpent: Number(order.totalGrossAmount),
              ticketCount,
            })
          }
        } else if (order.guestEmail || order.guestPhone) {
          const key = (order.guestEmail || order.guestPhone)!
          const existing = buyerMap.get(key)
          if (existing) {
            existing.totalSpent += Number(order.totalGrossAmount)
            existing.ticketCount += ticketCount
          } else {
            buyerMap.set(key, {
              id: key,
              name: order.guestEmail ?? order.guestPhone!,
              email: order.guestEmail ?? null,
              totalSpent: Number(order.totalGrossAmount),
              ticketCount,
            })
          }
        }
      }
    }

    const buyers = Array.from(buyerMap.values())

    const salesTimeline = Array.from(dailySales.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const stats = {
      totalSold,
      totalCapacity,
      fillRate: totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0,
      totalRevenue,
      ticketCount: Number((ticketCountResult[0].$extras as any).total ?? 0),
      checkedInCount: Number((checkedInResult[0].$extras as any).total ?? 0),
      uniqueBuyers: buyers.length,
      recentOrders: recentOrders.slice(0, 20),
      buyers,
      salesTimeline,
    }

    const currencies = await loadActiveCurrencies()
    return (inertia.render as any)('dashboard/organizer/analytics', {
      event: event.toJSON(),
      stats,
      currencies,
    })
  }

  async updateTicketType({ params, request, response, auth, session }: HttpContext) {
    if (
      !params.id ||
      params.id === 'undefined' ||
      !params.ticketTypeId ||
      params.ticketTypeId === 'undefined'
    ) {
      return response.redirect().toRoute('dashboard.events')
    }
    const ticketType = await TicketType.query()
      .where('id', params.ticketTypeId)
      .whereHas('event', (q) => {
        q.where('organizerId', auth.user!.id).where('id', params.id)
      })
      .first()

    if (!ticketType) {
      session.flash('error', 'Type de billet introuvable')
      return response.redirect().back()
    }

    ticketType.merge({
      quantityTotal: Number(request.input('quantityTotal')),
      basePrice: String(request.input('basePrice')),
    })
    await ticketType.save()

    session.flash('success', 'Type de billet mis à jour')
    response.redirect().back()
  }

  async checkIn({ inertia, params, auth }: HttpContext) {
    if (!params.id || params.id === 'undefined')
      return inertia.render('errors/not_found', {} as any)
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) return inertia.render('errors/not_found', {} as any)

    return (inertia.render as any)('dashboard/organizer/check_in', { event: event.toJSON() })
  }

  async scanTicket({ params, request, response, auth }: HttpContext) {
    if (!params.id || params.id === 'undefined')
      return response.status(404).json({ error: 'Event not found' })

    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) return response.status(404).json({ error: 'Event not found' })

    let ticketUuid = request.input('ticketUuid', '').trim()

    if (!ticketUuid) return response.status(422).json({ error: 'Ticket UUID is required' })

    if (ticketUuid.includes('/tickets/')) {
      ticketUuid = ticketUuid.split('/tickets/').pop()!.split('?')[0]
    }

    const ticket = await Ticket.query()
      .where('uuid', ticketUuid)
      .preload('ticketType')
      .preload('orderItem', (q) => q.preload('order', (q2) => q2.preload('buyer')))
      .first()

    if (!ticket) return response.status(404).json({ error: 'Ticket not found' })

    if (ticket.eventId !== event.id)
      return response.status(400).json({ error: 'This ticket belongs to a different event' })

    if (ticket.status !== 'valid')
      return response.status(400).json({ error: 'Ticket already used', checkedInAt: ticket.checkedInAt })

    ticket.status = 'used'
    ticket.checkedInAt = DateTime.now()
    ticket.usedAt = DateTime.now()
    ticket.usedByScannerId = auth.user!.id
    await ticket.save()

    return response.json({
      success: true,
      ticket: {
        ticketNumber: ticket.ticketNumber,
        uuid: ticket.uuid,
        ticketType: ticket.ticketType?.name ?? '—',
        checkedInAt: ticket.checkedInAt,
        buyerName:
          ticket.orderItem?.order?.buyer?.fullName ??
          ticket.orderItem?.order?.guestEmail ??
          'Guest',
        buyerEmail: ticket.orderItem?.order?.buyer?.email ?? ticket.orderItem?.order?.guestEmail ?? '',
      },
    })
  }

  async eventTickets({ params, request, response, auth }: HttpContext) {
    if (!params.id || params.id === 'undefined')
      return response.status(404).json({ error: 'Event not found' })

    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) return response.status(404).json({ error: 'Event not found' })

    const page = Number(request.input('page', 1))
    const q = request.input('q', '').trim()

    const query = Ticket.query()
      .where('eventId', event.id)
      .preload('ticketType')
      .preload('orderItem', (q2) => q2.preload('order', (q3) => q3.preload('buyer')))
      .orderBy('checkedInAt', 'asc')
      .orderBy('ticketNumber', 'asc')

    if (q) {
      query.where('ticketNumber', q).orWhere('uuid', q)
    }

    const tickets = await query.paginate(page, 50)

    return response.json({
      data: tickets.all().map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        uuid: t.uuid,
        status: t.status,
        checkedInAt: t.checkedInAt,
        ticketType: t.ticketType?.name ?? '—',
        buyerName:
          t.orderItem?.order?.buyer?.fullName ??
          t.orderItem?.order?.guestEmail ??
          'Guest',
      })),
      pagination: tickets.getMeta(),
    })
  }

  async payouts({ inertia, auth }: HttpContext) {
    const payouts = await Payout.query()
      .where('organizerId', auth.user!.id)
      .orderBy('createdAt', 'desc')

    const currencies = await Currency.query().where('isActive', true).orderBy('sortOrder', 'asc')
    const events = await Event.query().where('organizerId', auth.user!.id).orderBy('title', 'asc')

    return (inertia.render as any)('dashboard/organizer/payouts', { payouts, currencies, events })
  }

  async clients({ inertia, auth, request }: HttpContext) {
    const { search, eventId } = request.qs()
    const currencies = await loadActiveCurrencies()

    const organizerEvents = await Event.query().where('organizerId', auth.user!.id).select('id')

    const eventIds = organizerEvents.map((e) => e.id)

    if (eventIds.length === 0) {
      return (inertia.render as any)('dashboard/organizer/clients', {
        clients: [],
        allEvents: [],
        currencies,
        search: '',
        eventId: '',
      })
    }

    const allEvents = await Event.query()
      .where('organizerId', auth.user!.id)
      .orderBy('title', 'asc')

    let ticketQuery = Ticket.query().whereIn('eventId', eventIds)
    if (eventId) ticketQuery = ticketQuery.where('eventId', eventId)

    const orderItemRows = await ticketQuery
      .join('order_items', 'order_items.id', 'tickets.order_item_id')
      .select('order_items.order_id')
      .distinct()

    const orderIds = orderItemRows.map((r) => (r.$extras as any).order_id as string)

    if (orderIds.length === 0) {
      return (inertia.render as any)('dashboard/organizer/clients', {
        clients: [],
        allEvents,
        currencies,
        search: search || '',
        eventId: eventId || '',
      })
    }

    let ordersQuery = Order.query().whereIn('id', orderIds).where('status', 'paid')

    if (search) {
      const term = `%${search}%`
      ordersQuery = ordersQuery.where((q) => {
        q.whereHas('buyer', (bq) => {
          bq.where('fullName', 'ilike', term).orWhere('email', 'ilike', term)
        })
          .orWhere('guestEmail', 'ilike', term)
          .orWhere('guestPhone', 'ilike', term)
      })
    }

    const orders = await ordersQuery
      .preload('items', (iq) => iq.preload('tickets'))
      .preload('buyer')

    const buyerMap = new Map<string, any>()

    for (const order of orders) {
      const ticketCount = order.items.reduce((s, i) => s + i.quantity, 0)

      const orderEventIds = new Set<string>()
      for (const item of order.items) {
        for (const ticket of item.tickets) {
          if (ticket.eventId) orderEventIds.add(ticket.eventId)
        }
      }

      if (order.buyer) {
        const buyer = order.buyer
        const existing = buyerMap.get(String(buyer.id))
        if (existing) {
          existing.totalSpent += Number(order.totalGrossAmount)
          existing.ticketCount += ticketCount
          for (const eid of orderEventIds) existing.eventIds.add(eid)
        } else {
          buyerMap.set(String(buyer.id), {
            id: buyer.id,
            name: buyer.fullName ?? 'Unknown',
            email: buyer.email ?? null,
            totalSpent: Number(order.totalGrossAmount),
            ticketCount,
            eventIds: new Set(orderEventIds),
          })
        }
      } else if (order.guestEmail || order.guestPhone) {
        const key = (order.guestEmail || order.guestPhone)!
        const existing = buyerMap.get(key)
        if (existing) {
          existing.totalSpent += Number(order.totalGrossAmount)
          existing.ticketCount += ticketCount
          for (const eid of orderEventIds) existing.eventIds.add(eid)
        } else {
          buyerMap.set(key, {
            id: key,
            name: order.guestEmail ?? order.guestPhone!,
            email: order.guestEmail ?? null,
            totalSpent: Number(order.totalGrossAmount),
            ticketCount,
            eventIds: new Set(orderEventIds),
          })
        }
      }
    }

    const clients = Array.from(buyerMap.values()).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      totalSpent: c.totalSpent,
      ticketCount: c.ticketCount,
      eventCount: c.eventIds.size,
    }))

    return (inertia.render as any)('dashboard/organizer/clients', {
      clients,
      allEvents,
      currencies,
      search: search || '',
      eventId: eventId || '',
    })
  }

  async requestPayout({ request, response, auth, session }: HttpContext) {
    const data = request.all()

    if (!data.amount || Number(data.amount) <= 0) {
      session.flash('error', 'Veuillez entrer un montant valide')
      return response.redirect().back()
    }

    await Payout.create({
      id: crypto.randomUUID(),
      organizerId: auth.user!.id,
      eventId: data.eventId || null,
      amount: String(data.amount),
      currency: data.currency ?? 'USD',
      status: 'pending',
      payoutMethod: data.payoutMethod ?? 'mobile_money',
      phoneNumber: data.phoneNumber ?? null,
      network: data.network ?? null,
      beneficiary: data.beneficiary ?? null,
      requestedAt: DateTime.now(),
    })

    session.flash('success', 'Demande de paiement envoyée')
    response.redirect().toRoute('dashboard.payouts')
  }
}
