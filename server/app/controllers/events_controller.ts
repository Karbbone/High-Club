import Event from '#models/event'
import type { HttpContext } from '@adonisjs/core/http'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const events = await Event.query().preload('images')
      return response.ok({
        success: true,
        data: events,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération des events',
        error: error.message,
      })
    }
  }
}
