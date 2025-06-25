import Message from '#models/message'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const createMessageValidator = vine.compile(
  vine.object({
    subject: vine.string().trim().minLength(1),
    body: vine.string().trim().minLength(1),
    userId: vine.number().positive(),
  })
)

const getUserMessagesValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
  })
)

export default class MessagesController {
  /**
   * Récupère tous les messages d'un utilisateur
   */
  async getUserMessages({ request, response }: HttpContext) {
    try {
      const { userId } = await request.validateUsing(getUserMessagesValidator)

      // Vérifier que l'utilisateur existe
      const user = await User.find(userId)
      if (!user) {
        return response.status(404).json({
          error: 'Utilisateur non trouvé',
        })
      }

      // Récupérer tous les messages de l'utilisateur
      const messages = await Message.query()
        .where('user_id', userId)
        .preload('user')
        .orderBy('created_at', 'desc')

      return response.json({
        data: messages,
        message: 'Messages récupérés avec succès',
      })
    } catch (error) {
      return response.status(400).json({
        error: 'Erreur lors de la récupération des messages',
        details: error.messages || error.message,
      })
    }
  }

  /**
   * Crée un nouveau message
   */
  async store({ request, response }: HttpContext) {
    try {
      const { subject, body, userId } = await request.validateUsing(createMessageValidator)

      // Vérifier que l'utilisateur existe
      const user = await User.find(userId)
      if (!user) {
        return response.status(404).json({
          error: 'Utilisateur non trouvé',
        })
      }

      // Créer le message
      const message = await Message.create({
        subject,
        body,
        user_id: userId,
      })

      // Charger la relation utilisateur
      await message.load('user')

      return response.status(201).json({
        data: message,
        message: 'Message créé avec succès',
      })
    } catch (error) {
      return response.status(400).json({
        error: 'Erreur lors de la création du message',
        details: error.messages || error.message,
      })
    }
  }
}
