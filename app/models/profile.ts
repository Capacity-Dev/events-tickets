import { ProfileSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Profile extends ProfileSchema {
  static $selfAssignPrimaryKey = true

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
