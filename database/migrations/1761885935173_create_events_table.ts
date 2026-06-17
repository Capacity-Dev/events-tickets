import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .integer('organizer_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table
        .uuid('category_id')
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
      table.string('venue_name').nullable()
      table.string('venue_address').nullable()
      table.json('venue_coordinates').nullable()
      table.timestamp('start_date').notNullable()
      table.timestamp('end_date').nullable()
      table.string('cover_image_url').nullable()
      table.json('gallery_images').nullable()
      table.string('status').notNullable().defaultTo('draft')
      table.boolean('is_featured').defaultTo(false)
      table.json('seo_meta').nullable()
      table.timestamp('published_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['status', 'start_date'])
      table.index(['organizer_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
