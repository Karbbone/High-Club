import Booking from '#models/booking'
import Purchase from '#models/purchase'
import Status from '#models/status'
import User from '#models/user'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare qrcode_url: string

  @belongsTo(() => Status)
  declare status: BelongsTo<typeof Status>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Booking)
  declare booking: BelongsTo<typeof Booking>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
