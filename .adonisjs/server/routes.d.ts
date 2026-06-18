import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'tickets.show': { paramsTuple: [ParamValue]; params: {'uuid': ParamValue} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.search': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'sitemap': { paramsTuple?: []; params?: {} }
    'webhooks.mbiyopay': { paramsTuple?: []; params?: {} }
    'lang.switch': { paramsTuple: [ParamValue]; params: {'locale': ParamValue} }
    'buy': { paramsTuple?: []; params?: {} }
    'order.confirmation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.initiate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.pending': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.success': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'dashboard.settings': { paramsTuple?: []; params?: {} }
    'dashboard.events': { paramsTuple?: []; params?: {} }
    'dashboard.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.events.store': { paramsTuple?: []; params?: {} }
    'dashboard.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.events.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.events.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.events.ticketTypes.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ticketTypeId': ParamValue} }
    'dashboard.checkin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.checkin.scan': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.checkin.tickets': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.payouts': { paramsTuple?: []; params?: {} }
    'dashboard.payouts.request': { paramsTuple?: []; params?: {} }
    'dashboard.clients': { paramsTuple?: []; params?: {} }
    'dashboard.orders': { paramsTuple?: []; params?: {} }
    'dashboard.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.tickets': { paramsTuple?: []; params?: {} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.events.pending': { paramsTuple?: []; params?: {} }
    'admin.events.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.freeze': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.unfreeze': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.fee.rules': { paramsTuple?: []; params?: {} }
    'admin.fee.rules.store': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.payouts.process': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.transactions': { paramsTuple?: []; params?: {} }
    'admin.transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.transactions.recheck': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.categories.store': { paramsTuple?: []; params?: {} }
    'admin.categories.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.homepage': { paramsTuple?: []; params?: {} }
    'admin.homepage.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.whatsapp': { paramsTuple?: []; params?: {} }
    'admin.whatsapp.store': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.currencies': { paramsTuple?: []; params?: {} }
    'admin.currencies.store': { paramsTuple?: []; params?: {} }
    'admin.currencies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.currencies.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'tickets.show': { paramsTuple: [ParamValue]; params: {'uuid': ParamValue} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.search': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'sitemap': { paramsTuple?: []; params?: {} }
    'lang.switch': { paramsTuple: [ParamValue]; params: {'locale': ParamValue} }
    'order.confirmation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.pending': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.success': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'dashboard.settings': { paramsTuple?: []; params?: {} }
    'dashboard.events': { paramsTuple?: []; params?: {} }
    'dashboard.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.events.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.checkin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.checkin.tickets': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.payouts': { paramsTuple?: []; params?: {} }
    'dashboard.clients': { paramsTuple?: []; params?: {} }
    'dashboard.orders': { paramsTuple?: []; params?: {} }
    'dashboard.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.tickets': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.events.pending': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.fee.rules': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.transactions': { paramsTuple?: []; params?: {} }
    'admin.transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.homepage': { paramsTuple?: []; params?: {} }
    'admin.whatsapp': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.currencies': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'tickets.show': { paramsTuple: [ParamValue]; params: {'uuid': ParamValue} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.search': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'sitemap': { paramsTuple?: []; params?: {} }
    'lang.switch': { paramsTuple: [ParamValue]; params: {'locale': ParamValue} }
    'order.confirmation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.pending': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.success': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payment.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'dashboard.settings': { paramsTuple?: []; params?: {} }
    'dashboard.events': { paramsTuple?: []; params?: {} }
    'dashboard.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.events.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.checkin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.checkin.tickets': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.payouts': { paramsTuple?: []; params?: {} }
    'dashboard.clients': { paramsTuple?: []; params?: {} }
    'dashboard.orders': { paramsTuple?: []; params?: {} }
    'dashboard.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.tickets': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.events.pending': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.fee.rules': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.transactions': { paramsTuple?: []; params?: {} }
    'admin.transactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.homepage': { paramsTuple?: []; params?: {} }
    'admin.whatsapp': { paramsTuple?: []; params?: {} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.currencies': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'webhooks.mbiyopay': { paramsTuple?: []; params?: {} }
    'buy': { paramsTuple?: []; params?: {} }
    'payment.initiate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard.events.store': { paramsTuple?: []; params?: {} }
    'dashboard.events.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.checkin.scan': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.payouts.request': { paramsTuple?: []; params?: {} }
    'dashboard.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'admin.events.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.freeze': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.unfreeze': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.fee.rules.store': { paramsTuple?: []; params?: {} }
    'admin.payouts.process': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.transactions.recheck': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.store': { paramsTuple?: []; params?: {} }
    'admin.homepage.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.whatsapp.store': { paramsTuple?: []; params?: {} }
    'admin.currencies.store': { paramsTuple?: []; params?: {} }
    'admin.currencies.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'dashboard.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'dashboard.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'dashboard.events.ticketTypes.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ticketTypeId': ParamValue} }
    'admin.users.role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.currencies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}