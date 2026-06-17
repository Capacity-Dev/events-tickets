import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Currency from '#models/currency'

export default class extends BaseSeeder {
  async run() {
    const existing = await Currency.query().count('* as total')
    if (Number(existing[0].$extras.total) > 0) return

    await Currency.createMany([
      {
        id: crypto.randomUUID(),
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        countryCode: 'US',
        networks: [],
        exchangeRate: '1',
        isActive: true,
        sortOrder: 1,
      },
      {
        id: crypto.randomUUID(),
        code: 'CDF',
        name: 'Congolese Franc',
        symbol: 'FC',
        countryCode: 'CD',
        networks: ['vodacom', 'airtel', 'orange', 'africell'],
        exchangeRate: '2850',
        isActive: true,
        sortOrder: 2,
      },
    ])
  }
}
