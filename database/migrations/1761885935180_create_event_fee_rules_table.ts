import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_fee_rules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE').notNullable()
      table
        .uuid('fee_rule_id')
        .references('id')
        .inTable('fee_rules')
        .onDelete('CASCADE')
        .notNullable()
      table.decimal('override_value', 10, 2).nullable()
      table.timestamp('effective_from').nullable()
      table.timestamp('effective_until').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['event_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
