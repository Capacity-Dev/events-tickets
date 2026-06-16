import { OrderItemSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Order from './order.js'
import TicketType from './ticket_type.js'
import Ticket from './ticket.js'

export default class OrderItem extends OrderItemSchema {
  static $selfAssignPrimaryKey = true
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @belongsTo(() => TicketType)
  declare ticketType: BelongsTo<typeof TicketType>

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>
}
