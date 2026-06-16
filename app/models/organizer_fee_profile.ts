import { OrganizerFeeProfileSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import FeeRule from './fee_rule.js'

export default class OrganizerFeeProfile extends OrganizerFeeProfileSchema {
  static $selfAssignPrimaryKey = true

  @belongsTo(() => User)
  declare organizer: BelongsTo<typeof User>

  @belongsTo(() => FeeRule)
  declare feeRule: BelongsTo<typeof FeeRule>
}
