import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import PublicController from '#controllers/public_controller'
import OrganizerController from '#controllers/organizer_controller'

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
    router.get('dashboard/organizer/events', [OrganizerController, 'index']).as('dashboard.organizer.events')
    router.get('dashboard/organizer/events/create', [OrganizerController, 'create']).as('dashboard.organizer.events.create')
    router.post('dashboard/organizer/events', [OrganizerController, 'store']).as('dashboard.organizer.events.store')
    router.get('dashboard/organizer/events/:id/edit', [OrganizerController, 'edit']).as('dashboard.organizer.events.edit')
    router.put('dashboard/organizer/events/:id', [OrganizerController, 'update']).as('dashboard.organizer.events.update')
    router.delete('dashboard/organizer/events/:id', [OrganizerController, 'destroy']).as('dashboard.organizer.events.destroy')
    router.post('dashboard/organizer/events/:id/publish', [OrganizerController, 'publish']).as('dashboard.organizer.events.publish')
  })
  .use(middleware.auth())
  .use(middleware.organizer())
