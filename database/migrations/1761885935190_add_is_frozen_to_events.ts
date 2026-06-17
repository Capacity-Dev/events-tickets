import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_frozen').notNullable().defaultTo(false)
      table.timestamp('frozen_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_frozen')
      table.dropColumn('frozen_at')
    })
  }
}
