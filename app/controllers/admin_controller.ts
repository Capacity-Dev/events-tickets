import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Event from '#models/event'
import User from '#models/user'
import Category from '#models/category'
import FeeRule from '#models/fee_rule'
import Payout from '#models/payout'
import PlatformRevenueLog from '#models/platform_revenue_log'
import Order from '#models/order'
import Currency from '#models/currency'
import Role from '#models/role'
import EventBoost from '#models/event_boost'
import { metaAds } from '#services/meta_ads_service'
import adminConfig from '#config/admin'
import Setting from '#models/setting'
import WhatsAppTemplate from '#models/whatsapp_template'
import { MbiyopayService } from '#services/mbiyopay_service'
import { loadActiveCurrencies } from '../helpers/currency.js'

export default class AdminController {
  async dashboard({ inertia }: HttpContext) {
    const totalUsers = await User.query().count('* as total')
    const totalEvents = await Event.query().count('* as total')
    const totalOrders = await Order.query().count('* as total')
    const totalRevenue = await Order.query()
      .where('status', 'paid')
      .sum('total_gross_amount as total')

    const recentUsers = await User.query().preload('role').orderBy('createdAt', 'desc').limit(10)
    const recentOrders = await Order.query().preload('buyer').orderBy('createdAt', 'desc').limit(10)
    const eventsByStatus = await Event.query().groupBy('status').count('* as c').select('status')

    return (inertia.render as any)('admin/dashboard', {
      stats: {
        totalUsers: Number(totalUsers[0].$extras.total),
        totalEvents: Number(totalEvents[0].$extras.total),
        totalOrders: Number(totalOrders[0].$extras.total),
        totalRevenue: Number(totalRevenue[0].$extras.total ?? 0),
      },
      recentUsers: recentUsers.map((u) => ({ ...u.toJSON(), role: u.role?.name })),
      recentOrders: recentOrders.map((o) => ({ ...o.toJSON(), buyer: o.buyer?.toJSON() })),
      eventsByStatus: eventsByStatus.map((e) => ({
        status: e.status,
        count: Number(e.$extras.c),
      })),
    })
  }

  async pendingEvents({ inertia }: HttpContext) {
    const events = await Event.query()
      .preload('organizer')
      .preload('category')
      .orderBy('createdAt', 'asc')

    return (inertia.render as any)('admin/events_pending', { events })
  }

