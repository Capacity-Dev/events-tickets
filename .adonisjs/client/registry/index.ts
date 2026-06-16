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
  'events.show': {
    methods: ["GET","HEAD"],
    pattern: '/events/:slug',
    tokens: [{"old":"/events/:slug","type":0,"val":"events","end":""},{"old":"/events/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['events.show']['types'],
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
