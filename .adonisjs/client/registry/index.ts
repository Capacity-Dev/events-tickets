/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'tickets.show': {
    methods: ["GET","HEAD"],
    pattern: '/tickets/:uuid',
    tokens: [{"old":"/tickets/:uuid","type":0,"val":"tickets","end":""},{"old":"/tickets/:uuid","type":1,"val":"uuid","end":""}],
    types: placeholder as Registry['tickets.show']['types'],
  },
  'events.index': {
    methods: ["GET","HEAD"],
    pattern: '/events',
    tokens: [{"old":"/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['events.index']['types'],
  },
  'events.search': {
    methods: ["GET","HEAD"],
    pattern: '/events/search',
    tokens: [{"old":"/events/search","type":0,"val":"events","end":""},{"old":"/events/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['events.search']['types'],
  },
  'events.show': {
    methods: ["GET","HEAD"],
    pattern: '/events/:slug',
    tokens: [{"old":"/events/:slug","type":0,"val":"events","end":""},{"old":"/events/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['events.show']['types'],
  },
  'sitemap': {
    methods: ["GET","HEAD"],
    pattern: '/sitemap.xml',
    tokens: [{"old":"/sitemap.xml","type":0,"val":"sitemap.xml","end":""}],
    types: placeholder as Registry['sitemap']['types'],
  },
  'webhooks.mbiyopay': {
    methods: ["POST"],
    pattern: '/webhooks/mbiyopay',
    tokens: [{"old":"/webhooks/mbiyopay","type":0,"val":"webhooks","end":""},{"old":"/webhooks/mbiyopay","type":0,"val":"mbiyopay","end":""}],
    types: placeholder as Registry['webhooks.mbiyopay']['types'],
  },
  'lang.switch': {
    methods: ["GET","HEAD"],
    pattern: '/lang/:locale',
    tokens: [{"old":"/lang/:locale","type":0,"val":"lang","end":""},{"old":"/lang/:locale","type":1,"val":"locale","end":""}],
    types: placeholder as Registry['lang.switch']['types'],
  },
  'buy': {
    methods: ["POST"],
    pattern: '/buy',
    tokens: [{"old":"/buy","type":0,"val":"buy","end":""}],
    types: placeholder as Registry['buy']['types'],
  },
  'order.confirmation': {
    methods: ["GET","HEAD"],
    pattern: '/order/:id',
    tokens: [{"old":"/order/:id","type":0,"val":"order","end":""},{"old":"/order/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['order.confirmation']['types'],
  },
  'payment.pay': {
    methods: ["GET","HEAD"],
    pattern: '/payment/:id',
    tokens: [{"old":"/payment/:id","type":0,"val":"payment","end":""},{"old":"/payment/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payment.pay']['types'],
  },
  'payment.initiate': {
    methods: ["POST"],
    pattern: '/payment/:id',
    tokens: [{"old":"/payment/:id","type":0,"val":"payment","end":""},{"old":"/payment/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payment.initiate']['types'],
  },
  'payment.pending': {
    methods: ["GET","HEAD"],
    pattern: '/payment/:id/pending',
    tokens: [{"old":"/payment/:id/pending","type":0,"val":"payment","end":""},{"old":"/payment/:id/pending","type":1,"val":"id","end":""},{"old":"/payment/:id/pending","type":0,"val":"pending","end":""}],
    types: placeholder as Registry['payment.pending']['types'],
  },
  'payment.success': {
    methods: ["GET","HEAD"],
    pattern: '/payment/:id/success',
    tokens: [{"old":"/payment/:id/success","type":0,"val":"payment","end":""},{"old":"/payment/:id/success","type":1,"val":"id","end":""},{"old":"/payment/:id/success","type":0,"val":"success","end":""}],
    types: placeholder as Registry['payment.success']['types'],
  },
  'payment.status': {
    methods: ["GET","HEAD"],
    pattern: '/api/payment/:id/status',
    tokens: [{"old":"/api/payment/:id/status","type":0,"val":"api","end":""},{"old":"/api/payment/:id/status","type":0,"val":"payment","end":""},{"old":"/api/payment/:id/status","type":1,"val":"id","end":""},{"old":"/api/payment/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['payment.status']['types'],
  },
  'auth.google.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/auth/google',
    tokens: [{"old":"/auth/google","type":0,"val":"auth","end":""},{"old":"/auth/google","type":0,"val":"google","end":""}],
    types: placeholder as Registry['auth.google.redirect']['types'],
  },
  'auth.google.callback': {
    methods: ["GET","HEAD"],
    pattern: '/auth/google/callback',
    tokens: [{"old":"/auth/google/callback","type":0,"val":"auth","end":""},{"old":"/auth/google/callback","type":0,"val":"google","end":""},{"old":"/auth/google/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['auth.google.callback']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'dashboard.settings': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/settings',
    tokens: [{"old":"/dashboard/settings","type":0,"val":"dashboard","end":""},{"old":"/dashboard/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['dashboard.settings']['types'],
  },
  'dashboard.events': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events',
    tokens: [{"old":"/dashboard/events","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['dashboard.events']['types'],
  },
  'dashboard.events.create': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events/create',
    tokens: [{"old":"/dashboard/events/create","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/create","type":0,"val":"events","end":""},{"old":"/dashboard/events/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['dashboard.events.create']['types'],
  },
  'dashboard.events.store': {
    methods: ["POST"],
    pattern: '/dashboard/events',
    tokens: [{"old":"/dashboard/events","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['dashboard.events.store']['types'],
  },
  'dashboard.events.edit': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events/:id/edit',
    tokens: [{"old":"/dashboard/events/:id/edit","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id/edit","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id/edit","type":1,"val":"id","end":""},{"old":"/dashboard/events/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['dashboard.events.edit']['types'],
  },
  'dashboard.events.update': {
    methods: ["PUT"],
    pattern: '/dashboard/events/:id',
    tokens: [{"old":"/dashboard/events/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.events.update']['types'],
  },
  'dashboard.events.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/events/:id',
    tokens: [{"old":"/dashboard/events/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.events.destroy']['types'],
  },
  'dashboard.events.publish': {
    methods: ["POST"],
    pattern: '/dashboard/events/:id/publish',
    tokens: [{"old":"/dashboard/events/:id/publish","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id/publish","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id/publish","type":1,"val":"id","end":""},{"old":"/dashboard/events/:id/publish","type":0,"val":"publish","end":""}],
    types: placeholder as Registry['dashboard.events.publish']['types'],
  },
  'dashboard.events.analytics': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events/:id/analytics',
    tokens: [{"old":"/dashboard/events/:id/analytics","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id/analytics","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id/analytics","type":1,"val":"id","end":""},{"old":"/dashboard/events/:id/analytics","type":0,"val":"analytics","end":""}],
    types: placeholder as Registry['dashboard.events.analytics']['types'],
  },
  'dashboard.events.ticketTypes.update': {
    methods: ["PATCH"],
    pattern: '/dashboard/events/:id/ticket-types/:ticketTypeId',
    tokens: [{"old":"/dashboard/events/:id/ticket-types/:ticketTypeId","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id/ticket-types/:ticketTypeId","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id/ticket-types/:ticketTypeId","type":1,"val":"id","end":""},{"old":"/dashboard/events/:id/ticket-types/:ticketTypeId","type":0,"val":"ticket-types","end":""},{"old":"/dashboard/events/:id/ticket-types/:ticketTypeId","type":1,"val":"ticketTypeId","end":""}],
    types: placeholder as Registry['dashboard.events.ticketTypes.update']['types'],
  },
  'dashboard.checkin': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/check-in/:id',
    tokens: [{"old":"/dashboard/check-in/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/check-in/:id","type":0,"val":"check-in","end":""},{"old":"/dashboard/check-in/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.checkin']['types'],
  },
  'dashboard.checkin.scan': {
    methods: ["POST"],
    pattern: '/dashboard/check-in/:id/scan',
    tokens: [{"old":"/dashboard/check-in/:id/scan","type":0,"val":"dashboard","end":""},{"old":"/dashboard/check-in/:id/scan","type":0,"val":"check-in","end":""},{"old":"/dashboard/check-in/:id/scan","type":1,"val":"id","end":""},{"old":"/dashboard/check-in/:id/scan","type":0,"val":"scan","end":""}],
    types: placeholder as Registry['dashboard.checkin.scan']['types'],
  },
  'dashboard.checkin.tickets': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/check-in/:id/tickets',
    tokens: [{"old":"/dashboard/check-in/:id/tickets","type":0,"val":"dashboard","end":""},{"old":"/dashboard/check-in/:id/tickets","type":0,"val":"check-in","end":""},{"old":"/dashboard/check-in/:id/tickets","type":1,"val":"id","end":""},{"old":"/dashboard/check-in/:id/tickets","type":0,"val":"tickets","end":""}],
    types: placeholder as Registry['dashboard.checkin.tickets']['types'],
  },
  'dashboard.payouts': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/payouts',
    tokens: [{"old":"/dashboard/payouts","type":0,"val":"dashboard","end":""},{"old":"/dashboard/payouts","type":0,"val":"payouts","end":""}],
    types: placeholder as Registry['dashboard.payouts']['types'],
  },
  'dashboard.payouts.request': {
    methods: ["POST"],
    pattern: '/dashboard/payouts',
    tokens: [{"old":"/dashboard/payouts","type":0,"val":"dashboard","end":""},{"old":"/dashboard/payouts","type":0,"val":"payouts","end":""}],
    types: placeholder as Registry['dashboard.payouts.request']['types'],
  },
  'dashboard.clients': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/clients',
    tokens: [{"old":"/dashboard/clients","type":0,"val":"dashboard","end":""},{"old":"/dashboard/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['dashboard.clients']['types'],
  },
  'dashboard.orders': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/orders',
    tokens: [{"old":"/dashboard/orders","type":0,"val":"dashboard","end":""},{"old":"/dashboard/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['dashboard.orders']['types'],
  },
  'dashboard.orders.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/orders/:id',
    tokens: [{"old":"/dashboard/orders/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/orders/:id","type":0,"val":"orders","end":""},{"old":"/dashboard/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.orders.show']['types'],
  },
  'dashboard.orders.pay': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/orders/:id/pay',
    tokens: [{"old":"/dashboard/orders/:id/pay","type":0,"val":"dashboard","end":""},{"old":"/dashboard/orders/:id/pay","type":0,"val":"orders","end":""},{"old":"/dashboard/orders/:id/pay","type":1,"val":"id","end":""},{"old":"/dashboard/orders/:id/pay","type":0,"val":"pay","end":""}],
    types: placeholder as Registry['dashboard.orders.pay']['types'],
  },
  'dashboard.pay': {
    methods: ["POST"],
    pattern: '/dashboard/orders/:id/pay',
    tokens: [{"old":"/dashboard/orders/:id/pay","type":0,"val":"dashboard","end":""},{"old":"/dashboard/orders/:id/pay","type":0,"val":"orders","end":""},{"old":"/dashboard/orders/:id/pay","type":1,"val":"id","end":""},{"old":"/dashboard/orders/:id/pay","type":0,"val":"pay","end":""}],
    types: placeholder as Registry['dashboard.pay']['types'],
  },
  'dashboard.tickets': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/tickets',
    tokens: [{"old":"/dashboard/tickets","type":0,"val":"dashboard","end":""},{"old":"/dashboard/tickets","type":0,"val":"tickets","end":""}],
    types: placeholder as Registry['dashboard.tickets']['types'],
  },
  'orders.store': {
    methods: ["POST"],
    pattern: '/orders',
    tokens: [{"old":"/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.store']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
  'admin.events.pending': {
    methods: ["GET","HEAD"],
    pattern: '/admin/events/pending',
    tokens: [{"old":"/admin/events/pending","type":0,"val":"admin","end":""},{"old":"/admin/events/pending","type":0,"val":"events","end":""},{"old":"/admin/events/pending","type":0,"val":"pending","end":""}],
    types: placeholder as Registry['admin.events.pending']['types'],
  },
  'admin.events.approve': {
    methods: ["POST"],
    pattern: '/admin/events/:id/approve',
    tokens: [{"old":"/admin/events/:id/approve","type":0,"val":"admin","end":""},{"old":"/admin/events/:id/approve","type":0,"val":"events","end":""},{"old":"/admin/events/:id/approve","type":1,"val":"id","end":""},{"old":"/admin/events/:id/approve","type":0,"val":"approve","end":""}],
    types: placeholder as Registry['admin.events.approve']['types'],
  },
  'admin.events.reject': {
    methods: ["POST"],
    pattern: '/admin/events/:id/reject',
    tokens: [{"old":"/admin/events/:id/reject","type":0,"val":"admin","end":""},{"old":"/admin/events/:id/reject","type":0,"val":"events","end":""},{"old":"/admin/events/:id/reject","type":1,"val":"id","end":""},{"old":"/admin/events/:id/reject","type":0,"val":"reject","end":""}],
    types: placeholder as Registry['admin.events.reject']['types'],
  },
  'admin.events.freeze': {
    methods: ["POST"],
    pattern: '/admin/events/:id/freeze',
    tokens: [{"old":"/admin/events/:id/freeze","type":0,"val":"admin","end":""},{"old":"/admin/events/:id/freeze","type":0,"val":"events","end":""},{"old":"/admin/events/:id/freeze","type":1,"val":"id","end":""},{"old":"/admin/events/:id/freeze","type":0,"val":"freeze","end":""}],
    types: placeholder as Registry['admin.events.freeze']['types'],
  },
  'admin.events.unfreeze': {
    methods: ["POST"],
    pattern: '/admin/events/:id/unfreeze',
    tokens: [{"old":"/admin/events/:id/unfreeze","type":0,"val":"admin","end":""},{"old":"/admin/events/:id/unfreeze","type":0,"val":"events","end":""},{"old":"/admin/events/:id/unfreeze","type":1,"val":"id","end":""},{"old":"/admin/events/:id/unfreeze","type":0,"val":"unfreeze","end":""}],
    types: placeholder as Registry['admin.events.unfreeze']['types'],
  },
  'admin.users': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users']['types'],
  },
  'admin.users.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.show']['types'],
  },
  'admin.users.edit': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users/:id/edit',
    tokens: [{"old":"/admin/users/:id/edit","type":0,"val":"admin","end":""},{"old":"/admin/users/:id/edit","type":0,"val":"users","end":""},{"old":"/admin/users/:id/edit","type":1,"val":"id","end":""},{"old":"/admin/users/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['admin.users.edit']['types'],
  },
  'admin.users.update': {
    methods: ["PUT"],
    pattern: '/admin/users/:id',
    tokens: [{"old":"/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/admin/users/:id","type":0,"val":"users","end":""},{"old":"/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.users.update']['types'],
  },
  'admin.users.role': {
    methods: ["PATCH"],
    pattern: '/admin/users/:id/role',
    tokens: [{"old":"/admin/users/:id/role","type":0,"val":"admin","end":""},{"old":"/admin/users/:id/role","type":0,"val":"users","end":""},{"old":"/admin/users/:id/role","type":1,"val":"id","end":""},{"old":"/admin/users/:id/role","type":0,"val":"role","end":""}],
    types: placeholder as Registry['admin.users.role']['types'],
  },
  'admin.fee.rules': {
    methods: ["GET","HEAD"],
    pattern: '/admin/fee-rules',
    tokens: [{"old":"/admin/fee-rules","type":0,"val":"admin","end":""},{"old":"/admin/fee-rules","type":0,"val":"fee-rules","end":""}],
    types: placeholder as Registry['admin.fee.rules']['types'],
  },
  'admin.fee.rules.store': {
    methods: ["POST"],
    pattern: '/admin/fee-rules',
    tokens: [{"old":"/admin/fee-rules","type":0,"val":"admin","end":""},{"old":"/admin/fee-rules","type":0,"val":"fee-rules","end":""}],
    types: placeholder as Registry['admin.fee.rules.store']['types'],
  },
  'admin.finances': {
    methods: ["GET","HEAD"],
    pattern: '/admin/finances',
    tokens: [{"old":"/admin/finances","type":0,"val":"admin","end":""},{"old":"/admin/finances","type":0,"val":"finances","end":""}],
    types: placeholder as Registry['admin.finances']['types'],
  },
  'admin.payouts.process': {
    methods: ["POST"],
    pattern: '/admin/payouts/:id/process',
    tokens: [{"old":"/admin/payouts/:id/process","type":0,"val":"admin","end":""},{"old":"/admin/payouts/:id/process","type":0,"val":"payouts","end":""},{"old":"/admin/payouts/:id/process","type":1,"val":"id","end":""},{"old":"/admin/payouts/:id/process","type":0,"val":"process","end":""}],
    types: placeholder as Registry['admin.payouts.process']['types'],
  },
  'admin.transactions': {
    methods: ["GET","HEAD"],
    pattern: '/admin/transactions',
    tokens: [{"old":"/admin/transactions","type":0,"val":"admin","end":""},{"old":"/admin/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['admin.transactions']['types'],
  },
  'admin.transactions.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/transactions/:id',
    tokens: [{"old":"/admin/transactions/:id","type":0,"val":"admin","end":""},{"old":"/admin/transactions/:id","type":0,"val":"transactions","end":""},{"old":"/admin/transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.transactions.show']['types'],
  },
  'admin.transactions.recheck': {
    methods: ["POST"],
    pattern: '/admin/transactions/:id/recheck',
    tokens: [{"old":"/admin/transactions/:id/recheck","type":0,"val":"admin","end":""},{"old":"/admin/transactions/:id/recheck","type":0,"val":"transactions","end":""},{"old":"/admin/transactions/:id/recheck","type":1,"val":"id","end":""},{"old":"/admin/transactions/:id/recheck","type":0,"val":"recheck","end":""}],
    types: placeholder as Registry['admin.transactions.recheck']['types'],
  },
  'admin.categories': {
    methods: ["GET","HEAD"],
    pattern: '/admin/categories',
    tokens: [{"old":"/admin/categories","type":0,"val":"admin","end":""},{"old":"/admin/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['admin.categories']['types'],
  },
  'admin.categories.store': {
    methods: ["POST"],
    pattern: '/admin/categories',
    tokens: [{"old":"/admin/categories","type":0,"val":"admin","end":""},{"old":"/admin/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['admin.categories.store']['types'],
  },
  'admin.categories.delete': {
    methods: ["DELETE"],
    pattern: '/admin/categories/:id',
    tokens: [{"old":"/admin/categories/:id","type":0,"val":"admin","end":""},{"old":"/admin/categories/:id","type":0,"val":"categories","end":""},{"old":"/admin/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.categories.delete']['types'],
  },
  'admin.homepage': {
    methods: ["GET","HEAD"],
    pattern: '/admin/homepage',
    tokens: [{"old":"/admin/homepage","type":0,"val":"admin","end":""},{"old":"/admin/homepage","type":0,"val":"homepage","end":""}],
    types: placeholder as Registry['admin.homepage']['types'],
  },
  'admin.homepage.toggle': {
    methods: ["POST"],
    pattern: '/admin/homepage/:id/toggle-featured',
    tokens: [{"old":"/admin/homepage/:id/toggle-featured","type":0,"val":"admin","end":""},{"old":"/admin/homepage/:id/toggle-featured","type":0,"val":"homepage","end":""},{"old":"/admin/homepage/:id/toggle-featured","type":1,"val":"id","end":""},{"old":"/admin/homepage/:id/toggle-featured","type":0,"val":"toggle-featured","end":""}],
    types: placeholder as Registry['admin.homepage.toggle']['types'],
  },
  'admin.whatsapp': {
    methods: ["GET","HEAD"],
    pattern: '/admin/whatsapp',
    tokens: [{"old":"/admin/whatsapp","type":0,"val":"admin","end":""},{"old":"/admin/whatsapp","type":0,"val":"whatsapp","end":""}],
    types: placeholder as Registry['admin.whatsapp']['types'],
  },
  'admin.whatsapp.store': {
    methods: ["POST"],
    pattern: '/admin/whatsapp',
    tokens: [{"old":"/admin/whatsapp","type":0,"val":"admin","end":""},{"old":"/admin/whatsapp","type":0,"val":"whatsapp","end":""}],
    types: placeholder as Registry['admin.whatsapp.store']['types'],
  },
  'admin.settings': {
    methods: ["GET","HEAD"],
    pattern: '/admin/settings',
    tokens: [{"old":"/admin/settings","type":0,"val":"admin","end":""},{"old":"/admin/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['admin.settings']['types'],
  },
  'admin.currencies': {
    methods: ["GET","HEAD"],
    pattern: '/admin/currencies',
    tokens: [{"old":"/admin/currencies","type":0,"val":"admin","end":""},{"old":"/admin/currencies","type":0,"val":"currencies","end":""}],
    types: placeholder as Registry['admin.currencies']['types'],
  },
  'admin.currencies.store': {
    methods: ["POST"],
    pattern: '/admin/currencies',
    tokens: [{"old":"/admin/currencies","type":0,"val":"admin","end":""},{"old":"/admin/currencies","type":0,"val":"currencies","end":""}],
    types: placeholder as Registry['admin.currencies.store']['types'],
  },
  'admin.currencies.update': {
    methods: ["PATCH"],
    pattern: '/admin/currencies/:id',
    tokens: [{"old":"/admin/currencies/:id","type":0,"val":"admin","end":""},{"old":"/admin/currencies/:id","type":0,"val":"currencies","end":""},{"old":"/admin/currencies/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.currencies.update']['types'],
  },
  'admin.currencies.update.post': {
    methods: ["POST"],
    pattern: '/admin/currencies/:id',
    tokens: [{"old":"/admin/currencies/:id","type":0,"val":"admin","end":""},{"old":"/admin/currencies/:id","type":0,"val":"currencies","end":""},{"old":"/admin/currencies/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.currencies.update.post']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
