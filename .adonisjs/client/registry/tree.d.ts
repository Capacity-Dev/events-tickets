/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  events: {
    index: typeof routes['events.index']
    show: typeof routes['events.show']
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: {
    organizer: {
      events: typeof routes['dashboard.organizer.events'] & {
        create: typeof routes['dashboard.organizer.events.create']
        store: typeof routes['dashboard.organizer.events.store']
        edit: typeof routes['dashboard.organizer.events.edit']
        update: typeof routes['dashboard.organizer.events.update']
        destroy: typeof routes['dashboard.organizer.events.destroy']
        publish: typeof routes['dashboard.organizer.events.publish']
      }
    }
    buyer: {
      orders: typeof routes['dashboard.buyer.orders'] & {
        show: typeof routes['dashboard.buyer.orders.show']
      }
      tickets: typeof routes['dashboard.buyer.tickets']
    }
  }
  orders: {
    store: typeof routes['orders.store']
  }
}
