import { usePage } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'

interface Props {
  user: any
  roles: any[]
}

export default function AdminUserEdit({ user, roles }: Props) {
  const { t } = useTranslation()
  const { adminPrefix } = usePage().props as any

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">{t('admin.user_edit.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{user.fullName}</p>
      </div>

      <div className="max-w-lg border rounded-xl bg-card p-6">
        <form action={`/${adminPrefix}/users/${user.id}`} method="POST" className="space-y-4">
          <input type="hidden" name="_method" value="PUT" />

          <div>
            <label className="text-sm font-medium">{t('admin.user_edit.full_name')}</label>
            <input
              type="text"
              name="fullName"
              defaultValue={user.fullName}
              className="input-field min-h-10 mt-1.5 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('admin.user_edit.email')}</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              className="input-field min-h-10 mt-1.5 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('admin.user_edit.role')}</label>
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
            <p className="text-sm font-medium mb-2">
              {t('admin.user_edit.reset_password_optional')}
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-sm">{t('admin.user_edit.new_password')}</label>
                <input
                  type="password"
                  name="password"
                  className="input-field min-h-10 mt-1.5 w-full"
                />
              </div>
              <div>
                <label className="text-sm">{t('admin.user_edit.confirm_password')}</label>
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
              {t('common.save_changes')}
            </button>
            <a
              href={`/${adminPrefix}/users/${user.id}`}
              className="btn-outline flex-1 text-center no-underline"
            >
              {t('common.cancel')}
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
