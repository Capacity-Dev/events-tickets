import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Order from '#models/order'
import TicketType from '#models/ticket_type'
import OrderItem from '#models/order_item'
import Ticket from '#models/ticket'

export default class BuyerController {
  async orders({ inertia, auth }: HttpContext) {
    const orders = await Order.query()
      .where('buyerId', auth.user!.id)
      .preload('items', (q) => q.preload('ticketType'))
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('dashboard/buyer/orders', { orders })
  }

  async tickets({ inertia, auth }: HttpContext) {
    const tickets = await Ticket.query()
      .whereHas('orderItem', (q) => {
        q.whereHas('order', (oq) => {
          oq.where('buyerId', auth.user!.id)
        })
      })
      .preload('event')
      .preload('ticketType')
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('dashboard/buyer/tickets', { tickets })
  }

  async showOrder({ inertia, params, auth }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .where('buyerId', auth.user!.id)
      .preload('items', (q) => q.preload('ticketType'))
      .first()

    if (!order) {
      return inertia.render('errors/not_found', {} as any)
    }

    return (inertia.render as any)('dashboard/buyer/orders_show', { order })
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.all()
    const items = data.items as Array<{ ticketTypeId: string; quantity: number }>

    if (!items || items.length === 0) {
      return response.status(400).json({ error: 'Cart is empty' })
    }

    const ticketTypes = await TicketType.query().whereIn(
      'id',
      items.map((i) => i.ticketTypeId)
    )

    let totalGross = 0
    const orderItems: Array<{
      id: string
      ticketTypeId: string
      unitPrice: number
      quantity: number
      lineTotal: number
    }> = []

    for (const item of items) {
      const ticketType = ticketTypes.find((t) => t.id === item.ticketTypeId)
      if (!ticketType) {
        return response.status(400).json({ error: `Ticket type ${item.ticketTypeId} not found` })
      }

      const lineTotal = Number(ticketType.basePrice) * item.quantity
      totalGross += lineTotal

      orderItems.push({
        id: crypto.randomUUID(),
        ticketTypeId: ticketType.id,
        unitPrice: Number(ticketType.basePrice),
        quantity: item.quantity,
        lineTotal,
      })
    }

    const now = new Date()
    const orderNumber = `ORD-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`

    const order = await Order.create({
      id: crypto.randomUUID(),
      orderNumber,
      buyerId: auth.user!.id,
      status: 'pending',
      totalGrossAmount: totalGross,
      platformFeeAmount: 0,
      organizerNetAmount: totalGross,
      paymentProcessorFee: 0,
      currency: 'USD',
    })

    await OrderItem.createMany(
      orderItems.map((oi) => ({
        ...oi,
        orderId: order.id,
      }))
    )

    for (const item of items) {
      await TicketType.query()
        .where('id', item.ticketTypeId)
        .increment('quantityReserved', item.quantity)
    }

    response.redirect().toRoute('dashboard.buyer.orders.show', { id: order.id })
  }

  async pay({ params, response, auth }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .where('buyerId', auth.user!.id)
      .first()

    if (!order) return response.status(404).json({ error: 'Order not found' })
    if (order.status !== 'pending') return response.status(400).json({ error: 'Order cannot be paid' })

    order.status = 'paid'
    order.paidAt = DateTime.now()
    await order.save()

    const orderItems = await OrderItem.query().where('orderId', order.id).preload('ticketType')

    for (const item of orderItems) {
      if (item.ticketTypeId) {
        await TicketType.query()
          .where('id', item.ticketTypeId)
          .decrement('quantityReserved', item.quantity)
        await TicketType.query()
          .where('id', item.ticketTypeId)
          .increment('quantitySold', item.quantity)
      }

      const eventId = item.ticketTypeId
        ? (await TicketType.find(item.ticketTypeId))?.eventId
        : null

      for (let i = 0; i < item.quantity; i++) {
        const uuid = crypto.randomUUID()
        const num = `${String(Date.now()).slice(-6)}${String(i).padStart(2, '0')}`
        await Ticket.create({
          id: crypto.randomUUID(),
          orderItemId: item.id,
          eventId: eventId ?? '',
          ticketTypeId: item.ticketTypeId ?? '',
          ticketNumber: `TKT-${num}`,
          uuid,
          qrToken: uuid,
          status: 'valid',
        })
      }
    }

    response.redirect().toRoute('dashboard.buyer.orders.show', { id: order.id })
  }
}
