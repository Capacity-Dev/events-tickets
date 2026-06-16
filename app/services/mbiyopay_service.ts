import env from '#start/env'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Ticket from '#models/ticket'
import TicketType from '#models/ticket_type'

const BASE_URL = 'https://dashboard.mbiyo.africa/api/v1'

interface MbiyopayPayinResponse {
  status: string
  message: string
  data: {
    transaction_id: string
    amount: number
    fee: number
    charged_amount: number
    currency: string
    order_id: string | null
    status: string
    payment_method: string
    redirect_url: string | null
    instructions: string | null
    auth_mode: string | null
    created_at: string
  }
}

interface MbiyopayStatusResponse {
  status: string
  message: string
  data: {
    transaction_id: string
    amount: number
    fee: number
    currency: string
    order_id: string | null
    status: string
    charged_amount: number
    type: string
    created_at: string
    updated_at: string
    metadata: Record<string, unknown> | null
  }
}

export class MbiyopayService {
  private apiKey: string
  private webhookSecret: string
  private callbackUrl: string

  constructor() {
    this.apiKey = env.get('MBIYOPAY_API_KEY', '')
    this.webhookSecret = env.get('MBIYOPAY_WEBHOOK_SECRET', '')
    this.callbackUrl = `${env.get('APP_URL')}/webhooks/mbiyopay`
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  async initiatePayin(params: {
    amount: number
    currency: string
    phoneNumber: string
    network: string
    countryCode: string
    orderId: string
  }): Promise<MbiyopayPayinResponse['data']> {
    const amountInCents = Math.round(params.amount * 100)

    const body = {
      amount: amountInCents,
      currency: params.currency,
      payment_method: 'mobile_money',
      order_id: params.orderId,
      callback_url: this.callbackUrl,
      metadata: {
        network: params.network,
        phone_number: params.phoneNumber,
        country_code: params.countryCode,
      },
    }

    const response = await fetch(`${BASE_URL}/merchant/payin`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    })

    const json: MbiyopayPayinResponse = (await response.json()) as MbiyopayPayinResponse

    if (!response.ok) {
      throw new Error(`Mbiyopay payin failed: ${json.message ?? response.statusText}`)
    }

    return json.data
  }

  async checkStatus(transactionId: string): Promise<MbiyopayStatusResponse['data']> {
    const response = await fetch(`${BASE_URL}/merchant/status/${transactionId}`, {
      headers: this.headers,
    })

    const json: MbiyopayStatusResponse = (await response.json()) as MbiyopayStatusResponse

    if (!response.ok) {
      throw new Error(`Mbiyopay status check failed: ${json.message ?? response.statusText}`)
    }

    return json.data
  }

  verifyWebhookSignature(payload: string, signatureHeader: string): boolean {
    if (!this.webhookSecret) return false

    const expected = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader))
  }

  static async processSuccessfulPayment(orderId: string): Promise<void> {
    const order = await Order.query()
      .where('id', orderId)
      .orWhere('orderNumber', orderId)
      .first()

    if (!order || order.status === 'paid') return

    order.status = 'paid'
    order.paidAt = DateTime.now()
    await order.save()

    const orderItems = await OrderItem.query().where('orderId', order.id).preload('ticketType')

    for (const item of orderItems) {
      if (item.ticketTypeId) {
        await TicketType.query().where('id', item.ticketTypeId).increment('quantitySold', item.quantity)
        await TicketType.query().where('id', item.ticketTypeId).decrement('quantityReserved', item.quantity)
      }

      const tt = item.ticketType
      const eventId = tt?.eventId ?? ''

      for (let i = 0; i < item.quantity; i++) {
        const uuid = crypto.randomUUID()
        const num = `${String(Date.now()).slice(-6)}${String(i).padStart(2, '0')}`
        await Ticket.create({
          id: crypto.randomUUID(),
          orderItemId: item.id,
          eventId,
          ticketTypeId: item.ticketTypeId ?? '',
          ticketNumber: `TKT-${num}`,
          uuid,
          qrToken: uuid,
          status: 'valid',
        })
      }
    }
  }
}
