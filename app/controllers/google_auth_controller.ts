import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import Profile from '#models/profile'

export default class GoogleAuthController {
  async redirect({ ally }: HttpContext) {
    await ally.use('google').redirect()
  }

  async callback({ ally, auth, response, session }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      session.flash('error', 'Google authentication was cancelled.')
      return response.redirect().toRoute('session.create')
    }

    try {
      const googleUser = await google.user()

      if (!googleUser.email) {
        session.flash('error', 'Google account has no email. Please try another method.')
        return response.redirect().toRoute('session.create')
      }

      let user = await User.findBy('email', googleUser.email)

      if (!user) {
        const buyerRole = await Role.findBy('name', 'buyer')
        user = await User.create({
          email: googleUser.email,
          fullName: googleUser.name || googleUser.email,
          googleId: googleUser.id,
          roleId: buyerRole?.id ?? null,
        })

        await Profile.create({
          id: crypto.randomUUID(),
          userId: user.id,
          firstName: googleUser.name?.split(' ')[0] || '',
          lastName: googleUser.name?.split(' ').slice(1).join(' ') || '',
          avatarUrl: googleUser.avatarUrl || null,
        })

        session.flash('success', 'Account created! Welcome.')
      } else if (!user.googleId) {
        user.googleId = googleUser.id
        await user.save()
      }

      await auth.use('web').login(user)
      response.redirect().toRoute('home')
    } catch {
      session.flash('error', 'Google authentication failed.')
      response.redirect().toRoute('session.create')
    }
  }
}
