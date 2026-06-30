import type { HttpContext } from '@adonisjs/core/http'
import { MbiyopayService } from '#services/mbiyopay_service'
import EventBoost from '#models/event_boost'
import { boostLaunch } from '#services/boost_launch_service'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export default class WebhookController {
  async mbiyopay({ request, response }: HttpContext) {
    const rawBody = request.raw() ?? ''
    const signature = request.header('Signature') || ''

    const mbiyopay = new MbiyopayService()

    if (!signature || !mbiyopay.verifyWebhookSignature(rawBody, signature)) {
      return response.status(401).send('Invalid signature')
    }

    const payload = request.all()
    const orderId = payload.order_id as string | undefined

    if (!orderId) {
      return response.status(200).send('OK')
    }

    if (payload.type === 'cashin') {
      if (payload.status === 'successful') {
        await MbiyopayService.processSuccessfulPayment(orderId)
      } else if (payload.status === 'failed' || payload.status === 'cancelled') {
        await MbiyopayService.processFailedPayment(orderId)
      }
    } else if (payload.type === 'cashout') {
      if (payload.status === 'successful') {
        await MbiyopayService.processSuccessfulPayout(orderId)
      } else if (payload.status === 'failed' || payload.status === 'cancelled') {
        await MbiyopayService.processFailedPayout(orderId)
      }
    }

    return response.status(200).send('OK')
  }

  async metaAds({ request, response }: HttpContext) {
    const verifyToken = env.get('META_WEBHOOK_VERIFY_TOKEN', '')

    if (request.method() === 'GET') {
      const mode = request.input('hub.mode')
      const token = request.input('hub.verify_token')
      const challenge = request.input('hub.challenge')

      if (mode === 'subscribe' && token === verifyToken) {
        logger.info('[Meta Webhook] Verification successful')
        return response.status(200).send(challenge)
      }

      logger.warn('[Meta Webhook] Verification failed')
      return response.status(403).send('Forbidden')
    }

    const payload = request.body()
    if (!payload || typeof payload !== 'object') {
      return response.status(200).send('OK')
    }

    try {
      const entries = (payload as any).entry
      if (!Array.isArray(entries)) return response.status(200).send('OK')

      for (const entry of entries) {
        const changes = entry.changes
        if (!Array.isArray(changes)) continue

        for (const change of changes) {
          const field = change.field as string
          if (!field) continue

          const value = change.value as Record<string, any> | undefined
          if (!value) continue

          const adId = value.ad_id as string | undefined
          if (!adId) continue

          const boost = await EventBoost.query()
            .where('metaAdId', adId)
            .orWhere('metaCampaignId', value.campaign_id as string)
            .whereNotNull('metaCampaignId')
            .first()

          if (!boost) continue

          logger.info(`[Meta Webhook] ${field} update for boost ${boost.id}: ad_id=${adId}`)

          if (field === 'in_process_ad_account' || field === 'ads') {
            const effectiveStatus: string | undefined =
              value.effective_status || value.ad_review_feedback?.global_feedback

            if (effectiveStatus === 'DISAPPROVED' || effectiveStatus === 'WITH_ISSUES') {
              boost.status = 'failed'
              boost.failureReason =
                value.ad_review_feedback?.global_feedback ?? 'Ad disapproved by Meta'
              await boost.save()
              logger.warn(`[Meta Webhook] Boost ${boost.id} marked as failed (ad disapproved)`)
            } else if (effectiveStatus === 'ACTIVE') {
              if (boost.status === 'launching') {
                boost.status = 'active'
                await boost.save()
                logger.info(`[Meta Webhook] Boost ${boost.id} confirmed active by Meta`)
              }
            }

            await boostLaunch.syncInsights(boost.id)
          }
        }
      }
    } catch (err: any) {
      logger.error({ err }, '[Meta Webhook] Error processing notification')
    }

    return response.status(200).send('OK')
  }
}
