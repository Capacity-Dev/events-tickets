import Currency from '#models/currency'

export async function loadActiveCurrencies(): Promise<{ code: string; symbol: string; exchangeRate: string }[]> {
  const currencies = await Currency.query()
    .where('isActive', true)
    .orderBy('sortOrder', 'asc')
    .select('code', 'symbol', 'exchangeRate')
  return currencies.map((c) => ({ code: c.code, symbol: c.symbol, exchangeRate: c.exchangeRate ?? '1' }))
}

export function getCurrencySymbol(
  currencies: { code: string; symbol: string }[],
  code?: string | null
): string {
  return currencies.find((c) => c.code === (code || 'USD'))?.symbol ?? '$'
}
