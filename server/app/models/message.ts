import User from '#models/user'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare subject: string

  @column()
  declare body: string

  @column()
  declare user_id: number

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
