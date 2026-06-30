import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Field } from '~/components/ui/field'
import { FieldGroup } from '~/components/ui/field-group'
import { Separator } from '~/components/ui/separator'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { useTranslation } from '~/lib/i18n'

export default function Settings() {
  const { props } = usePage() as any
  const { t } = useTranslation()
  const user = props.user

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-heading">{t('settings.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('settings.subtitle')}</p>
      </div>

      <FieldGroup>
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.profile')}</CardTitle>
            <CardDescription>{t('settings.profile_description')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {t('settings.name')}
              </span>
              <span className="text-sm">{user?.fullName || '\u2014'}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground">{t('common.email')}</span>
              <span className="text-sm">{user?.email || '\u2014'}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {t('settings.member_since')}
              </span>
              <span className="text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '\u2014'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.password')}</CardTitle>
            <CardDescription>{t('settings.password_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/dashboard/settings/password" method="POST">
              <FieldGroup className="max-w-sm">
                <Field>
                  <Label htmlFor="currentPassword">{t('settings.current_password')}</Label>
                  <Input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    autoComplete="current-password"
                  />
                </Field>
                <Field>
                  <Label htmlFor="newPassword">{t('settings.new_password')}</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    autoComplete="new-password"
                    placeholder={t('auth.password_placeholder')}
                  />
                </Field>
                <Field>
                  <Label htmlFor="confirmPassword">{t('settings.confirm_new_password')}</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit">{t('settings.change_password')}</Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.notifications')}</CardTitle>
            <CardDescription>{t('settings.notifications_description')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-input accent-primary"
                />
                {t('settings.notif_ticket_purchases')}
              </label>
            </Field>
            <Separator />
            <Field>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-input accent-primary"
                />
                {t('settings.notif_event_updates')}
              </label>
            </Field>
            <Separator />
            <Field>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-input accent-primary"
                />
                {t('settings.notif_whatsapp')}
              </label>
            </Field>
          </CardContent>
        </Card>
      </FieldGroup>
    </div>
  )
}
