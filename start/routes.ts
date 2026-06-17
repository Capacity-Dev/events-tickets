import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import adminConfig from '#config/admin'
import PublicController from '#controllers/public_controller'
import OrganizerController from '#controllers/organizer_controller'
import BuyerController from '#controllers/buyer_controller'
import AdminController from '#controllers/admin_controller'
import GoogleAuthController from '#controllers/google_auth_controller'
import DashboardController from '#controllers/dashboard_controller'
import SettingsController from '#controllers/settings_controller'
import CartController from '#controllers/cart_controller'
import PaymentController from '#controllers/payment_controller'
import WebhookController from '#controllers/webhook_controller'

router.get('/', [PublicController, 'home']).as('home')

router.get('tickets/:uuid', [PublicController, 'showTicket']).as('tickets.show')
router.get('events', [PublicController, 'index']).as('events.index')
router.get('events/search', [PublicController, 'search']).as('events.search')
router.get('events/:slug', [PublicController, 'show']).as('events.show')
router.get('sitemap.xml', [PublicController, 'sitemap']).as('sitemap')

router.post('webhooks/mbiyopay', [WebhookController, 'mbiyopay']).as('webhooks.mbiyopay')

router
  .get('lang/:locale', ({ params, session, response }) => {
    const supported = ['fr', 'en']
    if (supported.includes(params.locale)) {
      session.put('locale', params.locale)
    }
    response.redirect().back()
  })
  .as('lang.switch')

router.post('buy', [CartController, 'buy']).as('buy')
router.get('order/:id', [CartController, 'confirmation']).as('order.confirmation')

router.get('payment/:id', [PaymentController, 'payForm']).as('payment.pay')
router.post('payment/:id', [PaymentController, 'initiate']).as('payment.initiate')
router.get('payment/:id/pending', [PaymentController, 'pending']).as('payment.pending')
router.get('payment/:id/success', [PaymentController, 'success']).as('payment.success')
router.get('api/payment/:id/status', [PaymentController, 'status']).as('payment.status')

