import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizer_fee_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('organizer_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.string('fee_rule_id', 36).references('id').inTable('fee_rules').onDelete('CASCADE').notNullable()
      table.timestamp('contract_start_date').nullable()
      table.timestamp('contract_end_date').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['organizer_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
