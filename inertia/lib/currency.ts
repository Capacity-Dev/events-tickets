export type CurrencyInfo = { code: string; symbol: string }

export function formatCurrency(
  amount: number | string | null | undefined,
  currencyCode?: string | null,
  currencies?: CurrencyInfo[] | Record<string, string>
): string {
  const num = typeof amount === 'string' ? Number(amount) : (amount ?? 0)
  if (isNaN(num)) return '-'

  const code = currencyCode || 'USD'
  let symbol = '$'

  if (currencies) {
    if (Array.isArray(currencies)) {
      const found = currencies.find((c) => c.code === code)
      if (found) symbol = found.symbol
    } else {
      symbol = currencies[code] ?? symbol
    }
  }

  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${symbol}${formatted}`
}

export function currencySymbolLookup(currencies: CurrencyInfo[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const c of currencies) map[c.code] = c.symbol
  return map
}

export function getCurrencyInfo(currencies: CurrencyInfo[], code?: string | null): CurrencyInfo {
  const found = currencies.find((c) => c.code === (code || 'USD'))
  return found ?? { code: 'USD', symbol: '$' }
}
