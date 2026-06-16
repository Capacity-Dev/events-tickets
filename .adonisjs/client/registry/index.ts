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
  'cart.show': {
    methods: ["GET","HEAD"],
    pattern: '/cart',
    tokens: [{"old":"/cart","type":0,"val":"cart","end":""}],
    types: placeholder as Registry['cart.show']['types'],
  },
  'cart.add': {
    methods: ["POST"],
    pattern: '/cart/add',
    tokens: [{"old":"/cart/add","type":0,"val":"cart","end":""},{"old":"/cart/add","type":0,"val":"add","end":""}],
    types: placeholder as Registry['cart.add']['types'],
  },
  'checkout': {
    methods: ["GET","HEAD"],
    pattern: '/checkout',
    tokens: [{"old":"/checkout","type":0,"val":"checkout","end":""}],
    types: placeholder as Registry['checkout']['types'],
  },
  'checkout.store': {
    methods: ["POST"],
    pattern: '/checkout',
    tokens: [{"old":"/checkout","type":0,"val":"checkout","end":""}],
    types: placeholder as Registry['checkout.store']['types'],
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
  'dashboard.buyer.orders': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/buyer/orders',
    tokens: [{"old":"/dashboard/buyer/orders","type":0,"val":"dashboard","end":""},{"old":"/dashboard/buyer/orders","type":0,"val":"buyer","end":""},{"old":"/dashboard/buyer/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['dashboard.buyer.orders']['types'],
  },
  'dashboard.buyer.orders.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/buyer/orders/:id',
    tokens: [{"old":"/dashboard/buyer/orders/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/buyer/orders/:id","type":0,"val":"buyer","end":""},{"old":"/dashboard/buyer/orders/:id","type":0,"val":"orders","end":""},{"old":"/dashboard/buyer/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.buyer.orders.show']['types'],
  },
  'dashboard.buyer.tickets': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/buyer/tickets',
    tokens: [{"old":"/dashboard/buyer/tickets","type":0,"val":"dashboard","end":""},{"old":"/dashboard/buyer/tickets","type":0,"val":"buyer","end":""},{"old":"/dashboard/buyer/tickets","type":0,"val":"tickets","end":""}],
    types: placeholder as Registry['dashboard.buyer.tickets']['types'],
  },
  'dashboard.buyer.orders.pay': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/buyer/orders/:id/pay',
    tokens: [{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"dashboard","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"buyer","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"orders","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":1,"val":"id","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"pay","end":""}],
    types: placeholder as Registry['dashboard.buyer.orders.pay']['types'],
  },
  'orders.pay': {
    methods: ["POST"],
    pattern: '/dashboard/buyer/orders/:id/pay',
    tokens: [{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"dashboard","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"buyer","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"orders","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":1,"val":"id","end":""},{"old":"/dashboard/buyer/orders/:id/pay","type":0,"val":"pay","end":""}],
    types: placeholder as Registry['orders.pay']['types'],
  },
  'orders.store': {
    methods: ["POST"],
    pattern: '/orders',
    tokens: [{"old":"/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.store']['types'],
  },
  'dashboard.organizer.events': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/organizer/events',
    tokens: [{"old":"/dashboard/organizer/events","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['dashboard.organizer.events']['types'],
  },
  'dashboard.organizer.events.create': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/organizer/events/create',
    tokens: [{"old":"/dashboard/organizer/events/create","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events/create","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events/create","type":0,"val":"events","end":""},{"old":"/dashboard/organizer/events/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['dashboard.organizer.events.create']['types'],
  },
  'dashboard.organizer.events.store': {
    methods: ["POST"],
    pattern: '/dashboard/organizer/events',
    tokens: [{"old":"/dashboard/organizer/events","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['dashboard.organizer.events.store']['types'],
  },
  'dashboard.organizer.events.edit': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/organizer/events/:id/edit',
    tokens: [{"old":"/dashboard/organizer/events/:id/edit","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events/:id/edit","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events/:id/edit","type":0,"val":"events","end":""},{"old":"/dashboard/organizer/events/:id/edit","type":1,"val":"id","end":""},{"old":"/dashboard/organizer/events/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['dashboard.organizer.events.edit']['types'],
  },
  'dashboard.organizer.events.update': {
    methods: ["PUT"],
    pattern: '/dashboard/organizer/events/:id',
    tokens: [{"old":"/dashboard/organizer/events/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events/:id","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events/:id","type":0,"val":"events","end":""},{"old":"/dashboard/organizer/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.organizer.events.update']['types'],
  },
  'dashboard.organizer.events.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/organizer/events/:id',
    tokens: [{"old":"/dashboard/organizer/events/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events/:id","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events/:id","type":0,"val":"events","end":""},{"old":"/dashboard/organizer/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.organizer.events.destroy']['types'],
  },
  'dashboard.organizer.events.publish': {
    methods: ["POST"],
    pattern: '/dashboard/organizer/events/:id/publish',
    tokens: [{"old":"/dashboard/organizer/events/:id/publish","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events/:id/publish","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events/:id/publish","type":0,"val":"events","end":""},{"old":"/dashboard/organizer/events/:id/publish","type":1,"val":"id","end":""},{"old":"/dashboard/organizer/events/:id/publish","type":0,"val":"publish","end":""}],
    types: placeholder as Registry['dashboard.organizer.events.publish']['types'],
  },
  'dashboard.organizer.analytics': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/organizer/events/:id/analytics',
    tokens: [{"old":"/dashboard/organizer/events/:id/analytics","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/events/:id/analytics","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/events/:id/analytics","type":0,"val":"events","end":""},{"old":"/dashboard/organizer/events/:id/analytics","type":1,"val":"id","end":""},{"old":"/dashboard/organizer/events/:id/analytics","type":0,"val":"analytics","end":""}],
    types: placeholder as Registry['dashboard.organizer.analytics']['types'],
  },
  'dashboard.organizer.checkin': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/organizer/check-in/:id',
    tokens: [{"old":"/dashboard/organizer/check-in/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/check-in/:id","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/check-in/:id","type":0,"val":"check-in","end":""},{"old":"/dashboard/organizer/check-in/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.organizer.checkin']['types'],
  },
  'dashboard.organizer.payouts': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/organizer/payouts',
    tokens: [{"old":"/dashboard/organizer/payouts","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/payouts","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/payouts","type":0,"val":"payouts","end":""}],
    types: placeholder as Registry['dashboard.organizer.payouts']['types'],
  },
  'dashboard.organizer.payouts.request': {
    methods: ["POST"],
    pattern: '/dashboard/organizer/payouts',
    tokens: [{"old":"/dashboard/organizer/payouts","type":0,"val":"dashboard","end":""},{"old":"/dashboard/organizer/payouts","type":0,"val":"organizer","end":""},{"old":"/dashboard/organizer/payouts","type":0,"val":"payouts","end":""}],
    types: placeholder as Registry['dashboard.organizer.payouts.request']['types'],
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
  'admin.users': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users']['types'],
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
