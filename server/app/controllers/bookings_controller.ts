import Booking from '#models/booking'
import Ticket from '#models/ticket'
import User from '#models/user'
import Purchase from '#models/purchase'
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
          query.preload('user', (userQuery) => {
            userQuery.select('id', 'username', 'email', 'firstname', 'lastname')
          })
          query.preload('purchases', (purchaseQuery) => {
            purchaseQuery.preload('product')
            purchaseQuery.preload('status')
          })
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
          query.preload('user', (userQuery) => {
            userQuery.select('id', 'username', 'email', 'firstname', 'lastname')
          })
          query.preload('purchases', (purchaseQuery) => {
            purchaseQuery.preload('product')
            purchaseQuery.preload('status')
          })
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
      const {
        datetime,
        user_id,
        event_id,
        purchases = [],
        guests = [],
      } = request.only(['datetime', 'user_id', 'event_id', 'purchases', 'guests'])

      // Validation de l'utilisateur principal
      const mainUser = await this.validateMainUser(user_id, event_id, response)
      if (!mainUser) return

      // Validation des utilisateurs invités
      const guestUsers = await this.validateGuestUsers(guests, event_id, response)
      if (!guestUsers) return

      // Créer la réservation
      const booking = await Booking.create({
        datetime,
        user_id,
        event_id,
      })

      // Créer le ticket et les achats pour l'utilisateur principal
      await this.createMainUserTicket(booking, user_id, purchases)

      // Créer les tickets et achats pour les invités
      await this.createGuestTickets(booking, guestUsers)

      // Calculer les statistiques et organiser les données
      const stats = this.calculateBookingStats(purchases, guestUsers)

      return response.created({
        success: true,
        message: `Réservation créée avec succès pour ${1 + guests.length} personne(s)`,
        data: {
          tickets_created: stats.ticketsCreated,
          guests_added: stats.guestsAdded,
          purchases_created: stats.purchasesCreated,
        },
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

  /**
   * Valider l'utilisateur principal
   */
  private async validateMainUser(userId: number, eventId: number, response: any) {
    const mainUser = await User.find(userId)
    if (!mainUser) {
      response.badRequest({
        success: false,
        message: "L'utilisateur connecté n'a pas été trouvé",
      })
      return null
    }

    const existingMainUserTicket = await Ticket.query()
      .where('user_id', userId)
      .whereHas('booking', (query) => {
        query.where('event_id', eventId)
      })
      .first()

    if (existingMainUserTicket) {
      response.badRequest({
        success: false,
        message: "L'utilisateur connecté a déjà un ticket pour cet événement",
      })
      return null
    }

    return mainUser
  }

  /**
   * Valider les utilisateurs invités
   */
  private async validateGuestUsers(guests: any[], eventId: number, response: any) {
    const guestUsers = []
    
    for (const guest of guests) {
      const user = await User.findBy('email', guest.email)

      if (!user) {
        response.badRequest({
          success: false,
          message: `L'utilisateur avec l'email ${guest.email} n'existe pas dans l'application`,
        })
        return null
      }

      const existingTicket = await Ticket.query()
        .where('user_id', user.id)
        .whereHas('booking', (query) => {
          query.where('event_id', eventId)
        })
        .first()

      if (existingTicket) {
        response.badRequest({
          success: false,
          message: `L'utilisateur ${guest.email} a déjà un ticket pour cet événement`,
        })
        return null
      }

      guestUsers.push({ user, purchases: guest.purchases || [] })
    }

    return guestUsers
  }

  /**
   * Créer le ticket pour l'utilisateur principal
   */
  private async createMainUserTicket(booking: any, userId: number, purchases: any[]) {
    const mainTicket = await Ticket.create({
      qrcode_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_${booking.id}_user_${userId}`,
      booking_id: booking.id,
      user_id: userId,
      status_id: 1, // Waiting
    })

    await this.createPurchasesForTicket(mainTicket.id, purchases)
  }

  /**
   * Créer les achats pour un ticket
   */
  private async createPurchasesForTicket(ticketId: number, purchases: any[]) {
    const purchasesToCreate = []
    
    for (const purchase of purchases) {
      for (let i = 0; i < purchase.quantity; i++) {
        purchasesToCreate.push({
          ticket_id: ticketId,
          product_id: purchase.product_id,
          status_id: 1, // Waiting
        })
      }
    }
    
    if (purchasesToCreate.length > 0) {
      await Purchase.createMany(purchasesToCreate)
    }
  }

  /**
   * Créer les tickets et achats pour les invités
   */
  private async createGuestTickets(booking: any, guestUsers: any[]) {
    for (const guestData of guestUsers) {
      const { user, purchases: guestPurchases } = guestData

      const ticket = await Ticket.create({
        qrcode_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_${booking.id}_user_${user.id}`,
        booking_id: booking.id,
        user_id: user.id,
        status_id: 1, // Waiting
      })

      await this.createPurchasesForTicket(ticket.id, guestPurchases)
    }
  }

  /**
   * Calculer les statistiques de la réservation
   */
  private calculateBookingStats(purchases: any[], guestUsers: any[]) {
    const mainPurchasesCount = purchases.reduce((total: number, purchase: any) => total + purchase.quantity, 0)
    const guestPurchasesCount = guestUsers.reduce((total: number, guestData: any) => {
      return total + guestData.purchases.reduce((sum: number, purchase: any) => sum + purchase.quantity, 0)
    }, 0)

    return {
      ticketsCreated: 1 + guestUsers.length,
      guestsAdded: guestUsers.length,
      purchasesCreated: mainPurchasesCount + guestPurchasesCount,
    }
  }
}