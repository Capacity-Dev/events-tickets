import { TicketSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import OrderItem from './order_item.js'
import Event from './event.js'
import TicketType from './ticket_type.js'

export default class Ticket extends TicketSchema {
  @belongsTo(() => OrderItem)
  declare orderItem: BelongsTo<typeof OrderItem>

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @belongsTo(() => TicketType)
  declare ticketType: BelongsTo<typeof TicketType>
}
