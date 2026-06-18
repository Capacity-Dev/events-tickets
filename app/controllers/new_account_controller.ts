import User from '#models/user'
import Role from '#models/role'
import Profile from '#models/profile'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    const buyerRole = await Role.findBy('name', 'buyer')

    let user = await User.findBy('email', payload.email)

    if (user && (user as any).isShadow) {
      user.password = payload.password
      user.fullName = payload.fullName
      ;(user as any).isShadow = false
      await user.save()

      const existingProfile = await user.related('profile').query().first()
      if (existingProfile) {
        existingProfile.firstName = payload.fullName?.split(' ')[0] ?? existingProfile.firstName
        existingProfile.lastName =
          payload.fullName?.split(' ').slice(1).join(' ') || existingProfile.lastName || ''
        await existingProfile.save()
      }
    } else {
      user = await User.create({
        ...payload,
        roleId: buyerRole?.id ?? null,
      })

      await Profile.create({
        id: crypto.randomUUID(),
        userId: user.id,
        firstName: payload.fullName?.split(' ')[0] ?? '',
        lastName: payload.fullName?.split(' ').slice(1).join(' ') ?? '',
      })
    }

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}
