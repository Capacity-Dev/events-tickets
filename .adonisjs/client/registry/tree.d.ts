/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  uploads: {
    serve: typeof routes['uploads.serve']
  }
  home: typeof routes['home']
  tickets: {
    show: typeof routes['tickets.show']
  }
  events: {
    index: typeof routes['events.index']
    search: typeof routes['events.search']
    show: typeof routes['events.show']
  }
  sitemap: typeof routes['sitemap']
  webhooks: {
    mbiyopay: typeof routes['webhooks.mbiyopay']
  }
  lang: {
    switch: typeof routes['lang.switch']
  }
  buy: typeof routes['buy']
  order: {
    confirmation: typeof routes['order.confirmation']
  }
  payment: {
    pay: typeof routes['payment.pay']
    initiate: typeof routes['payment.initiate']
    pending: typeof routes['payment.pending']
    success: typeof routes['payment.success']
    status: typeof routes['payment.status']
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
  dashboard: typeof routes['dashboard'] & {
    settings: typeof routes['dashboard.settings']
    events: typeof routes['dashboard.events'] & {
      create: typeof routes['dashboard.events.create']
      store: typeof routes['dashboard.events.store']
      edit: typeof routes['dashboard.events.edit']
      update: typeof routes['dashboard.events.update']
      destroy: typeof routes['dashboard.events.destroy']
      publish: typeof routes['dashboard.events.publish']
      analytics: typeof routes['dashboard.events.analytics']
      ticketTypes: {
        update: typeof routes['dashboard.events.ticketTypes.update']
      }
    }
    checkin: typeof routes['dashboard.checkin'] & {
      scan: typeof routes['dashboard.checkin.scan']
      tickets: typeof routes['dashboard.checkin.tickets']
    }
    payouts: typeof routes['dashboard.payouts'] & {
      request: typeof routes['dashboard.payouts.request']
    }
    clients: typeof routes['dashboard.clients']
    orders: typeof routes['dashboard.orders'] & {
      show: typeof routes['dashboard.orders.show']
      pay: typeof routes['dashboard.orders.pay']
    }
    pay: typeof routes['dashboard.pay']
    tickets: typeof routes['dashboard.tickets']
  }
  orders: {
    store: typeof routes['orders.store']
  }
  admin: {
    dashboard: typeof routes['admin.dashboard']
    events: {
      pending: typeof routes['admin.events.pending']
      approve: typeof routes['admin.events.approve']
      reject: typeof routes['admin.events.reject']
      freeze: typeof routes['admin.events.freeze']
      unfreeze: typeof routes['admin.events.unfreeze']
    }
    users: typeof routes['admin.users'] & {
      show: typeof routes['admin.users.show']
      edit: typeof routes['admin.users.edit']
      update: typeof routes['admin.users.update']
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
    transactions: typeof routes['admin.transactions'] & {
      show: typeof routes['admin.transactions.show']
      recheck: typeof routes['admin.transactions.recheck']
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
    settings: typeof routes['admin.settings']
    currencies: typeof routes['admin.currencies'] & {
      store: typeof routes['admin.currencies.store']
      update: typeof routes['admin.currencies.update'] & {
        post: typeof routes['admin.currencies.update.post']
      }
    }
  }
}
