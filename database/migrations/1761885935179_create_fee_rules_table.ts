import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fee_rules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.decimal('value', 10, 2).notNullable()
      table.decimal('secondary_value', 10, 2).nullable()
      table.string('applies_to').notNullable().defaultTo('buyer')
      table.decimal('buyer_percentage', 5, 2).nullable()
      table.decimal('organizer_percentage', 5, 2).nullable()
      table.decimal('min_fee', 10, 2).nullable()
      table.decimal('max_fee', 10, 2).nullable()
      table.boolean('is_default').defaultTo(false)
      table.string('status').notNullable().defaultTo('active')
      table.integer('priority').defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
