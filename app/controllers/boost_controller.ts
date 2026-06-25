import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import EventBoost from '#models/event_boost'
import { metaAds } from '#services/meta_ads_service'
import { boostPricing } from '#services/boost_pricing_service'
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
    const { eventId, budget, currency, budgetType, startDate, endDate, channels, targeting, headline, primaryText, callToAction } = request.all()

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
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      targetAudience: targeting ? (typeof targeting === 'string' ? JSON.parse(targeting) : targeting) : null,
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
    const { boostId } = request.all()
    const boost = await EventBoost.findByOrFail('id', boostId)
    const event = await Event.findByOrFail('id', boost.eventId)

    let coverImageUrl = event.coverImageUrl
    if (coverImageUrl && !coverImageUrl?.startsWith('http')) {
      const appUrl = env.get('APP_URL')
      coverImageUrl = `${appUrl}${coverImageUrl}`
    }

    try {
      let imageHash: string | null = null
      if (coverImageUrl) {
        imageHash = await metaAds.uploadImage(coverImageUrl!)
        logger.info(`[Boost] Image uploaded, hash: ${imageHash}`)
      }

      const campaignId = await metaAds.createCampaign({
        adAccountId: metaAds.adAccountId,
        accessToken: metaAds.accessToken,
        campaignName: `${event.title.slice(0, 40)} - Boost`,
        objective: 'OUTCOME_TRAFFIC',
        status: 'PAUSED',
      })

      const adSetId = await metaAds.createAdSet({
        adAccountId: metaAds.adAccountId,
        accessToken: metaAds.accessToken,
        campaignId,
        adSetName: `${event.title.slice(0, 30)} - ${new Date().toISOString().slice(0, 10)}`,
        budget: Number(boost.metaBudget),
        budgetType: boost.budgetType,
        startDate: boost.startDate.toISO()!,
        endDate: boost.endDate?.toISO() ?? undefined,
        targeting: (boost as any).targetAudience || {},
        placementChannels: (boost as any).channels || ['facebook'],
      })

      const creativeId = await metaAds.createCreative({
        adAccountId: metaAds.adAccountId,
        accessToken: metaAds.accessToken,
        pageId: metaAds.pageId || '',
        imageHash: imageHash!,
        headline: boost.headline || event.title.slice(0, 40),
        primaryText: boost.primaryText || (event.description ?? '').slice(0, 125),
        callToAction: boost.callToAction!,
        linkUrl: `${env.get('APP_URL')}/events/${event.slug}`,
      })

      await metaAds.createAd({
        adAccountId: metaAds.adAccountId,
        accessToken: metaAds.accessToken,
        adSetId,
        creativeId,
        adName: `${event.title.slice(0, 30)} - Ad`,
        status: 'ACTIVE',
      })

      boost.metaCampaignId = campaignId
      boost.metaAdsetId = adSetId
      boost.metaAdId = creativeId
      boost.status = 'active'
      boost.paymentStatus = 'paid'
      await boost.save()

      logger.info(`[Boost] Campaign ${campaignId} launched for event ${event.title}`)
      return response.json({ success: true, boost })
    } catch (err: any) {
      logger.error({ err }, '[Boost] Failed to launch Meta campaign')
      boost.status = 'failed'
      boost.failureReason = err.message
      await boost.save()
      return response.status(500).json({ error: err.message })
    }
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
