import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.store': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.organizer.events.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'events.index': { paramsTuple?: []; params?: {} }
    'events.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.create': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.store': { paramsTuple?: []; params?: {} }
    'dashboard.organizer.events.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'dashboard.organizer.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'dashboard.organizer.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}