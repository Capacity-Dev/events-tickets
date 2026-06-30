import Event from '#models/event'
import EventBoost from '#models/event_boost'
import { metaAds } from '#services/meta_ads_service'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'

export class BoostLaunchService {
  async launchBoost(boostId: string): Promise<void> {
    const boost = await EventBoost.findByOrFail('id', boostId)

    if (boost.status !== 'pending_payment') {
      logger.warn(`[BoostLaunch] Boost ${boostId} has status ${boost.status}, skipping`)
      return
    }

    boost.status = 'launching'
    await boost.save()

    const event = await Event.findByOrFail('id', boost.eventId)

    let coverImageUrl = event.coverImageUrl
    if (coverImageUrl && !coverImageUrl?.startsWith('http')) {
      const appUrl = env.get('APP_URL')
      coverImageUrl = `${appUrl}${coverImageUrl}`
    }

    let campaignId: string | null = null
    let adSetId: string | null = null
    let adId: string | null = null

    try {
      let imageHash: string | null = null
      if (coverImageUrl) {
        imageHash = await metaAds.uploadImage(coverImageUrl!)
        logger.info(`[BoostLaunch] Image uploaded, hash: ${imageHash}`)
      }

      campaignId = await metaAds.createCampaign({
        adAccountId: metaAds.adAccountId,
        accessToken: metaAds.accessToken,
        campaignName: `${event.title.slice(0, 40)} - Boost`,
        objective: 'OUTCOME_TRAFFIC',
        status: 'PAUSED',
      })

      adSetId = await metaAds.createAdSet({
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

      adId = await metaAds.createAd({
        adAccountId: metaAds.adAccountId,
        accessToken: metaAds.accessToken,
        adSetId,
        creativeId,
        adName: `${event.title.slice(0, 30)} - Ad`,
        status: 'ACTIVE',
      })

      boost.metaCampaignId = campaignId
      boost.metaAdsetId = adSetId
      boost.metaAdId = adId
      boost.status = 'active'
      boost.paymentStatus = 'paid'
      await boost.save()

      logger.info(`[BoostLaunch] Campaign ${campaignId} launched for event ${event.title}`)
    } catch (err: any) {
      logger.error({ err }, '[BoostLaunch] Failed to launch Meta campaign')

      await metaAds.cleanupCreatedEntities(campaignId, adSetId, adId).catch((cleanupErr) => {
        logger.error({ err: cleanupErr }, '[BoostLaunch] Cleanup also failed')
      })

      boost.status = 'failed'
      boost.failureReason = err.message
      await boost.save()
    }
  }

  async syncInsights(boostId: string): Promise<void> {
    const boost = await EventBoost.findByOrFail('id', boostId)

    if (!boost.metaCampaignId || boost.status !== 'active') {
      return
    }

    try {
      const insights = await metaAds.getInsights(boost.metaCampaignId)
      boost.metaImpressions = insights.impressions
      boost.metaClicks = insights.clicks
      boost.metaSpent = String(insights.spend)
      boost.metaCtr = String(insights.ctr)
      boost.metaCpc = String(insights.cpc)
      ;(boost as any).lastSyncedAt = new Date()
      await boost.save()
      logger.info(`[BoostLaunch] Synced insights for boost ${boostId}`)
    } catch (err: any) {
      logger.warn({ err, boostId }, '[BoostLaunch] Failed to sync insights')
    }
  }

  async syncAllActiveInsights(): Promise<{ synced: number; failed: number }> {
    const boosts = await EventBoost.query().where('status', 'active').whereNotNull('metaCampaignId')

    let synced = 0
    let failed = 0

    for (const boost of boosts) {
      try {
        await this.syncInsights(boost.id)
        synced++
      } catch {
        failed++
      }
    }

    return { synced, failed }
  }

  async processStuckBoosts(): Promise<{ processed: number; failed: number }> {
    const boosts = await EventBoost.query()
      .where('status', 'pending_payment')
      .where('paymentStatus', 'paid')
      .orderBy('createdAt', 'asc')

    let processed = 0
    let failed = 0

    for (const boost of boosts) {
      try {
        await this.launchBoost(boost.id)
        processed++
      } catch {
        failed++
      }
    }

    return { processed, failed }
  }
}

export const boostLaunch = new BoostLaunchService()
