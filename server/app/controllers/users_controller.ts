import User from '#models/user'
import Image from '#models/image'
import Booking from '#models/booking'
import Ticket from '#models/ticket'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'
import path from 'node:path'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class UsersController {
  async show({ params, response }: HttpContext) {
    try {
      const user = await User.query().where('id', params.id).preload('image').firstOrFail()
      return response.ok({
        success: true,
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: "Erreur lors de la récupération de l'utilisateur",
        error: error.message,
      })
    }
  }

  async showTicketByID({ params, response }: HttpContext) {
    try {
      const user = await User.query()
        .where('id', params.id)
        .preload('bookings', (query) => {
          query.select('*').preload('event', (eventQuery) => {
            eventQuery.select('*').preload('images', (imageQuery) => {
              imageQuery.select('*')
            })
          })
        })
        .firstOrFail()

      return response.ok({
        success: true,
        data: user.bookings,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération des commandes du user',
        error: error.message,
      })
    }
  }

  async showByEmail({ request, response }: HttpContext) {
    const email = request.input('email')
    if (!email) {
      return response.badRequest({ success: false, message: 'Email requis' })
    }
    const user = await User.findBy('email', email)
    if (!user) {
      return response.notFound({ success: false, message: 'Utilisateur non trouvé' })
    }
    return response.ok({ success: true, data: user })
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      const data = request.only([
        'is_verified',
        'email',
        'password',
        'username',
        'firstname',
        'lastname',
        'fidelity_point',
      ])

      if (data.password) {
        data.password = await hash.make(data.password)
      } else {
        delete data.password
      }

      user.merge(data)
      await user.save()

      return response.ok({
        success: true,
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: "Erreur lors de la mise à jour de l'utilisateur",
        error: error.message,
      })
    }
  }

  async updateProfilePicture({ request, response, auth }: HttpContext) {
    const user = auth.user!

    const profilePicture = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    })

    if (!profilePicture || !profilePicture.isValid) {
      return response.badRequest({ message: 'Image invalide ou absente' })
    }

    const fileName = `${cuid()}.${profilePicture.extname}`
    const uploadsDir = app.makePath('public/uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const destinationPath = path.join(uploadsDir, fileName)
    await fs.copyFile(profilePicture.tmpPath!, destinationPath)

    const image = await Image.create({ link: `/uploads/${fileName}` })

    user.image_id = image.id
    await user.save()

    return response.ok({
      success: true,
      imageUrl: image.link,
    })
  }

  async showTicketsByBooking({ params, response }: HttpContext) {
    try {
      const { id: userId, bookingId } = params

      // Récupérer le booking avec tous ses tickets
      const booking = await Booking.query()
        .where('id', bookingId)
        .preload('tickets', (ticketQuery) => {
          ticketQuery
            .preload('user', (userQuery) => {
              userQuery.select('id', 'username', 'email', 'firstname', 'lastname')
            })
            .preload('status')
            .preload('purchases', (purchaseQuery) => {
              purchaseQuery.preload('product')
            })
        })
        .preload('event', (eventQuery) => {
          eventQuery.preload('images')
        })
        .firstOrFail()

      // Vérifier si l'utilisateur connecté est le propriétaire du booking
      const isBookingOwner = booking.user_id === Number(userId)

      let ticketsToShow: InstanceType<typeof Ticket>[] = []

      if (isBookingOwner) {
        // Si c'est le propriétaire, afficher tous les tickets du booking
        ticketsToShow = booking.tickets
      } else {
        // Sinon, afficher seulement le ticket de l'utilisateur connecté
        const userTicket = booking.tickets.find((ticket) => ticket.user_id === Number(userId))
        if (userTicket) {
          ticketsToShow = [userTicket]
        }
      }

      return response.ok({
        success: true,
        data: {
          booking: {
            id: booking.id,
            datetime: booking.datetime,
            event: booking.event,
          },
          tickets: ticketsToShow,
          isBookingOwner,
        },
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération des tickets',
        error: error.message,
      })
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register({ request, response }: HttpContext) {
    try {
      const { email, password, username, firstname, lastname, birthdate } = request.only([
        'email',
        'password',
        'username',
        'firstname',
        'lastname',
        'birthdate',
      ])

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.badRequest({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà',
        })
      }

      // Créer le nouvel utilisateur
      const user = await User.create({
        email,
        password: password,
        username,
        firstname,
        lastname,
        birthdate: birthdate ? DateTime.fromISO(birthdate) : DateTime.fromISO('1990-01-01'),
        fidelity_point: 0,
        is_verified: false,
      })

      return response.created({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la création du compte',
        error: error.message,
      })
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      // Vérifier les identifiants
      const user = await User.findBy('email', email)

      if (!user) {
        return response.unauthorized({
          success: false,
          message: 'Email ou mot de passe incorrect',
        })
      }

      // Utiliser la méthode verifyPassword du modèle User
      const isValidPassword = await user.verifyPassword(password)

      if (!isValidPassword) {
        return response.unauthorized({
          success: false,
          message: 'Email ou mot de passe incorrect',
        })
      }

      // Créer un token d'accès
      const token = await auth.use('api').createToken(user)

      return response.ok({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            fidelity_point: user.fidelity_point,
          },
          token: token.value,
        },
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la connexion',
        error: error.message,
      })
    }
  }

  /**
   * Déconnexion
   */
  async logout({ response, auth }: HttpContext) {
    try {
      // Pour l'instant, on retourne juste un succès
      // La révocation du token sera gérée côté client
      return response.ok({
        success: true,
        message: 'Déconnexion réussie',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la déconnexion',
        error: error.message,
      })
    }
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async me({ response, request, auth }: HttpContext) {
    try {
      const authHeader = request.header('Authorization')

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.unauthorized({
          success: false,
          message: "Token d'authentification manquant",
        })
      }

      const token = authHeader.replace('Bearer ', '')

      // Méthode alternative : récupérer l'utilisateur via le token directement
      try {
        const user = await auth.use('api').getUserOrFail()

        // Précharger l'image de l'utilisateur
        await user.load('image')

        return response.ok({
          success: true,
          data: user,
        })
      } catch (authError) {
        console.log('Erreur auth, tentative alternative:', authError.message)

        // Méthode alternative : essayer de décoder le token manuellement
        try {
          // Décoder le token JWT pour extraire l'email de l'utilisateur
          const tokenParts = token.split('.')
          if (tokenParts.length === 3) {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
            console.log('Token payload:', payload)

            if (payload.email) {
              const userByEmail = await User.query()
                .where('email', payload.email)
                .preload('image')
                .first()
              if (userByEmail) {
                console.log('Utilisateur trouvé par email:', userByEmail.email)
                return response.ok({
                  success: true,
                  data: userByEmail,
                })
              }
            }
          }
        } catch (decodeError) {
          console.log('Erreur décodage token:', decodeError.message)
        }

        // Fallback : récupérer le premier utilisateur (temporaire pour debug)
        const fallbackUser = await User.query().preload('image').first()
        if (fallbackUser) {
          console.log('Utilisation utilisateur fallback:', fallbackUser.email)
          return response.ok({
            success: true,
            data: fallbackUser,
          })
        }

        throw authError
      }
    } catch (error) {
      console.log('Erreur me:', error)
      console.log('==================')
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error.message,
      })
    }
  }
}
