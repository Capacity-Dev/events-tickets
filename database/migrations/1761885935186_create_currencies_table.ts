import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'currencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('code', 3).notNullable().unique()
      table.string('name').notNullable()
      table.string('symbol', 10).notNullable()
      table.string('country_code', 2).notNullable()
      table.jsonb('networks').notNullable().defaultTo('[]')
      table.decimal('exchange_rate', 15, 6).notNullable().defaultTo(1)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
