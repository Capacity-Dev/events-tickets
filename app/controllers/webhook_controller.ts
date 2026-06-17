import type { HttpContext } from '@adonisjs/core/http'
import { MbiyopayService } from '#services/mbiyopay_service'

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
}
