import FeeRule from '#models/fee_rule'

interface BoostPricing {
  totalBudget: number
  currency: string
  markupPercentage: number
  markupAmount: number
  metaBudget: number
  feeRuleId: string | null
}

export class BoostPricingService {
  async calculate(
    budget: number,
    currency: string,
    organizerId: number
  ): Promise<BoostPricing> {
    const rule = await this.#resolveFeeRule(organizerId)

    if (!rule) {
      return {
        totalBudget: budget,
        currency,
        markupPercentage: 0,
        markupAmount: 0,
        metaBudget: budget,
        feeRuleId: null,
      }
    }

    const value = parseFloat(rule.value as any)
    const minFee = rule.minFee ? parseFloat(rule.minFee as any) : 0
    const maxFee = rule.maxFee ? parseFloat(rule.maxFee as any) : Infinity

    let markupAmount: number

    if (rule.type === 'percentage') {
      markupAmount = budget * (value / 100)
      if (minFee > 0) markupAmount = Math.max(markupAmount, minFee)
      if (maxFee < Infinity) markupAmount = Math.min(markupAmount, maxFee)
    } else {
      markupAmount = value
    }

    markupAmount = Math.round(markupAmount * 100) / 100
    const metaBudget = Math.round((budget - markupAmount) * 100) / 100

    if (metaBudget <= 0) {
      throw new Error(
        `La marge (${markupAmount} ${currency}) dépasse le budget. Augmentez votre budget ou contactez le support.`
      )
    }

    return {
      totalBudget: budget,
      currency,
      markupPercentage: rule.type === 'percentage' ? value : 0,
      markupAmount,
      metaBudget,
      feeRuleId: rule.id as any,
    }
  }

  async #resolveFeeRule(organizerId: number): Promise<FeeRule | null> {
    const profile = await import('#models/organizer_fee_profile')
      .then((m) => m.default)
      .then((OrganizerFeeProfile) =>
        OrganizerFeeProfile.query()
          .where('organizerId', organizerId)
          .orderBy('createdAt', 'desc')
          .first()
      )

    if (profile) {
      const rule = await import('#models/fee_rule')
        .then((m) => m.default)
        .then((FeeRule) =>
          FeeRule.query()
            .where('id', profile.feeRuleId as any)
            .where('appliesTo', 'boost')
            .where('status', 'active')
            .first()
        )
      if (rule) return rule
    }

    const defaultRule = await import('#models/fee_rule')
      .then((m) => m.default)
      .then((FeeRule) =>
        FeeRule.query()
          .where('appliesTo', 'boost')
          .where('isDefault', true)
          .where('status', 'active')
          .orderBy('priority', 'asc')
          .first()
      )

    return defaultRule
  }
}

export const boostPricing = new BoostPricingService()
