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

    if (payload.status === 'successful' && payload.order_id) {
      await MbiyopayService.processSuccessfulPayment(payload.order_id)
    }

    return response.status(200).send('OK')
  }
}
