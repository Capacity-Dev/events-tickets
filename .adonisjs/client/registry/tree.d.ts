/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  events: {
    index: typeof routes['events.index']
    search: typeof routes['events.search']
    show: typeof routes['events.show']
  }
  sitemap: typeof routes['sitemap']
  webhooks: {
    mbiyopay: typeof routes['webhooks.mbiyopay']
  }
  buy: typeof routes['buy']
  order: {
    confirmation: typeof routes['order.confirmation']
  }
  auth: {
    google: {
      redirect: typeof routes['auth.google.redirect']
      callback: typeof routes['auth.google.callback']
    }
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
    buyer: {
      orders: typeof routes['dashboard.buyer.orders'] & {
        show: typeof routes['dashboard.buyer.orders.show']
        pay: typeof routes['dashboard.buyer.orders.pay']
      }
      tickets: typeof routes['dashboard.buyer.tickets']
    }
    organizer: {
      events: typeof routes['dashboard.organizer.events'] & {
        create: typeof routes['dashboard.organizer.events.create']
        store: typeof routes['dashboard.organizer.events.store']
        edit: typeof routes['dashboard.organizer.events.edit']
        update: typeof routes['dashboard.organizer.events.update']
        destroy: typeof routes['dashboard.organizer.events.destroy']
        publish: typeof routes['dashboard.organizer.events.publish']
      }
      analytics: typeof routes['dashboard.organizer.analytics']
      checkin: typeof routes['dashboard.organizer.checkin']
      payouts: typeof routes['dashboard.organizer.payouts'] & {
        request: typeof routes['dashboard.organizer.payouts.request']
      }
    }
  }
  orders: {
    pay: typeof routes['orders.pay']
    store: typeof routes['orders.store']
  }
  admin: {
    events: {
      pending: typeof routes['admin.events.pending']
      approve: typeof routes['admin.events.approve']
      reject: typeof routes['admin.events.reject']
    }
    users: typeof routes['admin.users'] & {
      role: typeof routes['admin.users.role']
    }
    fee: {
      rules: typeof routes['admin.fee.rules'] & {
        store: typeof routes['admin.fee.rules.store']
      }
    }
    finances: typeof routes['admin.finances']
    payouts: {
      process: typeof routes['admin.payouts.process']
    }
    categories: typeof routes['admin.categories'] & {
      store: typeof routes['admin.categories.store']
      delete: typeof routes['admin.categories.delete']
    }
    homepage: typeof routes['admin.homepage'] & {
      toggle: typeof routes['admin.homepage.toggle']
    }
    whatsapp: typeof routes['admin.whatsapp'] & {
      store: typeof routes['admin.whatsapp.store']
    }
  }
}
