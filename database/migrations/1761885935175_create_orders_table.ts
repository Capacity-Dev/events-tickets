import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('order_number').notNullable().unique()
      table.integer('buyer_id').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
      table.string('guest_email').nullable()
      table.string('guest_phone').nullable()
      table.string('status').notNullable().defaultTo('pending')
      table.decimal('total_gross_amount', 10, 2).notNullable()
      table.decimal('platform_fee_amount', 10, 2).defaultTo(0)
      table.decimal('organizer_net_amount', 10, 2).defaultTo(0)
      table.decimal('payment_processor_fee', 10, 2).defaultTo(0)
      table.string('currency').defaultTo('USD')
      table.string('payment_intent_id').nullable().unique()
      table.string('payment_method').nullable()
      table.timestamp('paid_at').nullable()
      table.timestamp('refunded_at').nullable()
      table.text('cancellation_reason').nullable()
      table.string('ip_address').nullable()
      table.text('user_agent').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['buyer_id', 'status'])
      table.index(['payment_intent_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
