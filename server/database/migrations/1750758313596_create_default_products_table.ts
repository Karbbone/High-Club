import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    const images = await this.db
      .table('images')
      .insert([
        {
          link: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          link: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          link: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          link: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
      ])
      .returning('id')

    const products = await this.db
      .table(this.tableName)
      .insert([
        {
          name: 'Conso avec Alcool',
          description: 'Boissons alcoolisées disponibles lors de nos événements.',
          price: 8.5,
          category: 'Alcool',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
        {
          name: 'Conso sans Alcool',
          description: 'Boissons rafraîchissantes sans alcool.',
          price: 8.5,
          category: 'Sans Alcool',
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        },
      ])
      .returning('id')

    await this.db.table('image_product').insert([
      {
        image_id: images[0].id,
        product_id: products[0].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[1].id,
        product_id: products[0].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[2].id,
        product_id: products[1].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
      {
        image_id: images[3].id,
        product_id: products[1].id,
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      },
    ])
  }

  async down() {
    // 1. Récupérer les IDs des produits à supprimer
    const productsToDelete = await this.db
      .from('products')
      .whereIn('name', ['Conso avec Alcool', 'Conso sans Alcool'])
      .select('id')

    const productIds = productsToDelete.map((product: any) => product.id)

    if (productIds.length > 0) {
      // 2. Récupérer les IDs des images associées
      const imageAssociations = await this.db
        .from('image_product')
        .whereIn('product_id', productIds)
        .select('image_id')

      const imageIds = imageAssociations.map((assoc: any) => assoc.image_id)

      // 3. Supprimer les associations dans la table pivot
      await this.db.from('image_product').whereIn('product_id', productIds).delete()

      // 4. Supprimer les produits par défaut
      await this.db.from(this.tableName).whereIn('id', productIds).delete()

      // 5. Supprimer les images associées
      if (imageIds.length > 0) {
        await this.db.from('images').whereIn('id', imageIds).delete()
      }
    }
  }
}
