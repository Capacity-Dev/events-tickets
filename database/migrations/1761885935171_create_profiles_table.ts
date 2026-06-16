import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()
        .notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('phone_number').nullable()
      table.string('avatar_url').nullable()
      table.string('locale').defaultTo('fr_FR')
      table.string('timezone').nullable()
      table.boolean('whatsapp_opt_in').defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
