import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('qrcode_url').notNullable()

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('status_id').unsigned().references('id').inTable('statuses').onDelete('CASCADE')
      table
        .integer('booking_id')
        .unsigned()
        .references('id')
        .inTable('bookings')
        .onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
