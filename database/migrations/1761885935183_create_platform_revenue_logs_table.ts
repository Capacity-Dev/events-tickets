import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'platform_revenue_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE').notNullable()
      table
        .uuid('fee_rule_id')
        .references('id')
        .inTable('fee_rules')
        .onDelete('SET NULL')
        .nullable()
      table.decimal('calculated_fee_amount', 10, 2).notNullable()
      table.json('fee_breakdown').nullable()
      table.timestamp('collected_at').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['order_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
