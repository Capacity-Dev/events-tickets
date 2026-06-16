import { EventFeeRuleSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Event from './event.js'
import FeeRule from './fee_rule.js'

export default class EventFeeRule extends EventFeeRuleSchema {
  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @belongsTo(() => FeeRule)
  declare feeRule: BelongsTo<typeof FeeRule>
}
