import { PayoutSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Event from './event.js'

export default class Payout extends PayoutSchema {
  static $selfAssignPrimaryKey = true

  @belongsTo(() => User, { foreignKey: 'organizerId' })
  declare organizer: BelongsTo<typeof User>

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>
}
