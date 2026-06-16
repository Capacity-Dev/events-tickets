import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('order_id', 36).references('id').inTable('orders').onDelete('CASCADE').notNullable()
      table.string('ticket_type_id', 36).references('id').inTable('ticket_types').onDelete('SET NULL').nullable()
      table.decimal('unit_price', 10, 2).notNullable()
      table.integer('quantity').notNullable()
      table.decimal('line_total', 10, 2).notNullable()
      table.json('attendee_details').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['order_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
