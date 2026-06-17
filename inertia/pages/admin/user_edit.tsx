import { usePage } from '@inertiajs/react'

interface Props {
  user: any
  roles: any[]
}

export default function AdminUserEdit({ user, roles }: Props) {
  const { adminPrefix } = usePage().props as any

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">Edit User</h1>
        <p className="text-sm text-muted-foreground mt-1">{user.fullName}</p>
      </div>

      <div className="max-w-lg border rounded-xl bg-card p-6">
        <form action={`/${adminPrefix}/users/${user.id}`} method="POST" className="space-y-4">
          <input type="hidden" name="_method" value="PUT" />

          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              defaultValue={user.fullName}
              className="input-field min-h-10 mt-1.5 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              className="input-field min-h-10 mt-1.5 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              name="roleId"
              defaultValue={user.roleId}
              className="input-field min-h-10 mt-1.5 w-full"
            >
              {roles.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium mb-2">Reset Password (optional)</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm">New Password</label>
                <input
                  type="password"
                  name="password"
                  className="input-field min-h-10 mt-1.5 w-full"
                />
              </div>
              <div>
                <label className="text-sm">Confirm Password</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  className="input-field min-h-10 mt-1.5 w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              Save Changes
            </button>
            <a
              href={`/${adminPrefix}/users/${user.id}`}
              className="btn-outline flex-1 text-center no-underline"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
