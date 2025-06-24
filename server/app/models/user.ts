import Booking from '#models/booking'
import Image from '#models/image'
import Ticket from '#models/ticket'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare is_verified: boolean

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare username: string

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare birthdate: DateTime

  @column()
  declare fidelity_point: number

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>

  @belongsTo(() => Image)
  declare image: BelongsTo<typeof Image>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
