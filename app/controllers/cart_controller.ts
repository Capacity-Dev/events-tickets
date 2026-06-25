import type { HttpContext } from '@adonisjs/core/http'
import TicketType from '#models/ticket_type'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import User from '#models/user'
import Role from '#models/role'
import Profile from '#models/profile'
import Event from '#models/event'
import { MbiyopayService } from '#services/mbiyopay_service'
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

    let buyerId: number | null = auth.user?.id ?? null

    if (!buyerId && email) {
      let user = await User.findBy('email', email)
      if (!user) {
        const buyerRole = await Role.findBy('name', 'buyer')
        user = await User.create({
          email,
          fullName: name || email.split('@')[0],
          password: crypto.randomUUID(),
          roleId: buyerRole?.id ?? null,
          isShadow: true,
        })
        await Profile.create({
          id: crypto.randomUUID(),
          userId: user.id,
          firstName: name.split(' ')[0] || email.split('@')[0],
          lastName: name.split(' ').slice(1).join(' ') || '',
          phoneNumber: phone || null,
        })
      }
      buyerId = user.id
    }

    if (lineTotal === 0) {
      const freeOrder = await Order.create({
        id: orderId,
        orderNumber,
        buyerId,
        guestEmail: email || null,
        guestPhone: phone || null,
        guestName: name || null,
        status: 'paid',
        totalGrossAmount: 0,
        platformFeeAmount: 0,
        organizerNetAmount: 0,
        paymentProcessorFee: 0,
        currency: ticketType.currency ?? 'USD',
        paidAt: new Date(),
        paymentMethod: 'free',
      } as any)

      await OrderItem.createMany([
        {
          id: crypto.randomUUID(),
          orderId: orderId,
          ticketTypeId: ticketType.id,
          unitPrice: 0,
          quantity,
          lineTotal: 0,
        },
      ] as any)

      await MbiyopayService.processFreeOrder(freeOrder)

      session.flash('success', 'Billets gratuits réservés !')
      response.redirect().toRoute('payment.success', { id: orderId })
      return
    }

    await Order.create({
      id: orderId,
      orderNumber,
      buyerId,
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
          password: crypto.randomUUID(),
          roleId: buyerRole?.id ?? null,
          isShadow: true,
        })
        await Profile.create({
          id: crypto.randomUUID(),
          userId: user.id,
          firstName: name.split(' ')[0] || email.split('@')[0],
          lastName: name.split(' ').slice(1).join(' ') || '',
          phoneNumber: (request.input('phone') as string) || null,
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

    const firstItem = cart[0]
    const firstTicketType = await TicketType.find(firstItem.ticketTypeId)
    const currency = firstTicketType?.currency ?? 'USD'

    let totalGross = 0

    for (const item of cart) {
      const ticketType = await TicketType.find(item.ticketTypeId)
      if (!ticketType || ticketType.status !== 'active') {
        session.flash('error', `Ticket type ${item.name} is no longer available`)
        return response.redirect().back()
      }

      const remaining =
        ticketType.quantityTotal -
        (ticketType.quantitySold ?? 0) -
        (ticketType.quantityReserved ?? 0)
      if (remaining < item.quantity) {
        session.flash('error', `Plus assez de places pour ${ticketType.name}`)
        return response.redirect().back()
      }

      totalGross += item.price * item.quantity
    }

    if (totalGross === 0) {
      const freeOrderId = crypto.randomUUID()
      await Order.create({
        id: freeOrderId,
        orderNumber,
        buyerId,
        guestEmail: !buyerId ? email : null,
        guestPhone: !buyerId ? (request.input('phone') ?? '') : null,
        guestName: !buyerId ? name : null,
        status: 'paid',
        totalGrossAmount: 0,
        platformFeeAmount: 0,
        organizerNetAmount: 0,
        paymentProcessorFee: 0,
        currency,
        paidAt: new Date(),
        paymentMethod: 'free',
      } as any)

      for (const item of cart) {
        await OrderItem.create({
          id: crypto.randomUUID(),
          orderId: freeOrderId,
          ticketTypeId: item.ticketTypeId,
          unitPrice: 0,
          quantity: item.quantity,
          lineTotal: 0,
        } as any)
      }

      const freeOrder = await Order.find(freeOrderId)
      if (freeOrder) await MbiyopayService.processFreeOrder(freeOrder)

      session.forget('cart')
      session.flash('success', 'Billets gratuits réservés !')
      response.redirect().toRoute('payment.success', { id: freeOrderId })
      return
    }

    const orderId = crypto.randomUUID()
    await Order.create({
      id: orderId,
      orderNumber,
      buyerId,
      guestEmail: !buyerId ? email : null,
      guestPhone: !buyerId ? (request.input('phone') ?? '') : null,
      guestName: !buyerId ? name : null,
      status: 'pending',
      totalGrossAmount: totalGross,
      platformFeeAmount: 0,
      organizerNetAmount: totalGross,
      paymentProcessorFee: 0,
      currency,
    } as any)

    for (const item of cart) {
      const ticketType = await TicketType.find(item.ticketTypeId)
      if (!ticketType) continue

      const lineTotal = item.price * item.quantity

      await OrderItem.create({
        id: crypto.randomUUID(),
        orderId,
        ticketTypeId: item.ticketTypeId,
        unitPrice: item.price,
        quantity: item.quantity,
        lineTotal,
      } as any)

      await TicketType.query()
        .where('id', item.ticketTypeId)
        .increment('quantityReserved', item.quantity)
    }

    session.forget('cart')
    session.flash('success', 'Commande créée. Veuillez procéder au paiement.')
    response.redirect().toRoute('payment.pay', { id: orderId })
  }
}
