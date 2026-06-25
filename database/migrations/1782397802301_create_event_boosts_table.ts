import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_boosts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE').notNullable()
      table
        .integer('organizer_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.decimal('budget', 12, 2).notNullable()
      table.string('budget_type', 10).notNullable().defaultTo('daily')
      table.string('currency', 3).defaultTo('USD')
      table.timestamp('start_date').notNullable()
      table.timestamp('end_date').nullable()
      table.jsonb('target_audience').nullable()
      table.jsonb('channels').notNullable().defaultTo('["facebook"]')
      table.string('headline').nullable()
      table.text('primary_text').nullable()
      table.string('call_to_action', 30).defaultTo('learn_more')
      table.string('meta_campaign_id').nullable()
      table.string('meta_adset_id').nullable()
      table.string('meta_ad_id').nullable()
      table.string('meta_ad_account_id').nullable()
      table.string('status', 20).notNullable().defaultTo('pending_payment')
      table.text('failure_reason').nullable()
      table.integer('meta_impressions').defaultTo(0)
      table.integer('meta_clicks').defaultTo(0)
      table.decimal('meta_spent', 12, 2).defaultTo(0)
      table.decimal('meta_ctr', 5, 4).defaultTo(0)
      table.decimal('meta_cpc', 10, 4).defaultTo(0)
      table.timestamp('last_synced_at').nullable()
      table.string('payment_status', 20).defaultTo('pending')
      table.string('payment_reference').nullable()
      table
        .uuid('fee_rule_id')
        .references('id')
        .inTable('fee_rules')
        .onDelete('SET NULL')
        .nullable()
      table.decimal('markup_amount', 12, 2).defaultTo(0)
      table.decimal('meta_budget', 12, 2).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
