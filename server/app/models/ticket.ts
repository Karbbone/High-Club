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

  @column()
  declare booking_id: number

  @column()
  declare user_id: number

  @column()
  declare status_id: number

  @belongsTo(() => Status, {
    foreignKey: 'status_id',
  })
  declare status: BelongsTo<typeof Status>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Booking, {
    foreignKey: 'booking_id',
  })
  declare booking: BelongsTo<typeof Booking>

  @hasMany(() => Purchase, {
    foreignKey: 'ticket_id',
  })
  declare purchases: HasMany<typeof Purchase>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
