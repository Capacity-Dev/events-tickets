import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'whatsapp_templates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('body').nullable()
      table.string('subject', 255).nullable()
      table.string('channel', 20).notNullable().defaultTo('whatsapp')
      table.string('type', 50).notNullable().defaultTo('purchase_confirmation')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('body')
      table.dropColumn('subject')
      table.dropColumn('channel')
      table.dropColumn('type')
    })
  }
}
