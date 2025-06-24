import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'statuses'

  async up() {
    await this.db.table(this.tableName).insert([
      {
        name: 'Waiting',
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        name: 'Canceled',
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        name: 'Used',
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
    ])
  }

  async down() {
    await this.db.from(this.tableName).whereIn('name', ['Waiting', 'Canceled', 'Used']).delete()
  }
}
