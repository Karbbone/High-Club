import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.boolean('is_verified').defaultTo(false).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('username').notNullable().unique()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.dateTime('birthdate').notNullable()
      table.integer('fidelity_point').defaultTo(0).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
