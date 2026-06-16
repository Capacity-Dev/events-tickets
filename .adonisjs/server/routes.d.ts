import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.search': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'sitemap': { paramsTuple?: []; params?: {} }
    'webhooks.mbiyopay': { paramsTuple?: []; params?: {} }
    'buy': { paramsTuple?: []; params?: {} }
    'order.confirmation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.buyer.tickets': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.store': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.checkin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.payouts': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.payouts.request': { paramsTuple?: []; params?: {} }
    'admin.events.pending': { paramsTuple?: []; params?: {} }
    'admin.events.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.fee.rules': { paramsTuple?: []; params?: {} }
    'admin.fee.rules.store': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.payouts.process': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.categories.store': { paramsTuple?: []; params?: {} }
    'admin.categories.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.homepage': { paramsTuple?: []; params?: {} }
    'admin.homepage.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.whatsapp': { paramsTuple?: []; params?: {} }
    'admin.whatsapp.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.search': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'sitemap': { paramsTuple?: []; params?: {} }
    'order.confirmation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.buyer.tickets': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.checkin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.payouts': { paramsTuple?: []; params?: {} }
    'admin.events.pending': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.fee.rules': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.homepage': { paramsTuple?: []; params?: {} }
    'admin.whatsapp': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.search': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'sitemap': { paramsTuple?: []; params?: {} }
    'order.confirmation': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.buyer.tickets': { paramsTuple?: []; params?: {} }
    'dashboard.buyer.orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.checkin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.payouts': { paramsTuple?: []; params?: {} }
    'admin.events.pending': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.fee.rules': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.homepage': { paramsTuple?: []; params?: {} }
    'admin.whatsapp': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'webhooks.mbiyopay': { paramsTuple?: []; params?: {} }
    'buy': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'orders.pay': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.store': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.payouts.request': { paramsTuple?: []; params?: {} }
    'admin.events.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.reject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.fee.rules.store': { paramsTuple?: []; params?: {} }
    'admin.payouts.process': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.store': { paramsTuple?: []; params?: {} }
    'admin.homepage.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.whatsapp.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'dashboard.organizer.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'dashboard.organizer.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.categories.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin.users.role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}