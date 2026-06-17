import Currency from '#models/currency'

export async function loadActiveCurrencies(): Promise<{ code: string; symbol: string }[]> {
  const currencies = await Currency.query()
    .where('isActive', true)
    .orderBy('sortOrder', 'asc')
    .select('code', 'symbol')
  return currencies.map((c) => ({ code: c.code, symbol: c.symbol }))
}

export function getCurrencySymbol(
  currencies: { code: string; symbol: string }[],
  code?: string | null
): string {
  return currencies.find((c) => c.code === (code || 'USD'))?.symbol ?? '$'
}
