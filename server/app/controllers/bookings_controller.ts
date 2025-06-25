import Booking from '#models/booking'
import type { HttpContext } from '@adonisjs/core/http'

export default class BookingsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const bookings = await Booking.query()
        .preload('user', (query) => {
          query.select('id', 'username', 'email', 'firstname', 'lastname', 'fidelity_point')
        })
        .preload('event', (query) => {
          query.select('id', 'name', 'description', 'artist', 'start_datetime', 'end_datetime')
        })
        .preload('tickets', (query) => {
          query.preload('status')
        })

      return response.ok({
        success: true,
        data: bookings,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération des réservations',
        error: error.message,
      })
    }
  }

  /**
   * Display a single resource
   */
  async show({ params, response }: HttpContext) {
    try {
      const booking = await Booking.query()
        .where('id', params.id)
        .preload('user', (query) => {
          query.select('id', 'username', 'email', 'firstname', 'lastname', 'fidelity_point')
        })
        .preload('event', (query) => {
          query.select('id', 'name', 'description', 'artist', 'start_datetime', 'end_datetime')
        })
        .preload('tickets', (query) => {
          query.preload('status')
        })
        .first()

      if (!booking) {
        return response.notFound({
          success: false,
          message: 'Réservation non trouvée',
        })
      }

      return response.ok({
        success: true,
        data: booking,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération de la réservation',
        error: error.message,
      })
    }
  }

  /**
   * Handle form submission for creating a new resource
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['datetime', 'user_id', 'event_id'])

      const booking = await Booking.create(data)

      return response.created({
        success: true,
        message: 'Réservation créée avec succès',
        data: booking,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la création de la réservation',
        error: error.message,
      })
    }
  }

  /**
   * Show form for editing an existing resource
   */
  async edit({ params, response }: HttpContext) {
    try {
      const booking = await Booking.findOrFail(params.id)
      return response.ok({
        success: true,
        data: booking,
      })
    } catch (error) {
      return response.notFound({
        success: false,
        message: 'Réservation non trouvée',
      })
    }
  }

  /**
   * Handle form submission for updating an existing resource
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const booking = await Booking.findOrFail(params.id)
      const data = request.only(['datetime', 'user_id', 'event_id'])

      booking.merge(data)
      await booking.save()

      return response.ok({
        success: true,
        message: 'Réservation mise à jour avec succès',
        data: booking,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la mise à jour de la réservation',
        error: error.message,
      })
    }
  }

  /**
   * Delete a resource
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const booking = await Booking.findOrFail(params.id)
      await booking.delete()

      return response.ok({
        success: true,
        message: 'Réservation supprimée avec succès',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la suppression de la réservation',
        error: error.message,
      })
    }
  }
}
