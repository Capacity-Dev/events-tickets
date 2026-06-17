import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payouts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone_number', 20).nullable()
      table.string('network', 20).nullable()
      table.string('beneficiary').nullable()
      table.string('transaction_id').nullable()
      table.string('mbiyopay_status', 20).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('phone_number')
      table.dropColumn('network')
      table.dropColumn('beneficiary')
      table.dropColumn('transaction_id')
      table.dropColumn('mbiyopay_status')
    })
  }
}
