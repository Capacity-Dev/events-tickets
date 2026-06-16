import { PlatformRevenueLogSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from './order.js'
import FeeRule from './fee_rule.js'

export default class PlatformRevenueLog extends PlatformRevenueLogSchema {
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => FeeRule)
  declare feeRule: BelongsTo<typeof FeeRule>
}
