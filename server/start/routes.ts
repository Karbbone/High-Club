/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Routes d'authentification publiques
router.post('/auth/register', '#controllers/users_controller.register')
router.post('/auth/login', '#controllers/users_controller.login')
router.post('/auth/logout', '#controllers/users_controller.logout')
router.get('/auth/me', '#controllers/users_controller.me')

router.get('/users/email', '#controllers/users_controller.showByEmail')
router.get('/user/:id/bookings', '#controllers/users_controller.showTicketByID')

// Routes CRUD standard
router.resource('products', '#controllers/products_controller')
router.resource('events', '#controllers/events_controller')
router.resource('tickets', '#controllers/tickets_controller')
router.resource('bookings', '#controllers/bookings_controller')
router.resource('users', '#controllers/users_controller')

router.get('/users/:id/tickets/:bookingId', '#controllers/users_controller.showTicketsByBooking')
router.get('/users/:id/tickets', '#controllers/users_controller.show')
router.put('/tickets/:id/waiting', '#controllers/tickets_controller.waiting')
router.put('/tickets/:id/used', '#controllers/tickets_controller.used')
router.put('/tickets/:id/canceled', '#controllers/tickets_controller.canceled')
router.put('/users/:id/profile-picture', '#controllers/users_controller.updateProfilePicture')

router.post('/messages', '#controllers/messages_controller.store')
router.post('/messages/user', '#controllers/messages_controller.getUserMessages')

router.get('/instagram/latest', '#controllers/instagram_controller.latest')