  async approveEvent({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.status = 'published'
    event.publishedAt = DateTime.now()
    await event.save()
    response.redirect().toRoute('admin.events.pending')
  }

  async rejectEvent({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.status = 'rejected'
    await event.save()
    response.redirect().toRoute('admin.events.pending')
  }

  async freezeEvent({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.isFrozen = true
    event.frozenAt = DateTime.now()
    await event.save()
    response.redirect().toRoute('admin.events.pending')
  }

  async unfreezeEvent({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.isFrozen = false
    event.frozenAt = null
    await event.save()
    response.redirect().toRoute('admin.events.pending')
  }

  async users({ inertia }: HttpContext) {
    const users = await User.query().preload('role').orderBy('createdAt', 'desc')
    return (inertia.render as any)('admin/users', { users })
  }

  async userShow({ params, inertia, response }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('role').preload('events').first()

    if (!user) return response.status(404).send('Not found')

    const orders = await Order.query()
      .where('buyerId', user.id)
      .orderBy('createdAt', 'desc')
      .limit(20)
    const payouts = await Payout.query()
      .where('organizerId', user.id)
      .orderBy('createdAt', 'desc')
      .limit(10)

    return (inertia.render as any)('admin/user_show', {
      user: { ...user.toJSON(), role: user.role?.toJSON() },
      events: user.events.map((e) => e.toJSON()),
      orders,
      payouts,
    })
  }

  async userEdit({ params, inertia, response }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('role').first()
    if (!user) return response.status(404).send('Not found')

    const roles = await Role.all()

    return (inertia.render as any)('admin/user_edit', {
      user: { ...user.toJSON(), role: user.role?.toJSON() },
      roles: roles.map((r) => r.toJSON()),
    })
  }

  async userUpdate({ params, request, response, session }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.status(404).send('Not found')

    const { fullName, email, roleId, password, passwordConfirmation } = request.all()

    if (fullName !== undefined) user.fullName = fullName
    if (email !== undefined) user.email = email
    if (roleId !== undefined) user.roleId = roleId

    if (password) {
      if (password !== passwordConfirmation) {
        session.flash('error', 'Passwords do not match')
        return response.redirect().toRoute('admin.users.edit', { id: user.id })
      }
      user.password = password
    }

    await user.save()
    session.flash('success', 'User updated')
    response.redirect().toRoute('admin.users.show', { id: user.id })
  }

  async updateUserRole({ request, params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.status(404).send('Not found')
    const roleId = request.input('roleId')
    if (roleId) user.roleId = roleId
    await user.save()
    response.redirect().toRoute('admin.users')
  }

  async feeRules({ inertia }: HttpContext) {
    const rules = await FeeRule.query().orderBy('priority', 'asc')
    return (inertia.render as any)('admin/fee_rules', { rules })
  }

  async storeFeeRule({ request, response }: HttpContext) {
    const data = request.all()
    await FeeRule.create({
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type,
      value: data.value,
      secondaryValue: data.secondaryValue ?? null,
      appliesTo: data.appliesTo ?? 'buyer',
      isDefault: data.isDefault ?? false,
      status: 'active',
      priority: data.priority ?? 0,
    })
    response.redirect().toRoute('admin.fee.rules')
  }

  async finances({ inertia, request }: HttpContext) {
    const currencies = await loadActiveCurrencies()
    const page = Number(request.input('page', 1))
    const statusFilter = request.input('status', '')
    const search = request.input('q', '').trim()
    const dateFrom = request.input('dateFrom', '')
    const dateTo = request.input('dateTo', '')
    const sortField = request.input('sort', 'created_at')
    const sortDir = request.input('dir', 'desc') === 'asc' ? 'asc' : 'desc'

    const query = Order.query().preload('buyer')
    if (statusFilter) query.where('status', statusFilter)

    if (search) {
      query.where((q) => {
        q.whereILike('orderNumber', `%${search}%`)
          .orWhereILike('guestEmail', `%${search}%`)
          .orWhereILike('guestPhone', `%${search}%`)
      })
    }

    if (dateFrom) query.where('createdAt', '>=', new Date(dateFrom))
    if (dateTo) query.where('createdAt', '<=', new Date(dateTo))

    if (sortField === 'totalGrossAmount') {
      query.orderByRaw(`CAST(total_gross_amount AS NUMERIC) ${sortDir}`)
    } else if (sortField === 'createdAt') {
      query.orderBy('createdAt', sortDir as any)
    } else {
      query.orderBy(sortField, sortDir as any)
    }

    const orders = await query.paginate(page, 50)

    const revenueRows = await Order.query()
      .select('currency')
      .select(db.raw(`SUM(CAST(total_gross_amount AS NUMERIC)) as total`))
      .where('status', 'paid')
      .groupBy('currency')
      .exec()

    const revenueByCurrency = (revenueRows as any[]).map((r) => ({
      currency: r.currency || 'USD',
      total: parseFloat(r.$extras?.total ?? r.total ?? '0'),
    }))

    const totalRevenueUSD = revenueByCurrency.reduce((sum, entry) => {
      const currency = currencies.find((c) => c.code === entry.currency)
      const rate = currency ? parseFloat(currency.exchangeRate) || 1 : 1
      return sum + entry.total / rate
    }, 0)

    const platformRow = await PlatformRevenueLog.query()
      .select(db.raw(`SUM(CAST(calculated_fee_amount AS NUMERIC)) as total`))
      .first()

    const platformFees = platformRow
      ? parseFloat((platformRow as any).$extras?.total ?? (platformRow as any).total ?? '0')
      : 0

    const payoutsTotal = await Payout.query()
      .where('status', 'completed')
      .select(db.raw(`SUM(CAST(amount AS NUMERIC)) as total`))
      .first()

    const payoutsProcessed = payoutsTotal
      ? parseFloat((payoutsTotal as any).$extras?.total ?? (payoutsTotal as any).total ?? '0')
      : 0

    return (inertia.render as any)('admin/finances', {
      orders: orders.all(),
      currencies,
      revenueByCurrency,
      totalRevenueUSD,
      platformFees,
      payoutsProcessed,
      pagination: orders.getMeta(),
      currentStatus: statusFilter,
      search,
      dateFrom,
      dateTo,
      sortField,
      sortDir,
    })
  }

  async processPayout({ params, response, session }: HttpContext) {
    const payout = await Payout.query().where('id', params.id).preload('organizer').first()
    if (!payout) return response.status(404).send('Not found')

    const totalAvailableRow = await Order.query()
      .where('buyerId', payout.organizerId)
      .where('status', 'paid')
      .select(db.raw(`COALESCE(SUM(CAST(organizer_net_amount AS NUMERIC)), 0) as total`))
      .first()
    const totalAvailable = parseFloat((totalAvailableRow?.$extras as any)?.total ?? '0')

    const totalPayoutRow = await Payout.query()
      .where('organizerId', payout.organizerId)
      .whereIn('status', ['completed', 'pending'])
      .whereNot('id', payout.id)
      .select(db.raw(`COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as total`))
      .first()
    const totalAlreadyPayout = parseFloat((totalPayoutRow?.$extras as any)?.total ?? '0')

    const availableBalance = totalAvailable - totalAlreadyPayout

    if (Number(payout.amount) > availableBalance) {
      session.flash(
        'error',
        `Payout amount exceeds available balance. Available: ${availableBalance.toFixed(2)} ${payout.currency ?? 'USD'}`
      )
      return response.redirect().back()
    }

    if (payout.phoneNumber && payout.network && payout.currency && payout.beneficiary) {
      try {
        const currency = await Currency.query().where('code', payout.currency).first()
        const countryCode = currency?.countryCode ?? 'CD'

        const mbiyopay = new MbiyopayService()
        const ref = `PAYOUT-${payout.id.slice(0, 8)}`
        const result = await mbiyopay.sendPayout({
          amount: Number(payout.amount),
          currency: payout.currency,
          phoneNumber: payout.phoneNumber,
          network: payout.network,
          countryCode,
          beneficiary: payout.beneficiary,
          orderId: ref,
        })

        payout.status = 'processing'
        payout.mbiyopayStatus = 'pending'
        payout.transactionId = result.transaction_id
        payout.payoutReference = ref
        payout.processedAt = DateTime.now()
        await payout.save()

        session.flash('success', `Payout sent via Mbiyopay. Transaction: ${result.transaction_id}`)
      } catch (err: any) {
        session.flash('error', `Mbiyopay payout failed: ${err.message}`)
      }
    } else {
      payout.status = 'completed'
      payout.processedAt = DateTime.now()
      payout.completedAt = DateTime.now()
      await payout.save()
      session.flash('success', 'Payout marked as completed.')
    }

    response.redirect().toRoute('admin.finances')
  }

  async transactions({ inertia, request }: HttpContext) {
    const page = Number(request.input('page', 1))
    const statusFilter = request.input('status', '')
    const search = request.input('q', '').trim()
    const dateFrom = request.input('dateFrom', '')
    const dateTo = request.input('dateTo', '')

    const query = Order.query().preload('buyer').orderBy('createdAt', 'desc')
    if (statusFilter) query.where('status', statusFilter)

    if (search) {
      query.where((q) => {
        q.whereILike('orderNumber', `%${search}%`)
          .orWhereILike('guestEmail', `%${search}%`)
          .orWhereILike('guestPhone', `%${search}%`)
      })
    }

    if (dateFrom) query.where('createdAt', '>=', new Date(dateFrom))
    if (dateTo) query.where('createdAt', '<=', new Date(dateTo))

    const orders = await query.paginate(page, 50)

    return (inertia.render as any)('admin/transactions', {
      orders: orders.all(),
      pagination: orders.getMeta(),
      currentStatus: statusFilter,
      search,
      dateFrom,
      dateTo,
    })
  }

  async transactionShow({ params, inertia, response }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .preload('buyer')
      .preload('items', (q) => q.preload('ticketType').preload('tickets'))
      .first()

    if (!order) return response.status(404).send('Not found')

    return (inertia.render as any)('admin/transaction_show', { order: order.toJSON() })
  }

  async recheckTransaction({ params, response, session }: HttpContext) {
    const order = await Order.query()
      .where('id', params.id)
      .select('id', 'status', 'paymentIntentId', 'orderNumber')
      .first()

    if (!order) return response.status(404).send('Not found')

    if (!order.paymentIntentId) {
      session.flash('error', 'No payment transaction ID to check')
      return response.redirect().toRoute('admin.transactions.show', { id: order.id })
    }

    try {
      const mbiyopay = new MbiyopayService()
      const mbiyopayStatus = await mbiyopay.checkStatus(order.paymentIntentId)

      if (mbiyopayStatus.status === 'successful') {
        await MbiyopayService.processSuccessfulPayment(order.orderNumber)
        session.flash('success', 'Payment confirmed as successful. Order marked as paid.')
      } else if (mbiyopayStatus.status === 'failed') {
        await MbiyopayService.processFailedPayment(order.orderNumber)
        session.flash('success', 'Payment confirmed as failed.')
      } else {
        const o = await Order.find(order.id)
        if (o) {
          o.status = 'reserved'
          await o.save()
        }
        session.flash('success', `Payment status: ${mbiyopayStatus.status}. Order updated.`)
      }
    } catch (err: any) {
      session.flash('error', `Failed to check status: ${err.message}`)
    }

    response.redirect().toRoute('admin.transactions.show', { id: order.id })
  }

  async categories({ inertia }: HttpContext) {
    const categories = await Category.query().orderBy('displayOrder', 'asc')
    return (inertia.render as any)('admin/categories', { categories })
  }

  async storeCategory({ request, response }: HttpContext) {
    const data = request.all()
    await Category.create({
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug ?? data.name.toLowerCase().replace(/\s+/g, '-'),
      displayOrder: data.displayOrder ?? 0,
    })
    response.redirect().toRoute('admin.categories')
  }

  async deleteCategory({ params, response }: HttpContext) {
    const cat = await Category.find(params.id)
    if (cat) await cat.delete()
    response.redirect().toRoute('admin.categories')
  }

  async homepage({ inertia }: HttpContext) {
    const events = await Event.query()
      .where('status', 'published')
      .orderBy('isFeatured', 'desc')
      .orderBy('startDate', 'asc')

    return (inertia.render as any)('admin/homepage', { events })
  }

  async toggleFeatured({ params, response }: HttpContext) {
    const event = await Event.find(params.id)
    if (!event) return response.status(404).send('Not found')
    event.isFeatured = !event.isFeatured
    await event.save()
    response.redirect().toRoute('admin.homepage')
  }

  async whatsappTemplates({ inertia }: HttpContext) {
    const templates = await WhatsAppTemplate.query().orderBy('createdAt', 'desc')
    return (inertia.render as any)('admin/whatsapp', { templates })
  }

  async storeWhatsappTemplate({ request, response }: HttpContext) {
    const data = request.all()
    await WhatsAppTemplate.create({
      id: crypto.randomUUID(),
      name: data.name,
      category: data.category,
      languageCode: data.languageCode ?? 'en_US',
      status: 'pending_approval',
      variables: data.variables ? JSON.parse(data.variables) : null,
    })
    response.redirect().toRoute('admin.whatsapp')
  }

  async whatsappSettings({ inertia }: HttpContext) {
    const { WhatsAppService } = await import('#services/whatsapp_service')
    const status = WhatsAppService.getStatus()
    return (inertia.render as any)('admin/whatsapp_settings', { status })
  }

  async whatsappStatus({ response }: HttpContext) {
    const { WhatsAppService } = await import('#services/whatsapp_service')
    return response.json(WhatsAppService.getStatus())
  }

  async connectWhatsapp({ response, session }: HttpContext) {
    try {
      const { WhatsAppService } = await import('#services/whatsapp_service')
      await WhatsAppService.initialize()
      session.flash('success', 'WhatsApp connection initiated. Scan the QR code.')
      return (response.redirect() as any).toRoute('admin.whatsapp.settings')
    } catch (error) {
      session.flash('error', 'Failed to initialize WhatsApp connection')
      return (response.redirect() as any).toRoute('admin.whatsapp.settings')
    }
  }

  async disconnectWhatsapp({ response, session }: HttpContext) {
    try {
      const { WhatsAppService } = await import('#services/whatsapp_service')
      await WhatsAppService.disconnect()
      session.flash('success', 'WhatsApp disconnected')
      return (response.redirect() as any).toRoute('admin.whatsapp.settings')
    } catch (error) {
      session.flash('error', 'Failed to disconnect WhatsApp')
      return (response.redirect() as any).toRoute('admin.whatsapp.settings')
    }
  }

  async resetWhatsapp({ response, session }: HttpContext) {
    try {
      const { WhatsAppService } = await import('#services/whatsapp_service')
      await WhatsAppService.reset()
      session.flash('success', 'WhatsApp session reset')
      return (response.redirect() as any).toRoute('admin.whatsapp.settings')
    } catch (error) {
      session.flash('error', 'Failed to reset WhatsApp session')
      return (response.redirect() as any).toRoute('admin.whatsapp.settings')
    }
  }

  async currencies({ inertia }: HttpContext) {
    const currencies = await Currency.query().orderBy('sortOrder', 'asc')
    return (inertia.render as any)('admin/currencies', { currencies })
  }

  async storeCurrency({ request, response }: HttpContext) {
    const data = request.all()
    await Currency.create({
      id: crypto.randomUUID(),
      code: data.code,
      name: data.name,
      symbol: data.symbol,
      countryCode: data.countryCode,
      networks: (() => {
        const raw = data['networks[]'] ?? data.networks ?? []
        return JSON.stringify((Array.isArray(raw) ? raw : [raw]).filter(Boolean))
      })(),
      exchangeRate: String(data.exchangeRate ?? 1),
      isActive: data.isActive === '1' || data.isActive === true,
      sortOrder: Number(data.sortOrder ?? 0),
    })
    response.redirect().toRoute('admin.currencies')
  }

  async updateCurrency({ params, request, response }: HttpContext) {
    const currency = await Currency.find(params.id)
    if (!currency) return response.status(404).send('Not found')

    const data = request.all()
    currency.code = data.code ?? currency.code
    currency.name = data.name ?? currency.name
    currency.symbol = data.symbol ?? currency.symbol
    currency.countryCode = data.countryCode ?? currency.countryCode
    if (data.networks !== undefined || data['networks[]'] !== undefined) {
      const raw = data['networks[]'] ?? data.networks ?? []
      const networks = Array.isArray(raw) ? raw : [raw]
      currency.networks = JSON.stringify(networks.filter(Boolean))
    }
    if (data.exchangeRate !== undefined) currency.exchangeRate = String(data.exchangeRate)
    if (data.isActive !== undefined)
      currency.isActive = data.isActive === '1' || data.isActive === true
    if (data.sortOrder !== undefined) currency.sortOrder = Number(data.sortOrder)
    await currency.save()

    response.redirect().toRoute('admin.currencies')
  }

  async boosts({ inertia }: HttpContext) {
    const boosts = await EventBoost.query()
      .preload('event')
      .preload('organizer')
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('admin/boosts', {
      boosts: boosts.map((b) => ({
        ...b.toJSON(),
        event: b.event ? { ...b.event.toJSON(), slug: (b.event as any).slug } : null,
        organizer: b.organizer ? b.organizer.toJSON() : null,
      })),
    })
  }

  async updateTemplate({ params, request, response }: HttpContext) {
    const template = await WhatsAppTemplate.findOrFail(params.id)
    const data = request.all()
    if (data.body !== undefined) (template as any).body = data.body
    if (data.subject !== undefined) (template as any).subject = data.subject
    if (data.channel !== undefined) (template as any).channel = data.channel
    if (data.type !== undefined) (template as any).type = data.type
    if (data.name !== undefined) template.name = data.name
    await template.save()
    return response.json({ success: true })
  }

  async cancelBoost({ params, response }: HttpContext) {
    const boost = await EventBoost.findByOrFail('id', params.id)
    if (boost.metaCampaignId) {
      try {
        await metaAds.pauseCampaign(boost.metaCampaignId)
      } catch (_err) {}
    }
    boost.status = 'cancelled'
    await boost.save()
    return response.redirect().toPath(`/${adminConfig.prefix}/boosts`)
  }

  async notifications({ inertia }: HttpContext) {
    const templates = await WhatsAppTemplate.query().orderBy('createdAt', 'desc')
    const { WhatsAppService } = await import('#services/whatsapp_service')
    const connectionStatus = WhatsAppService.getStatus()

    const allSettings = await Setting.query()
    const settingsMap: Record<string, string> = {}
    for (const s of allSettings) {
      settingsMap[s.key] = (s as any).value ?? ''
    }

    return (inertia.render as any)('admin/notifications', {
      templates,
      connectionStatus,
      settings: settingsMap,
      adminPrefix: adminConfig.prefix,
    })
  }

  async updateNotificationSettings({ request, response }: HttpContext) {
    const data = request.all()
    for (const [key, value] of Object.entries(data)) {
      const existing = await Setting.findBy('key', key)
      if (existing) {
        ;(existing as any).value = String(value)
        await existing.save()
      } else {
        await Setting.create({
          id: crypto.randomUUID(),
          key,
          value: String(value),
        })
      }
    }
    return response.json({ success: true })
  }
}
