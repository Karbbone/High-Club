import Purchase from '#models/purchase'
import Ticket from '#models/ticket'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Status extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
