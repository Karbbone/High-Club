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
        guest_emails = [],
        purchases = [],
        guest_purchases = [],
      } = request.only(['datetime', 'user_id', 'event_id', 'guest_emails', 'purchases', 'guest_purchases'])

      // Vérifier que l'utilisateur principal existe
      const mainUser = await User.find(user_id)
      if (!mainUser) {
        return response.badRequest({
          success: false,
          message: "L'utilisateur principal n'existe pas",
        })
      }

      // Vérifier que l'utilisateur principal n'a pas déjà un ticket pour cet événement
      const existingMainUserTicket = await Ticket.query()
        .where('user_id', user_id)
        .whereHas('booking', (query) => {
          query.where('event_id', event_id)
        })
        .first()

      if (existingMainUserTicket) {
        return response.badRequest({
          success: false,
          message: "L'utilisateur principal a déjà un ticket pour cet événement",
        })
      }

      // Vérifier les utilisateurs invités
      const guestUsers = []
      for (const email of guest_emails) {
        // Vérifier que l'utilisateur existe
        const user = await User.findBy('email', email)

        if (!user) {
          return response.badRequest({
            success: false,
            message: `L'utilisateur avec l'email ${email} n'existe pas dans l'application`,
          })
        }

        // Vérifier que l'utilisateur n'a pas déjà un ticket pour cet événement
        const existingTicket = await Ticket.query()
          .where('user_id', user.id)
          .whereHas('booking', (query) => {
            query.where('event_id', event_id)
          })
          .first()

        if (existingTicket) {
          return response.badRequest({
            success: false,
            message: `L'utilisateur ${email} a déjà un ticket pour cet événement`,
          })
        }

        guestUsers.push(user)
      }

      // Créer la réservation
      const booking = await Booking.create({
        datetime,
        user_id,
        event_id,
      })

      // Créer le ticket pour l'utilisateur principal
      const mainTicket = await Ticket.create({
        qrcode_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_${booking.id}_user_${user_id}`,
        booking_id: booking.id,
        user_id: user_id,
        status_id: 1, // Waiting
      })

      // Créer les achats pour le ticket principal
      for (const purchase of purchases) {
        await Purchase.create({
          ticket_id: mainTicket.id,
          product_id: purchase.product_id,
          status_id: 1, // Waiting
        })
      }

      // Traiter les invités et leurs achats
      const createdTickets = []

      for (let i = 0; i < guestUsers.length; i++) {
        const user = guestUsers[i]
        const guestPurchase = guest_purchases[i] || { purchases: [] }

        // Créer le ticket pour cet invité
        const ticket = await Ticket.create({
          qrcode_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_${booking.id}_user_${user.id}`,
          booking_id: booking.id,
          user_id: user.id,
          status_id: 1, // Waiting
        })

        // Créer les achats pour cet invité
        for (const purchase of guestPurchase.purchases || []) {
          await Purchase.create({
            ticket_id: ticket.id,
            product_id: purchase.product_id,
            status_id: 1, // Waiting
          })
        }

        createdTickets.push(ticket)
      }

      // Charger le booking avec ses relations pour la réponse
      await booking.load('tickets', (query) => {
        query.preload('user')
        query.preload('status')
        query.preload('purchases', (purchaseQuery) => {
          purchaseQuery.preload('product')
          purchaseQuery.preload('status')
        })
      })
      await booking.load('user')
      await booking.load('event')

      const totalPurchases = purchases.length + guest_purchases.reduce((total: number, guest: any) => total + (guest.purchases?.length || 0), 0)

      return response.created({
        success: true,
        message: `Réservation créée avec succès pour ${1 + guest_emails.length} personne(s)`,
        data: {
          booking,
          tickets_created: 1 + guest_emails.length,
          guests_added: guest_emails.length,
          purchases_created: totalPurchases,
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
}