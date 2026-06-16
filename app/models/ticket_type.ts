import { TicketTypeSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Event from './event.js'

export default class TicketType extends TicketTypeSchema {
  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>
}
