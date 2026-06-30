import { usePage } from '@inertiajs/react'
import fr from '../../resources/lang/fr.json'
import en from '../../resources/lang/en.json'

const dicts: Record<string, Record<string, string>> = { fr, en }

export function useTranslation() {
  const { locale } = usePage().props as any
  const l: string = locale === 'en' ? 'en' : 'fr'

  function t(key: string, params?: Record<string, string | number>): string {
    const dict = dicts[l]
    let value = dict[key] ?? dicts['fr'][key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v))
      }
    }
    return value
  }

  return { t, locale: l }
}
