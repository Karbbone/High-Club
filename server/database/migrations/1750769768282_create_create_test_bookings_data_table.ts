import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'create_test_bookings_data'

  async up() {
    // Cette migration insère des données de test pour les bookings, tickets et purchases
    // Pas besoin de créer une table, on utilise les tables existantes

    // Insérer des bookings de test
    await this.db.table('bookings').multiInsert([
      {
        id: 1,
        datetime: '2025-07-24T18:00:00.000Z',
        user_id: 1,
        event_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        datetime: '2025-08-08T19:00:00.000Z',
        user_id: 1,
        event_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        datetime: '2025-08-23T20:00:00.000Z',
        user_id: 1,
        event_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Insérer des tickets de test
    await this.db.table('tickets').multiInsert([
      {
        id: 1,
        qrcode_url:
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_1_ticket_1',
        status_id: 1, // Waiting
        user_id: 1,
        booking_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        qrcode_url:
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_2_ticket_1',
        status_id: 1, // Waiting
        user_id: 1,
        booking_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        qrcode_url:
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_3_ticket_1',
        status_id: 1, // Waiting
        user_id: 1,
        booking_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        qrcode_url:
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_1_ticket_2',
        status_id: 3, // Used
        user_id: 1,
        booking_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        qrcode_url:
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_2_ticket_2',
        status_id: 2, // Canceled
        user_id: 1,
        booking_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Insérer des purchases de test
    await this.db.table('purchases').multiInsert([
      {
        id: 1,
        ticket_id: 1,
        product_id: 1, // Conso avec Alcool
        status_id: 1, // Waiting
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        ticket_id: 2,
        product_id: 2, // Conso sans Alcool
        status_id: 1, // Waiting
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        ticket_id: 3,
        product_id: 1, // Conso avec Alcool
        status_id: 1, // Waiting
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        ticket_id: 4,
        product_id: 2, // Conso sans Alcool
        status_id: 3, // Used
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  }

  async down() {
    // Supprimer les données de test dans l'ordre inverse
    await this.db.from('purchases').whereIn('id', [1, 2, 3, 4]).delete()
    await this.db.from('tickets').whereIn('id', [1, 2, 3, 4, 5]).delete()
    await this.db.from('bookings').whereIn('id', [1, 2, 3]).delete()
  }
}
