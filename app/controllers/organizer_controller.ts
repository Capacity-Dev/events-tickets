import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Category from '#models/category'
import TicketType from '#models/ticket_type'

export default class OrganizerController {
  async index({ inertia, auth }: HttpContext) {
    const events = await Event.query()
      .where('organizerId', auth.user!.id)
      .preload('category')
      .preload('ticketTypes')
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('dashboard/organizer/events', { events })
  }

  async create({ inertia }: HttpContext) {
    const categories = await Category.query().orderBy('displayOrder', 'asc')
    return (inertia.render as any)('dashboard/organizer/events_create', { categories })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.all()

    const event = await Event.create({
      id: crypto.randomUUID(),
      organizerId: auth.user!.id,
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: data.description ?? null,
      categoryId: data.categoryId ?? null,
      venueName: data.venueName ?? null,
      venueAddress: data.venueAddress ?? null,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      coverImageUrl: data.coverImageUrl ?? null,
      status: 'draft',
      isFeatured: false,
    })

    if (data.ticketTypes && Array.isArray(data.ticketTypes)) {
      await TicketType.createMany(
        data.ticketTypes.map((t: any) => ({
          id: crypto.randomUUID(),
          eventId: event.id,
          name: String(t.name),
          description: t.description ? String(t.description) : null,
          basePrice: Number(t.basePrice),
          currency: t.currency ?? 'USD',
          quantityTotal: Number(t.quantityTotal),
          quantitySold: 0,
          quantityReserved: 0,
          maxPerOrder: t.maxPerOrder ? Number(t.maxPerOrder) : null,
          salesStartAt: t.salesStartAt ?? null,
          salesEndAt: t.salesEndAt ?? null,
          status: 'active',
          sortOrder: t.sortOrder ?? 0,
        }))
      )
    }

    response.redirect().toRoute('dashboard.organizer.events')
  }

  async edit({ inertia, params, response, auth }: HttpContext) {
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .preload('ticketTypes')
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    const categories = await Category.query().orderBy('displayOrder', 'asc')
    return (inertia.render as any)('dashboard/organizer/events_create', { event, categories })
  }

  async update({ request, response, params, auth }: HttpContext) {
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    const data = request.all()
    event.merge({
      title: data.title,
      slug: data.slug ?? event.slug,
      description: data.description ?? event.description,
      categoryId: data.categoryId ?? event.categoryId,
      venueName: data.venueName ?? event.venueName,
      venueAddress: data.venueAddress ?? event.venueAddress,
      startDate: data.startDate ?? event.startDate,
      endDate: data.endDate ?? event.endDate,
      coverImageUrl: data.coverImageUrl ?? event.coverImageUrl,
    })
    await event.save()

    if (data.ticketTypes && Array.isArray(data.ticketTypes)) {
      await TicketType.query().where('eventId', event.id).delete()

      await TicketType.createMany(
        data.ticketTypes.map((t: any) => ({
          id: crypto.randomUUID(),
          eventId: event.id,
          name: String(t.name),
          description: t.description ? String(t.description) : null,
          basePrice: Number(t.basePrice),
          currency: t.currency ?? 'USD',
          quantityTotal: Number(t.quantityTotal),
          quantitySold: 0,
          quantityReserved: 0,
          maxPerOrder: t.maxPerOrder ? Number(t.maxPerOrder) : null,
          salesStartAt: t.salesStartAt ?? null,
          salesEndAt: t.salesEndAt ?? null,
          status: 'active',
          sortOrder: t.sortOrder ?? 0,
        }))
      )
    }

    response.redirect().toRoute('dashboard.organizer.events')
  }

  async destroy({ params, response, auth }: HttpContext) {
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    await event.delete()
    response.redirect().toRoute('dashboard.organizer.events')
  }

  async publish({ params, response, auth }: HttpContext) {
    const event = await Event.query()
      .where('id', params.id)
      .where('organizerId', auth.user!.id)
      .first()

    if (!event) {
      return response.status(404).send('Event not found')
    }

    event.status = 'pending_approval'
    await event.save()

    response.redirect().toRoute('dashboard.organizer.events')
  }
}
