import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import PublicController from '#controllers/public_controller'
import OrganizerController from '#controllers/organizer_controller'
import BuyerController from '#controllers/buyer_controller'
import AdminController from '#controllers/admin_controller'
import GoogleAuthController from '#controllers/google_auth_controller'
import CartController from '#controllers/cart_controller'
import WebhookController from '#controllers/webhook_controller'

router.get('/', [PublicController, 'home']).as('home')

router.get('events', [PublicController, 'index']).as('events.index')
router.get('events/search', [PublicController, 'search']).as('events.search')
router.get('events/:slug', [PublicController, 'show']).as('events.show')
router.get('sitemap.xml', [PublicController, 'sitemap']).as('sitemap')

router.post('webhooks/mbiyopay', [WebhookController, 'mbiyopay']).as('webhooks.mbiyopay')

router.post('buy', [CartController, 'buy']).as('buy')
router.get('order/:id', [CartController, 'confirmation']).as('order.confirmation')

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
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('dashboard/buyer/orders', [BuyerController, 'orders']).as('dashboard.buyer.orders')
    router.get('dashboard/buyer/orders/:id', [BuyerController, 'showOrder']).as('dashboard.buyer.orders.show')
    router.get('dashboard/buyer/tickets', [BuyerController, 'tickets']).as('dashboard.buyer.tickets')
    router.get('dashboard/buyer/orders/:id/pay', [BuyerController, 'payForm']).as('dashboard.buyer.orders.pay')
    router.post('dashboard/buyer/orders/:id/pay', [BuyerController, 'pay']).as('orders.pay')
    router.post('orders', [BuyerController, 'store']).as('orders.store')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('dashboard/organizer/events', [OrganizerController, 'index']).as('dashboard.organizer.events')
    router.get('dashboard/organizer/events/create', [OrganizerController, 'create']).as('dashboard.organizer.events.create')
    router.post('dashboard/organizer/events', [OrganizerController, 'store']).as('dashboard.organizer.events.store')
    router.get('dashboard/organizer/events/:id/edit', [OrganizerController, 'edit']).as('dashboard.organizer.events.edit')
    router.put('dashboard/organizer/events/:id', [OrganizerController, 'update']).as('dashboard.organizer.events.update')
    router.delete('dashboard/organizer/events/:id', [OrganizerController, 'destroy']).as('dashboard.organizer.events.destroy')
    router.post('dashboard/organizer/events/:id/publish', [OrganizerController, 'publish']).as('dashboard.organizer.events.publish')
    router.get('dashboard/organizer/events/:id/analytics', [OrganizerController, 'analytics']).as('dashboard.organizer.analytics')
    router.get('dashboard/organizer/check-in/:id', [OrganizerController, 'checkIn']).as('dashboard.organizer.checkin')
    router.get('dashboard/organizer/payouts', [OrganizerController, 'payouts']).as('dashboard.organizer.payouts')
    router.post('dashboard/organizer/payouts', [OrganizerController, 'requestPayout']).as('dashboard.organizer.payouts.request')
  })
  .use(middleware.auth())
  .use(middleware.organizer())

router
  .group(() => {
    router.get('admin/events/pending', [AdminController, 'pendingEvents']).as('admin.events.pending')
    router.post('admin/events/:id/approve', [AdminController, 'approveEvent']).as('admin.events.approve')
    router.post('admin/events/:id/reject', [AdminController, 'rejectEvent']).as('admin.events.reject')
    router.get('admin/users', [AdminController, 'users']).as('admin.users')
    router.patch('admin/users/:id/role', [AdminController, 'updateUserRole']).as('admin.users.role')
    router.get('admin/fee-rules', [AdminController, 'feeRules']).as('admin.fee.rules')
    router.post('admin/fee-rules', [AdminController, 'storeFeeRule']).as('admin.fee.rules.store')
    router.get('admin/finances', [AdminController, 'finances']).as('admin.finances')
    router.post('admin/payouts/:id/process', [AdminController, 'processPayout']).as('admin.payouts.process')
    router.get('admin/categories', [AdminController, 'categories']).as('admin.categories')
    router.post('admin/categories', [AdminController, 'storeCategory']).as('admin.categories.store')
    router.delete('admin/categories/:id', [AdminController, 'deleteCategory']).as('admin.categories.delete')
    router.get('admin/homepage', [AdminController, 'homepage']).as('admin.homepage')
    router.post('admin/homepage/:id/toggle-featured', [AdminController, 'toggleFeatured']).as('admin.homepage.toggle')
    router.get('admin/whatsapp', [AdminController, 'whatsappTemplates']).as('admin.whatsapp')
    router.post('admin/whatsapp', [AdminController, 'storeWhatsappTemplate']).as('admin.whatsapp.store')
  })
  .use(middleware.auth())
  .use(middleware.admin())
