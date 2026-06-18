import type { HttpContext } from '@adonisjs/core/http'
import TicketType from '#models/ticket_type'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Ticket from '#models/ticket'
import User from '#models/user'
import Role from '#models/role'
import Profile from '#models/profile'
import Event from '#models/event'
import { DateTime } from 'luxon'
import { loadActiveCurrencies, getCurrencySymbol } from '../helpers/currency.js'

export default class CartController {
  async add({ request, session, response }: HttpContext) {
    const ticketTypeId = request.input('ticketTypeId')
    const quantity = Number(request.input('quantity', 1))

    const ticketType = await TicketType.find(ticketTypeId)
    if (!ticketType) {
      session.flash('error', 'Ticket type not found')
      return response.redirect().back()
    }

    const cart = (session.get('cart') ?? []) as Array<{
      ticketTypeId: string
      name: string
      price: number
      quantity: number
    }>
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

  async buy({ request, response, auth, session }: HttpContext) {
    const ticketTypeId = request.input('ticketTypeId')
    const quantity = Number(request.input('quantity', 1))
    const name = (request.input('name') ?? '').trim()
    const phone = (request.input('phone') ?? '').trim()
    const email = (request.input('email') ?? '').trim().toLowerCase()

    if (!name) {
      session.flash('error', 'Veuillez entrer votre nom')
      response.redirect().back()
      return
    }

    if (!phone && !email) {
      session.flash('error', 'Veuillez fournir un téléphone ou un email')
      response.redirect().back()
      return
    }

    const ticketType = await TicketType.find(ticketTypeId)
    if (!ticketType || ticketType.status !== 'active') {
      session.flash('error', "Ce type de billet n'est plus disponible")
      response.redirect().back()
      return
    }

    const remaining =
      ticketType.quantityTotal - (ticketType.quantitySold ?? 0) - (ticketType.quantityReserved ?? 0)
    if (remaining < quantity) {
      session.flash('error', 'Plus assez de places disponibles')
      response.redirect().back()
      return
    }

    const event = await Event.find(ticketType.eventId)
    if (!event || event.status !== 'published' || event.isFrozen) {
      session.flash('error', "Cet événement n'est plus disponible")
      response.redirect().back()
      return
    }

    const now = new Date()
    const orderId = crypto.randomUUID()
    const orderNumber = `ORD-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`
    const lineTotal = Number(ticketType.basePrice) * quantity

    await Order.create({
      id: orderId,
      orderNumber,
      buyerId: auth.user?.id ?? null,
      guestEmail: email || null,
      guestPhone: phone || null,
      guestName: name || null,
      status: 'pending',
      totalGrossAmount: lineTotal,
      platformFeeAmount: 0,
      organizerNetAmount: lineTotal,
      paymentProcessorFee: 0,
      currency: ticketType.currency ?? 'USD',
    } as any)

    await OrderItem.createMany([
      {
        id: crypto.randomUUID(),
        orderId: orderId,
        ticketTypeId: ticketType.id,
        unitPrice: Number(ticketType.basePrice),
        quantity,
        lineTotal,
      },
    ] as any)

    await TicketType.query().where('id', ticketType.id).increment('quantityReserved', quantity)

    session.flash('success', 'Commande créée. Veuillez procéder au paiement.')
    response.redirect().toRoute('payment.pay', { id: orderId })
  }

  async confirmation({ params, view }: HttpContext) {
    const currencies = await loadActiveCurrencies()
    const order = await Order.query()
      .where('id', params.id)
      .preload('items', (q) => q.preload('ticketType').preload('tickets'))
      .first()

    if (!order) {
      return view.render('errors/not_found')
    }

    return view.render('checkout/confirmation', {
      order,
      currencySymbol: getCurrencySymbol(currencies, order.currency),
    })
  }

  async cart({ inertia, session }: HttpContext) {
    const currencies = await loadActiveCurrencies()
    const cart = (session.get('cart') ?? []) as Array<{
      ticketTypeId: string
      name: string
      price: number
      quantity: number
    }>
    const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)

    return (inertia.render as any)('checkout/cart', { cart, total, currencies })
  }

  async checkout({ inertia }: HttpContext) {
    return (inertia.render as any)('checkout/checkout', {})
  }

  async storeGuestOrder({ request, response, session, auth }: HttpContext) {
    let cart = (session.get('cart') ?? []) as Array<{
      ticketTypeId: string
      name: string
      price: number
      quantity: number
    }>

    const directTicketTypeId = request.input('ticketTypeId')
    const directQuantity = Number(request.input('quantity', 1))

    if (cart.length === 0 && directTicketTypeId) {
      const ticketType = await TicketType.find(directTicketTypeId)
      if (ticketType) {
        cart = [
          {
            ticketTypeId: directTicketTypeId,
            name: ticketType.name,
            price: Number(ticketType.basePrice),
            quantity: directQuantity,
          },
        ]
      }
    }

    if (cart.length === 0) {
      session.flash('error', 'No items to purchase')
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

    if (!auth.user && !email) {
      session.flash('error', 'Email required for purchase')
      return response.redirect().back()
    }

    const now = new Date()
    const orderNumber = `ORD-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`

    let totalGross = 0

    for (const item of cart) {
      const ticketType = await TicketType.find(item.ticketTypeId)
      if (!ticketType) continue
      const lineTotal = item.price * item.quantity
      totalGross += lineTotal
    }

    const order = await Order.create({
      id: crypto.randomUUID(),
      orderNumber,
      buyerId,
      guestEmail: !buyerId ? email : null,
      guestPhone: !buyerId ? (request.input('phone') ?? '') : null,
      guestName: !buyerId ? name : null,
      status: 'paid',
      totalGrossAmount: totalGross,
      platformFeeAmount: 0,
      organizerNetAmount: totalGross,
      paymentProcessorFee: 0,
      currency: 'USD',
      paidAt: DateTime.now(),
    } as any)

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
      } as any)

      await TicketType.query()
        .where('id', item.ticketTypeId)
        .increment('quantitySold', item.quantity)
      await TicketType.query()
        .where('id', item.ticketTypeId)
        .decrement('quantityReserved', item.quantity)

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
      response.redirect().toRoute('dashboard.orders.show', { id: order.id })
    } else {
      response.redirect().toRoute('events.index')
    }
  }
}
