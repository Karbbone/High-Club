import Booking from '#models/booking'
import Image from '#models/image'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare start_datetime: DateTime

  @column()
  declare end_datetime: DateTime

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare artist: string

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>

  @manyToMany(() => Image, {
    pivotTable: 'image_event',
  })
  declare images: ManyToMany<typeof Image>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
