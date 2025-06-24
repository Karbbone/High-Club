import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    const images = await this.db
      .table('images')
      .insert([
        {
          link: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          link: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          link: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          link: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          link: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
      ])
      .returning('id')

    const events = await this.db
      .table(this.tableName)
      .insert([
        {
          name: 'Summer Festival 2025',
          description:
            "Le plus grand festival de musique électronique de l'été ! Venez danser sous les étoiles avec les meilleurs DJs internationaux dans une ambiance festive et conviviale.",
          artist: 'Martin Garrix & David Guetta',
          start_datetime: DateTime.now().plus({ days: 30 }).toSQL(),
          end_datetime: DateTime.now().plus({ days: 30, hours: 8 }).toSQL(),
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          name: 'Rock Night Experience',
          description:
            'Une soirée rock inoubliable avec des légendes du rock moderne. Guitares, basse et batterie pour une nuit de pure énergie musicale.',
          artist: 'Imagine Dragons & Foo Fighters',
          start_datetime: DateTime.now().plus({ days: 45 }).toSQL(),
          end_datetime: DateTime.now().plus({ days: 45, hours: 6 }).toSQL(),
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          name: 'Jazz & Soul Evening',
          description:
            'Une soirée intimiste dédiée au jazz et à la soul. Laissez-vous emporter par des mélodies envoûtantes dans une atmosphère chaleureuse et raffinée.',
          artist: 'Norah Jones & John Legend',
          start_datetime: DateTime.now().plus({ days: 60 }).toSQL(),
          end_datetime: DateTime.now().plus({ days: 60, hours: 5 }).toSQL(),
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
      ])
      .returning('id')

    await this.db.table('image_event').insert([
      {
        image_id: images[0].id,
        event_id: events[0].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[1].id,
        event_id: events[0].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[2].id,
        event_id: events[1].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[3].id,
        event_id: events[1].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[4].id,
        event_id: events[2].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[3].id,
        event_id: events[2].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
    ])
  }

  async down() {
    const eventsToDelete = await this.db
      .from('events')
      .whereIn('name', ['Summer Festival 2025', 'Rock Night Experience', 'Jazz & Soul Evening'])
      .select('id')

    const eventIds = eventsToDelete.map((event: any) => event.id)

    if (eventIds.length > 0) {
      const imageAssociations = await this.db
        .from('image_event')
        .whereIn('event_id', eventIds)
        .select('image_id')

      const imageIds = imageAssociations.map((assoc: any) => assoc.image_id)

      await this.db.from('image_event').whereIn('event_id', eventIds).delete()

      await this.db.from(this.tableName).whereIn('id', eventIds).delete()

      if (imageIds.length > 0) {
        await this.db.from('images').whereIn('id', imageIds).delete()
      }
    }
  }
}
