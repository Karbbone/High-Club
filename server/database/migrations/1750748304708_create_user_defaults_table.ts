import hash from '@adonisjs/core/services/hash'
import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // 1. Créer une image par défaut pour l'admin
    const [imageResult] = await this.db
      .table('images')
      .insert({
        link: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Nunu_0.jpg',
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      })
      .returning('id')

    // Extraire l'ID de l'objet retourné
    const imageId = imageResult.id

    // 2. Créer un utilisateur par défaut avec l'image associée
    await this.db.table(this.tableName).insert({
      is_verified: true,
      email: 'admin@mydi.com',
      password: await hash.make('Password123!'),
      username: 'admin',
      firstname: 'Admin',
      lastname: 'System',
      birthdate: new Date('1990-01-01'),
      fidelity_point: 100,
      image_id: imageId,
      created_at: DateTime.now().toSQL(),
      updated_at: DateTime.now().toSQL(),
    })
  }

  async down() {
    // 1. Récupérer l'ID de l'image associée à l'utilisateur admin
    const user = await this.db.from(this.tableName).where('email', 'admin@mydi.com').first()

    // 2. Supprimer l'utilisateur par défaut
    await this.db.from(this.tableName).where('email', 'admin@mydi.com').delete()

    // 3. Supprimer l'image associée si elle existe
    if (user && user.image_id) {
      await this.db.from('images').where('id', user.image_id).delete()
    }
  }
}
