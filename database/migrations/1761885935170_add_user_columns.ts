import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('role_id', 36).nullable()
      table.string('google_id').nullable()
      table.text('google_refresh_token').nullable()
      table.timestamp('email_verified_at').nullable()
      table.timestamp('deleted_at').nullable()
      table.index(['google_id'], 'users_google_id_index')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['google_id'], 'users_google_id_index')
      table.dropColumn('role_id')
      table.dropColumn('google_id')
      table.dropColumn('google_refresh_token')
      table.dropColumn('email_verified_at')
      table.dropColumn('deleted_at')
    })
  }
}
