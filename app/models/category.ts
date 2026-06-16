import { CategorySchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Event from './event.js'

export default class Category extends CategorySchema {
  @hasMany(() => Event)
  declare events: HasMany<typeof Event>
}
