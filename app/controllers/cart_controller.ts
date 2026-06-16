import type { HttpContext } from '@adonisjs/core/http'
import TicketType from '#models/ticket_type'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Ticket from '#models/ticket'
import User from '#models/user'
import Role from '#models/role'
import Profile from '#models/profile'
import { DateTime } from 'luxon'

export default class CartController {
  async add({ request, session, response }: HttpContext) {
    const ticketTypeId = request.input('ticketTypeId')
    const quantity = Number(request.input('quantity', 1))

    const ticketType = await TicketType.find(ticketTypeId)
    if (!ticketType) {
      session.flash('error', 'Ticket type not found')
      return response.redirect().back()
    }

    const cart = (session.get('cart') ?? []) as Array<{ ticketTypeId: string; name: string; price: number; quantity: number }>
    const existing = cart.find((c) => c.ticketTypeId === ticketTypeId)

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({
        ticketTypeId,
        name: ticketType.name,
        price: Number(ticketType.basePrice),
        quantity,
      })
    }

    session.put('cart', cart)
    session.flash('success', 'Added to cart')
    response.redirect().back()
  }

  async cart({ inertia, session }: HttpContext) {
    const cart = (session.get('cart') ?? []) as Array<{ ticketTypeId: string; name: string; price: number; quantity: number }>
    const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)

    return (inertia.render as any)('checkout/cart', { cart, total })
  }

  async checkout({ inertia }: HttpContext) {
    return (inertia.render as any)('checkout/checkout', {})
  }

  async storeGuestOrder({ request, response, session, auth }: HttpContext) {
    const cart = (session.get('cart') ?? []) as Array<{ ticketTypeId: string; name: string; price: number; quantity: number }>

    if (cart.length === 0) {
      session.flash('error', 'Cart is empty')
      return response.redirect().back()
    }

    const email = request.input('email')
    const name = request.input('fullName', '')

    let buyerId: number | null = null

    if (auth.user) {
      buyerId = auth.user.id
    } else if (email) {
      let user = await User.findBy('email', email)

      if (!user) {
        const buyerRole = await Role.findBy('name', 'buyer')
        user = await User.create({
          email,
          fullName: name || email.split('@')[0],
          roleId: buyerRole?.id ?? null,
        })
        await Profile.create({
          id: crypto.randomUUID(),
          userId: user.id,
          firstName: name.split(' ')[0] || email.split('@')[0],
          lastName: name.split(' ').slice(1).join(' ') || '',
        })
      }

      buyerId = user.id
    }

    const now = new Date()
    const orderNumber = `ORD-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`

    let totalGross = 0
    const itemData: Array<{ ticketTypeId: string; name: string; price: number; quantity: number }> = []

    for (const item of cart) {
      const ticketType = await TicketType.find(item.ticketTypeId)
      if (!ticketType) continue
      const lineTotal = item.price * item.quantity
      totalGross += lineTotal
      itemData.push({ ...item, price: lineTotal })
    }

    const order = await Order.create({
      id: crypto.randomUUID(),
      orderNumber,
      buyerId,
      guestEmail: !buyerId ? email : null,
      status: 'paid',
      totalGrossAmount: totalGross,
      platformFeeAmount: 0,
      organizerNetAmount: totalGross,
      paymentProcessorFee: 0,
      currency: 'USD',
      paidAt: DateTime.now(),
    })

    for (const item of cart) {
      const ticketType = await TicketType.find(item.ticketTypeId)
      if (!ticketType) continue

      const lineTotal = item.price * item.quantity

      const orderItem = await OrderItem.create({
        id: crypto.randomUUID(),
        orderId: order.id,
        ticketTypeId: item.ticketTypeId,
        unitPrice: item.price,
        quantity: item.quantity,
        lineTotal,
      })

      await TicketType.query().where('id', item.ticketTypeId).increment('quantitySold', item.quantity)
      await TicketType.query().where('id', item.ticketTypeId).decrement('quantityReserved', item.quantity)

      for (let i = 0; i < item.quantity; i++) {
        const uuid = crypto.randomUUID()
        const num = `${String(Date.now()).slice(-6)}${String(i).padStart(2, '0')}`
        await Ticket.create({
          id: crypto.randomUUID(),
          orderItemId: orderItem.id,
          eventId: ticketType.eventId,
          ticketTypeId: item.ticketTypeId,
          ticketNumber: `TKT-${num}`,
          uuid,
          qrToken: uuid,
          status: 'valid',
        })
      }
    }

    session.forget('cart')
    session.flash('success', 'Purchase complete! Tickets are ready.')

    if (auth.user) {
      response.redirect().toRoute('dashboard.buyer.orders.show', { id: order.id })
    } else {
      response.redirect().toRoute('events.index')
    }
  }
}
