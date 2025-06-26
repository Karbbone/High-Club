import User from '#models/user'
import Image from '#models/image'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'
import path from 'node:path'
import hash from '@adonisjs/core/services/hash'

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
}
