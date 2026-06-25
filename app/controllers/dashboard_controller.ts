import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Order from '#models/order'
import TicketType from '#models/ticket_type'
import { loadActiveCurrencies } from '../helpers/currency.js'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const events = await Event.query().where('organizerId', user.id).orderBy('createdAt', 'desc')

    const eventIds = events.map((e) => e.id)
    const currencies = await loadActiveCurrencies()

    let totalSold = 0
    let totalRevenue = 0

    if (eventIds.length > 0) {
      const ticketTypes = await TicketType.query()
        .whereIn('eventId', eventIds)
        .preload('event')
      totalSold = ticketTypes.reduce((s, t) => s + (t.quantitySold ?? 0), 0)

      totalRevenue = ticketTypes.reduce((s, t) => {
        const revenue = (t.quantitySold ?? 0) * Number(t.basePrice)
        const eventCurrency = (t.event as any).currency ?? 'USD'
        const currencyInfo = currencies.find((c) => c.code === eventCurrency)
        const rate = currencyInfo ? parseFloat(currencyInfo.exchangeRate) || 1 : 1
        return s + revenue / rate
      }, 0)
    }

    const orders = await Order.query()
      .where('buyerId', user.id)
      .preload('items')
      .orderBy('createdAt', 'desc')
      .limit(5)

    const totalOrders = await Order.query().where('buyerId', user.id).count('* as total')

    const stats = {
      totalEvents: events.length,
      totalSold,
      totalRevenue,
      totalOrders: totalOrders.length > 0 ? ((totalOrders[0].$extras as any).total ?? 0) : 0,
      recentEvents: events.slice(0, 5).map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status,
        startDate: e.startDate.toISO(),
      })),
      recentOrders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        totalGrossAmount: o.totalGrossAmount,
        itemsCount: o.items?.length ?? 0,
        createdAt: o.createdAt?.toISO() ?? null,
      })),
    }

    return inertia.render('dashboard/index', { stats, currencies })
  }
}
