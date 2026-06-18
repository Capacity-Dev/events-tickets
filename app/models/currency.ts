import { CurrencySchema } from '#database/schema'
import { afterFind, afterFetch } from '@adonisjs/lucid/orm'

export default class Currency extends CurrencySchema {
  static $selfAssignPrimaryKey = true

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
