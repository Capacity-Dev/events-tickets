import fs from 'node:fs'
import app from '@adonisjs/core/services/app'

const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]

let cache: Record<string, Record<string, string>> = {}

function loadLocale(locale: Locale): Record<string, string> {
  const filePath = app.makePath('resources/lang', `${locale}.json`)
  if (!fs.existsSync(filePath)) return {}
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function t(key: string, params?: Record<string, string | number>, locale?: Locale): string {
  const l = locale ?? getDefaultLocale()
  if (!cache[l]) {
    cache[l] = loadLocale(l)
  }
  let value = cache[l]?.[key]
  if (!value) {
    const fallback = l === 'fr' ? undefined : loadLocale('fr')[key]
    value = fallback || key
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v))
    }
  }
  return value
}

export function setLocale(locale: Locale) {
  if (!cache[locale]) {
    cache[locale] = loadLocale(locale)
  }
}

export function getDefaultLocale(): Locale {
  return 'fr'
}

export function isValidLocale(l: string): l is Locale {
  return (locales as readonly string[]).includes(l)
}
