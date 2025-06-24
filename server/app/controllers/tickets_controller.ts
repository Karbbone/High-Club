import Status from '#models/status'
import Ticket from '#models/ticket'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      return response.ok({
        success: true,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération des tickets',
        error: error.message,
      })
    }
  }

  async waiting({ params, response }: HttpContext) {
    try {
      const ticket = await Ticket.findOrFail(params.id)
      const usedStatus = await Status.findByOrFail('name', 'Waiting')
      ticket.status.id = usedStatus.id
      await ticket.save()
      return response.ok({
        success: true,
        message: 'Tickets mis en attente',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la modification de status',
        error: error.message,
      })
    }
  }

  async used({ params, response }: HttpContext) {
    try {
      const ticket = await Ticket.findOrFail(params.id)
      const usedStatus = await Status.findByOrFail('name', 'Used')
      ticket.status.id = usedStatus.id
      await ticket.save()
      return response.ok({
        success: true,
        message: 'Tickets mis en utilisé',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la modification de status',
        error: error.message,
      })
    }
  }

  async canceled({ response, params }: HttpContext) {
    try {
      const ticket = await Ticket.findOrFail(params.id)
      const usedStatus = await Status.findByOrFail('name', 'Canceled')
      ticket.status.id = usedStatus.id
      await ticket.save()
      return response.ok({
        success: true,
        message: 'Tickets mis en annulé',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la modification de status',
        error: error.message,
      })
    }
  }
}
