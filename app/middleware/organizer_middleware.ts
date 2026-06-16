import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OrganizerMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user || !user.roleId) {
      return response.redirect().toRoute('home')
    }

    const { default: Role } = await import('#models/role')
    const role = await Role.find(user.roleId)

    if (!role || role.name !== 'organizer') {
      return response.redirect().toRoute('home')
    }

    return next()
  }
}
