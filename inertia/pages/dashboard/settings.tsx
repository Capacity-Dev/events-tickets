import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Field } from '~/components/ui/field'
import { FieldGroup } from '~/components/ui/field-group'
import { Separator } from '~/components/ui/separator'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export default function Settings() {
  const { props } = usePage() as any
  const user = props.user

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-heading">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <FieldGroup>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground">Name</span>
              <span className="text-sm">{user?.fullName || '\u2014'}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-sm">{user?.email || '\u2014'}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground">Member since</span>
              <span className="text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '\u2014'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/dashboard/settings/password" method="POST">
              <FieldGroup className="max-w-sm">
                <Field>
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    autoComplete="current-password"
                  />
                </Field>
                <Field>
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                  />
                </Field>
                <Field>
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit">Change password</Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-input accent-primary"
                />
                Email notifications for ticket purchases
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
                Email notifications for event updates
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
                WhatsApp notifications
              </label>
            </Field>
          </CardContent>
        </Card>
      </FieldGroup>
    </div>
  )
}
