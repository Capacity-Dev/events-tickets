import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { t as translateRaw } from '#services/i18n_service'

export default class LocaleMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const supported = ['fr', 'en']

    const sessionLocale = ctx.session?.get('locale')
    const query = ctx.request.input('locale')
    const locale = (query || sessionLocale || 'fr') as string

    const resolved = supported.includes(locale) ? locale : 'fr'

    if (ctx.session) {
      ctx.session.put('locale', resolved)
    }

    const t = (key: string, params?: Record<string, string | number>) => {
      return translateRaw(key, params, resolved as 'fr' | 'en')
    }

    if ('view' in ctx) {
      ctx.view.share({ locale: resolved, t })
    }

    await next()
  }
}
