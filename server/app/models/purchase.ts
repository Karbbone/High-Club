import Product from '#models/product'
import Status from '#models/status'
import Ticket from '#models/ticket'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Purchase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>

  @belongsTo(() => Status)
  declare status: BelongsTo<typeof Status>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
