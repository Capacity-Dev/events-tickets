import { RoleSchema } from '#database/schema'

type RoleName = 'admin' | 'organizer' | 'buyer'

export default class Role extends RoleSchema {
  static $selfAssignPrimaryKey = true

  static async findByName(name: RoleName): Promise<Role | null> {
    return Role.findBy('name', name)
  }
}
