import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { hasOne, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Profile from './profile.js'
import Role from './role.js'
import Event from './event.js'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => Event, { foreignKey: 'organizerId' })
  declare events: HasMany<typeof Event>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
