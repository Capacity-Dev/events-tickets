import { CurrencySchema } from '#database/schema'
import { beforeSave, afterFind, afterFetch } from '@adonisjs/lucid/orm'

export default class Currency extends CurrencySchema {
  static $selfAssignPrimaryKey = true

  @beforeSave()
  static serializeNetworks(currency: Currency) {
    if (Array.isArray(currency.networks)) {
      currency.networks = JSON.stringify(currency.networks) as any
    }
  }

  @afterFind()
  static deserializeNetworks(currency: Currency) {
    if (typeof currency.networks === 'string') {
      try {
        currency.networks = JSON.parse(currency.networks)
      } catch {}
    }
  }

  @afterFetch()
  static deserializeNetworksFetch(currencies: Currency[]) {
    for (const c of currencies) {
      if (typeof c.networks === 'string') {
        try {
          c.networks = JSON.parse(c.networks)
        } catch {}
      }
    }
  }
}