router.get('auth/google', [GoogleAuthController, 'redirect']).as('auth.google.redirect')
router.get('auth/google/callback', [GoogleAuthController, 'callback']).as('auth.google.callback')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.get('dashboard', [DashboardController, 'index']).as('dashboard')
    router.get('dashboard/settings', [SettingsController, 'index']).as('dashboard.settings')

    router.get('dashboard/events', [OrganizerController, 'index']).as('dashboard.events')
    router
      .get('dashboard/events/create', [OrganizerController, 'create'])
      .as('dashboard.events.create')
    router.post('dashboard/events', [OrganizerController, 'store']).as('dashboard.events.store')
    router
      .get('dashboard/events/:id/edit', [OrganizerController, 'edit'])
      .as('dashboard.events.edit')
    router
      .put('dashboard/events/:id', [OrganizerController, 'update'])
      .as('dashboard.events.update')
    router
      .delete('dashboard/events/:id', [OrganizerController, 'destroy'])
      .as('dashboard.events.destroy')
    router
      .post('dashboard/events/:id/publish', [OrganizerController, 'publish'])
      .as('dashboard.events.publish')
    router
      .get('dashboard/events/:id/analytics', [OrganizerController, 'analytics'])
      .as('dashboard.events.analytics')
    router
      .patch('dashboard/events/:id/ticket-types/:ticketTypeId', [
        OrganizerController,
        'updateTicketType',
      ])
      .as('dashboard.events.ticketTypes.update')
    router.get('dashboard/check-in/:id', [OrganizerController, 'checkIn']).as('dashboard.checkin')
    router
      .post('dashboard/check-in/:id/scan', [OrganizerController, 'scanTicket'])
      .as('dashboard.checkin.scan')
    router
      .get('dashboard/check-in/:id/tickets', [OrganizerController, 'eventTickets'])
      .as('dashboard.checkin.tickets')
    router.get('dashboard/payouts', [OrganizerController, 'payouts']).as('dashboard.payouts')
    router
      .post('dashboard/payouts', [OrganizerController, 'requestPayout'])
      .as('dashboard.payouts.request')
    router.get('dashboard/clients', [OrganizerController, 'clients']).as('dashboard.clients')

    router.get('dashboard/orders', [BuyerController, 'orders']).as('dashboard.orders')
    router.get('dashboard/orders/:id', [BuyerController, 'showOrder']).as('dashboard.orders.show')
    router.get('dashboard/orders/:id/pay', [BuyerController, 'payForm']).as('dashboard.orders.pay')
    router.post('dashboard/orders/:id/pay', [BuyerController, 'pay']).as('dashboard.pay')
    router.get('dashboard/tickets', [BuyerController, 'tickets']).as('dashboard.tickets')
    router.post('orders', [BuyerController, 'store']).as('orders.store')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('', [AdminController, 'dashboard']).as('admin.dashboard')
    router.get('events/pending', [AdminController, 'pendingEvents']).as('admin.events.pending')
    router.post('events/:id/approve', [AdminController, 'approveEvent']).as('admin.events.approve')
    router.post('events/:id/reject', [AdminController, 'rejectEvent']).as('admin.events.reject')
    router.post('events/:id/freeze', [AdminController, 'freezeEvent']).as('admin.events.freeze')
    router
      .post('events/:id/unfreeze', [AdminController, 'unfreezeEvent'])
      .as('admin.events.unfreeze')
    router.get('users', [AdminController, 'users']).as('admin.users')
    router.get('users/:id', [AdminController, 'userShow']).as('admin.users.show')
    router.get('users/:id/edit', [AdminController, 'userEdit']).as('admin.users.edit')
    router.put('users/:id', [AdminController, 'userUpdate']).as('admin.users.update')
    router.patch('users/:id/role', [AdminController, 'updateUserRole']).as('admin.users.role')
    router.get('fee-rules', [AdminController, 'feeRules']).as('admin.fee.rules')
    router.post('fee-rules', [AdminController, 'storeFeeRule']).as('admin.fee.rules.store')
    router.get('finances', [AdminController, 'finances']).as('admin.finances')
    router
      .post('payouts/:id/process', [AdminController, 'processPayout'])
      .as('admin.payouts.process')
    router.get('transactions', [AdminController, 'transactions']).as('admin.transactions')
    router
      .get('transactions/:id', [AdminController, 'transactionShow'])
      .as('admin.transactions.show')
    router
      .post('transactions/:id/recheck', [AdminController, 'recheckTransaction'])
      .as('admin.transactions.recheck')
    router.get('categories', [AdminController, 'categories']).as('admin.categories')
    router.post('categories', [AdminController, 'storeCategory']).as('admin.categories.store')
    router
      .delete('categories/:id', [AdminController, 'deleteCategory'])
      .as('admin.categories.delete')
    router.get('homepage', [AdminController, 'homepage']).as('admin.homepage')
    router
      .post('homepage/:id/toggle-featured', [AdminController, 'toggleFeatured'])
      .as('admin.homepage.toggle')
    router.get('whatsapp', [AdminController, 'whatsappTemplates']).as('admin.whatsapp')
    router.post('whatsapp', [AdminController, 'storeWhatsappTemplate']).as('admin.whatsapp.store')
    router.get('settings', [SettingsController, 'index']).as('admin.settings')
    router.get('currencies', [AdminController, 'currencies']).as('admin.currencies')
    router.post('currencies', [AdminController, 'storeCurrency']).as('admin.currencies.store')
    router
      .patch('currencies/:id', [AdminController, 'updateCurrency'])
      .as('admin.currencies.update')
  })
  .prefix(adminConfig.prefix)
  .use(middleware.auth())
  .use(middleware.admin())
