import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserTransformer from '#transformers/user_transformer'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import adminConfig from '#config/admin'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  async share(ctx: HttpContext) {
    const { session, auth } = ctx as Partial<HttpContext>

    const error = session?.flashMessages.get('error') as string
    const success = session?.flashMessages.get('success') as string

    let isAdmin = false
    if (auth?.user) {
      try {
        const { default: Role } = await import('#models/role')
        const role = await Role.find(auth.user.roleId)
        isAdmin = role?.name === 'admin'
      } catch {}
    }

    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      flash: ctx.inertia.always({
        error,
        success,
      }),
      user: ctx.inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
      adminPrefix: ctx.inertia.always(adminConfig.prefix),
      isAdmin: ctx.inertia.always(isAdmin),
      locale: ctx.inertia.always(session?.get('locale', 'fr')),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)

    const output = await next()
    this.dispose(ctx)

    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
