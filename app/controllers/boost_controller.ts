import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import EventBoost from '#models/event_boost'
import { metaAds } from '#services/meta_ads_service'
import { boostPricing } from '#services/boost_pricing_service'
import { boostLaunch } from '#services/boost_launch_service'
import { storeBoostValidator, payBoostValidator } from '#validators/boost'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'

export default class BoostController {
  async create({ inertia, params, auth, response }: HttpContext) {
    const event = await Event.findByOrFail('id', params.id)
    if ((event as any).organizerId !== auth.user!.id) {
      return response.redirect().toRoute('dashboard.events')
    }
    const appUrl = env.get('APP_URL')
    return (inertia.render as any)('dashboard/organizer/boost_create', {
      event: { ...event.toJSON(), slug: event.slug },
      appUrl,
    })
  }

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(storeBoostValidator)
    const {
      eventId,
      budget,
      currency,
      budgetType,
      startDate,
      endDate,
      channels,
      targeting,
      headline,
      primaryText,
      callToAction,
    } = payload

    const event = await Event.findByOrFail('id', eventId)
    if ((event as any).organizerId !== auth.user!.id) {
      return response.redirect().toRoute('dashboard.events')
    }

    if (!metaAds.isConfigured()) {
      return response.status(500).json({ error: 'Meta Ads is not configured' })
    }

    const pricing = await boostPricing.calculate(
      Number(budget),
      currency || (event as any).currency || 'USD',
      auth.user!.id
    )

    const boost = await EventBoost.create({
      id: crypto.randomUUID(),
      eventId: event.id,
      organizerId: auth.user!.id,
      budget: pricing.totalBudget,
      budgetType: budgetType || 'daily',
      currency: pricing.currency,
      startDate: startDate
        ? (startDate as any).toJSDate
          ? (startDate as any).toJSDate()
          : new Date(startDate as any)
        : new Date(),
      endDate: endDate
        ? (endDate as any).toJSDate
          ? (endDate as any).toJSDate()
          : new Date(endDate as any)
        : null,
      targetAudience: targeting
        ? typeof targeting === 'string'
          ? JSON.parse(targeting)
          : targeting
        : null,
      channels: typeof channels === 'string' ? JSON.parse(channels) : channels,
      headline: headline?.slice(0, 40) || event.title.slice(0, 40),
      primaryText: primaryText || (event.description ?? '').slice(0, 125),
      callToAction: callToAction || 'LEARN_MORE',
      status: 'pending_payment',
      metaBudget: String(pricing.metaBudget),
      markupAmount: String(pricing.markupAmount),
      feeRuleId: pricing.feeRuleId,
    } as any)

    return response.json({ boostId: boost.id, ...pricing })
  }

  async pay({ request, response }: HttpContext) {
    const { boostId } = await request.validateUsing(payBoostValidator)
    const boost = await EventBoost.findByOrFail('id', boostId)

    if (boost.status !== 'pending_payment') {
      return response.status(409).json({ error: `Boost is already ${boost.status}` })
    }

    boost.paymentStatus = 'paid'
    await boost.save()

    setImmediate(() => {
      boostLaunch.launchBoost(boostId).catch((err) => {
        logger.error({ err, boostId }, '[Boost] Background launch failed')
      })
    })

    return response.json({ success: true, boostId, status: boost.status })
  }

  async status({ params, response }: HttpContext) {
    const boost = await EventBoost.findByOrFail('id', params.id)
    return response.json({
      id: boost.id,
      status: boost.status,
      failureReason: boost.failureReason,
      metaCampaignId: boost.metaCampaignId,
      metaAdsetId: boost.metaAdsetId,
      metaAdId: boost.metaAdId,
    })
  }

  async index({ inertia, auth }: HttpContext) {
    const boosts = await EventBoost.query()
      .where('organizerId', auth.user!.id)
      .preload('event')
      .orderBy('createdAt', 'desc')

    return (inertia.render as any)('dashboard/organizer/boosts', {
      boosts: boosts.map((b) => ({
        ...b.toJSON(),
        event: b.event ? { ...b.event.toJSON(), slug: (b.event as any).slug } : null,
      })),
    })
  }

  async show({ inertia, params, auth, response }: HttpContext) {
    const boost = await EventBoost.findByOrFail('id', params.id)
    if ((boost as any).organizerId !== auth.user!.id) {
      return response.redirect().toRoute('dashboard')
    }

    const event = await Event.find(boost.eventId)
    let insights = null

    if (boost.metaCampaignId && boost.status === 'active') {
      try {
        insights = await metaAds.getInsights(boost.metaCampaignId)
        boost.metaImpressions = insights.impressions
        boost.metaClicks = insights.clicks
        boost.metaSpent = String(insights.spend)
        boost.metaCtr = String(insights.ctr)
        boost.metaCpc = String(insights.cpc)
        ;(boost as any).lastSyncedAt = new Date()
        await boost.save()
      } catch (err: any) {
        logger.warn({ err, boostId: boost.id }, '[Boost] Failed to fetch insights')
      }
    }

    return (inertia.render as any)('dashboard/organizer/boost_show', {
      boost: {
        ...boost.toJSON(),
        event: event ? { ...event.toJSON(), slug: (event as any).slug } : null,
      },
      insights,
    })
  }

  async pause({ params, auth, response }: HttpContext) {
    const boost = await EventBoost.findByOrFail('id', params.id)
    if ((boost as any).organizerId !== auth.user!.id) {
      return response.redirect().toRoute('dashboard')
    }
    if (boost.metaCampaignId) {
      await metaAds.pauseCampaign(boost.metaCampaignId)
    }
    boost.status = 'paused'
    await boost.save()
    return response.redirect().back()
  }

  async resume({ params, auth, response }: HttpContext) {
    const boost = await EventBoost.findByOrFail('id', params.id)
    if ((boost as any).organizerId !== auth.user!.id) {
      return response.redirect().toRoute('dashboard')
    }
    if (boost.metaCampaignId) {
      await metaAds.resumeCampaign(boost.metaCampaignId)
    }
    boost.status = 'active'
    await boost.save()
    return response.redirect().back()
  }
}
