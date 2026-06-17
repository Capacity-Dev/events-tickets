import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payouts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .integer('organizer_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('event_id').references('id').inTable('events').onDelete('SET NULL').nullable()
      table.string('status').notNullable().defaultTo('pending')
      table.decimal('amount', 10, 2).notNullable()
      table.string('currency').defaultTo('USD')
      table.string('payout_method').nullable()
      table.string('payout_reference').nullable()
      table.timestamp('requested_at').nullable()
      table.timestamp('processed_at').nullable()
      table.timestamp('completed_at').nullable()
      table.text('admin_notes').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['organizer_id', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
