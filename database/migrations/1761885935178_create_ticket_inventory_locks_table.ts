import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ticket_inventory_locks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('ticket_type_id')
        .references('id')
        .inTable('ticket_types')
        .onDelete('CASCADE')
        .notNullable()
      table.string('session_id').nullable()
      table.integer('user_id').unsigned().nullable()
      table.integer('quantity').notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').notNullable()

      table.index(['ticket_type_id'])
      table.index(['expires_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
