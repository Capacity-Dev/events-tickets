import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('visibility', 10).notNullable().defaultTo('public')
      table.string('private_slug', 255).nullable().unique()
      table.string('access_password', 255).nullable()
      table.string('private_payment_status', 20).nullable().defaultTo('pending')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('visibility')
      table.dropColumn('private_slug')
      table.dropColumn('access_password')
      table.dropColumn('private_payment_status')
    })
  }
}
