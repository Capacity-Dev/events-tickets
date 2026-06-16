import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import PublicController from '#controllers/public_controller'
import OrganizerController from '#controllers/organizer_controller'
import BuyerController from '#controllers/buyer_controller'
import AdminController from '#controllers/admin_controller'

router.get('/', [PublicController, 'home']).as('home')

router.get('events', [PublicController, 'index']).as('events.index')
router.get('events/:slug', [PublicController, 'show']).as('events.show')

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
  })
  .use(middleware.auth())
  .use(middleware.admin())
