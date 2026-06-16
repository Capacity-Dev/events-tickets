import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import User from '#models/user'
import Profile from '#models/profile'

export default class extends BaseSeeder {
  async run() {
    const roles = await Role.createMany([
      { id: crypto.randomUUID(), name: 'admin' },
      { id: crypto.randomUUID(), name: 'organizer' },
      { id: crypto.randomUUID(), name: 'buyer' },
    ])

    const organizerRole = roles.find((r) => r.name === 'organizer')!

    const organizer = await User.create({
      email: 'organizer@demo.com',
      password: 'password123',
      fullName: 'Sarah Kamala',
      roleId: organizerRole.id,
    })

    await Profile.create({
      id: crypto.randomUUID(),
      userId: organizer.id,
      firstName: 'Sarah',
      lastName: 'Kamala',
      phoneNumber: '+243800000001',
      locale: 'fr_FR',
    })
  }
}
