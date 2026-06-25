import Order from '#models/order'
import FeeRule from '#models/fee_rule'
import OrganizerFeeProfile from '#models/organizer_fee_profile'
import EventFeeRule from '#models/event_fee_rule'
import logger from '@adonisjs/core/services/logger'

interface FeeCalculation {
  platformFee: number
  organizerNet: number
  feeRuleId: string | null
  feeBreakdown: Record<string, any>
}

export class FeeCalculator {
  async calculate(order: Order): Promise<FeeCalculation> {
    const totalGross = Number(order.totalGrossAmount)
    const eventId = await this.#getEventId(order)

    let platformFee = 0
    let feeRuleId: string | null = null
    const breakdown: Record<string, any> = { rules: [] }

    const rules = await this.#resolveFeeRules(eventId, order.buyerId)

    for (const rule of rules) {
      const value = parseFloat(rule.value as any)

      let feeForThisRule = 0
      if (rule.type === 'percentage') {
        feeForThisRule = totalGross * (value / 100)
      } else if (rule.type === 'fixed') {
        feeForThisRule = value
      } else if (rule.type === 'hybrid') {
        const fixedPart = parseFloat((rule.secondaryValue as any) ?? '0')
        feeForThisRule = totalGross * (value / 100) + fixedPart
      }

      const minFee = rule.minFee ? parseFloat(rule.minFee as any) : 0
      const maxFee = rule.maxFee ? parseFloat(rule.maxFee as any) : Infinity

      if (minFee > 0) feeForThisRule = Math.max(feeForThisRule, minFee)
      if (maxFee < Infinity) feeForThisRule = Math.min(feeForThisRule, maxFee)

      feeForThisRule = Math.round(feeForThisRule * 100) / 100

      breakdown.rules.push({
        ruleId: rule.id as any,
        ruleName: (rule as any).name,
        type: rule.type,
        value,
        calculated: feeForThisRule,
      })

      platformFee += feeForThisRule
      feeRuleId = (rule.id as any) as string
    }

    platformFee = Math.round(platformFee * 100) / 100
    const organizerNet = Math.round((totalGross - platformFee) * 100) / 100

    logger.info(
      `[FeeCalculator] Order ${order.orderNumber}: gross=${totalGross}, fee=${platformFee}, net=${organizerNet}`
    )

    return { platformFee, organizerNet, feeRuleId, feeBreakdown: breakdown }
  }

  async #getEventId(order: Order): Promise<string | null> {
    const item = await order.related('items').query().first()
    if (item?.ticketTypeId) {
      const tt = await import('#models/ticket_type').then((m) => m.default)
      const ticketType = await tt.find(item.ticketTypeId)
      return ticketType?.eventId ?? null
    }
    return null
  }

  async #resolveFeeRules(
    eventId: string | null,
    organizerId: number | null
  ): Promise<FeeRule[]> {
    const rules: FeeRule[] = []

    if (eventId) {
      const eventRules = await EventFeeRule.query()
        .where('eventId', eventId)
        .preload('feeRule')
        .exec()

      for (const er of eventRules) {
        const r = er.feeRule as unknown as FeeRule | null
        if (r && r.status === 'active') rules.push(r)
      }
    }

    if (organizerId) {
      const profile = await OrganizerFeeProfile.query()
        .where('organizerId', organizerId)
        .orderBy('createdAt', 'desc')
        .first()

      if (profile) {
        const r = await FeeRule.find(profile.feeRuleId)
        if (r && r.status === 'active' && !rules.some((existing) => existing.id === r.id)) {
          rules.push(r)
        }
      }
    }

    if (rules.length === 0) {
      const defaults = await FeeRule.query()
        .where('isDefault', true)
        .where('status', 'active')
        .whereIn('appliesTo', ['buyer', 'split'])
        .orderBy('priority', 'asc')
        .exec()

      for (const d of defaults) {
        if (!rules.some((existing) => existing.id === d.id)) {
          rules.push(d)
        }
      }
    }

    return rules
  }
}

export const feeCalculator = new FeeCalculator()
