import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('recipient_type').notNullable()
      table.string('recipient_identifier').nullable()
      table.string('channel').notNullable()
      table
        .uuid('template_id')
        .references('id')
        .inTable('whatsapp_templates')
        .onDelete('SET NULL')
        .nullable()
      table.string('status').notNullable().defaultTo('queued')
      table.json('payload').nullable()
      table.string('external_message_id').nullable()
      table.json('error_details').nullable()
      table.timestamp('sent_at').nullable()
      table.timestamp('delivered_at').nullable()
      table.timestamp('read_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['status'])
      table.index(['recipient_identifier'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
