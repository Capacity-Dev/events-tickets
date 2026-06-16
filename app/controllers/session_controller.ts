import User from '#models/user'
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    if (user.roleId) {
      const role = await Role.find(user.roleId)
      if (role?.name === 'organizer') {
        response.redirect().toRoute('dashboard.organizer.events')
        return
      }
    }

    response.redirect().toRoute('home')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
