import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import Currency from '#models/currency'
import { MbiyopayService } from '#services/mbiyopay_service'
import { loadActiveCurrencies, getCurrencySymbol } from '../helpers/currency.js'
import { withTimeout } from '../helpers/promise.js'

const PAYMENT_TIMEOUT_MS = 5000

export default class PaymentController {
  async payForm({ params, view, response, request }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('items', (q) => q.preload('ticketType').preload('tickets'))
      .first()

    if (!order || order.status === 'paid') {
      return response.status(404).send('Commande introuvable')
    }

    const currencies = await loadActiveCurrencies()
    const currencySymbol = getCurrencySymbol(currencies, order.currency)
    const currency = await Currency.query()
      .where('code', order.currency ?? 'USD')
      .first()
    const networks: string[] = currency?.networks ?? []
    const countryCode = currency?.countryCode ?? 'CD'

    const pinRequired = request.qs().pin_required === '1'

    return view.render('payment/pay', {
      order,
      currencySymbol,
      networks,
      countryCode,
      csrfToken: request.csrfToken,
      pinRequired,
      instructions: null,
      transactionId: order.paymentIntentId,
      selectedNetwork: '',
      error: null,
    })
  }

  async initiate({ params, request, view, response, session }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('items', (q) => q.preload('ticketType'))
      .first()

    if (!order) {
      session.flash('error', 'Commande introuvable')
      return response.redirect().back()
    }

    if (order.status === 'paid') {
      return response.redirect().toRoute('payment.success', { id: order.id })
    }

    if (order.status === 'failed') {
      session.flash('error', 'Ce paiement a échoué')
      return response.redirect().back()
    }

    const phone = (request.input('phone') ?? '').trim()
    const network = (request.input('network') ?? '').trim()
    const otp = (request.input('otp') ?? '').trim()

    const currencies = await loadActiveCurrencies()
    const currencySymbol = getCurrencySymbol(currencies, order.currency)
    const currency = await Currency.query()
      .where('code', order.currency ?? 'USD')
      .first()
    const networks: string[] = currency?.networks ?? []
    const countryCode = currency?.countryCode ?? 'CD'

    const makeView = (extra: Record<string, any> = {}) =>
      view.render('payment/pay', {
        order,
        currencySymbol,
        networks,
        countryCode,
        csrfToken: request.csrfToken,
        selectedNetwork: network,
        pinRequired: false,
        instructions: null,
        transactionId: order.paymentIntentId,
        error: null,
        ...extra,
      })

    // Handle PIN/OTP submission
    if (order.paymentIntentId && otp) {
      try {
        const mbiyopay = new MbiyopayService()
        await mbiyopay.finalizePayin(order.paymentIntentId, otp)
        order.status = 'reserved'
        await order.save()
        return response.redirect().toRoute('payment.pending', { id: order.id })
      } catch (err: any) {
        return makeView({ pinRequired: true, error: err.message })
      }
    }

    // Validate form inputs for fresh payment
    if (order.status === 'pending') {
      if (Number(order.totalGrossAmount) === 0) {
        await MbiyopayService.processFreeOrder(order)
        return response.redirect().toRoute('payment.success', { id: order.id })
      }

      if (!phone || !network) {
        session.flash('error', 'Téléphone et réseau requis')
        return response.redirect().back()
      }

      order.guestPhone = phone
      order.status = 'processing'
      await order.save()

      const initiateFn = () =>
        new MbiyopayService().initiatePayin({
          amount: Number(order.totalGrossAmount),
          currency: order.currency ?? 'USD',
          phoneNumber: phone,
          network,
          countryCode,
          orderId: order.orderNumber,
        })

      const result = await withTimeout(initiateFn(), PAYMENT_TIMEOUT_MS)

      if (!result.timedOut) {
        const data = result.value
        order.paymentIntentId = data.transaction_id
        order.status = 'reserved'
        order.mbiyopayAuthMode = data.auth_mode ?? null
        await order.save()

        if (data.auth_mode === 'pin') {
          return makeView({
            pinRequired: true,
            instructions: data.instructions ?? null,
            transactionId: data.transaction_id,
          })
        }

        return response.redirect().toRoute('payment.pending', { id: order.id })
      }

      // Timed out — Mbiyopay continues in background
      order.paymentIntentId = 'pending'
      await order.save()

      initiateFn()
        .then(async (data) => {
          const o = await Order.find(order.id)
          if (!o) return
          o.paymentIntentId = data.transaction_id
          o.status = 'reserved'
          o.mbiyopayAuthMode = data.auth_mode ?? null
          await o.save()
        })
        .catch(async () => {
          const o = await Order.find(order.id)
          if (!o) return
          o.status = 'failed'
          await o.save()
        })

      return response.redirect().toRoute('payment.pending', { id: order.id })
    }

    // Handle retry when processing or reserved (repolling the payment page)
    if (order.status === 'processing' || order.status === 'reserved') {
      return response.redirect().toRoute('payment.pending', { id: order.id })
    }

    return response.redirect().toRoute('payment.pending', { id: order.id })
  }

  async pending({ params, view, response }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .select('id', 'status', 'orderNumber')
      .first()
    if (!order) return response.status(404).send('Commande introuvable')

    return view.render('payment/pending', { order })
  }

  async success({ params, view, response }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('items', (q) => q.preload('ticketType').preload('tickets'))
      .first()

    if (!order) return response.status(404).send('Commande introuvable')

    const currencies = await loadActiveCurrencies()
    const currencySymbol = getCurrencySymbol(currencies, order.currency)

    return view.render('payment/success', { order, currencySymbol })
  }

  async status({ params, response }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .select('id', 'status', 'paymentIntentId', 'orderNumber', 'mbiyopayAuthMode')
      .first()

    if (!order) return response.status(404).json({ error: 'Not found' })

    let actualStatus = order.status
    let requiresPin = order.mbiyopayAuthMode === 'pin'

    if (order.status === 'processing' && order.paymentIntentId) {
      try {
        const mbiyopay = new MbiyopayService()
        const status = await mbiyopay.checkStatus(order.paymentIntentId)

        if (status.status === 'successful') {
          await MbiyopayService.processSuccessfulPayment(order.paymentIntentId)
          actualStatus = 'paid'
        } else if (status.status === 'failed') {
          actualStatus = 'failed'
          const o = await Order.find(order.id)
          if (o) {
            o.status = 'failed'
            await o.save()
          }
        } else {
          actualStatus = 'reserved'
          const o = await Order.find(order.id)
          if (o) {
            o.status = 'reserved'
            await o.save()
          }
        }
      } catch {}
    }

    return response.json({ status: actualStatus, requiresPin })
  }
}
