import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('order_item_id', 36).references('id').inTable('order_items').onDelete('CASCADE').notNullable()
      table.string('event_id', 36).references('id').inTable('events').onDelete('CASCADE').notNullable()
      table.string('ticket_type_id', 36).references('id').inTable('ticket_types').onDelete('CASCADE').notNullable()
      table.string('ticket_number').notNullable().unique()
      table.uuid('uuid').notNullable().unique()
      table.text('qr_token').notNullable()
      table.string('status').notNullable().defaultTo('valid')
      table.timestamp('used_at').nullable()
      table.integer('used_by_scanner_id').unsigned().nullable()
      table.timestamp('checked_in_at').nullable()
      table.string('pdf_url').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['event_id', 'status'])
      table.index(['ticket_number'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
