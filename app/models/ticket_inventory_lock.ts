import { TicketInventoryLockSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import TicketType from './ticket_type.js'

export default class TicketInventoryLock extends TicketInventoryLockSchema {
  @belongsTo(() => TicketType)
  declare ticketType: BelongsTo<typeof TicketType>
}
