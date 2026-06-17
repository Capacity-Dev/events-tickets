import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ticket_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE').notNullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.decimal('base_price', 10, 2).notNullable()
      table.string('currency').defaultTo('USD')
      table.integer('quantity_total').notNullable()
      table.integer('quantity_sold').defaultTo(0)
      table.integer('quantity_reserved').defaultTo(0)
      table.integer('max_per_order').nullable()
      table.timestamp('sales_start_at').nullable()
      table.timestamp('sales_end_at').nullable()
      table.string('status').notNullable().defaultTo('active')
      table.integer('sort_order').defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['event_id', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
