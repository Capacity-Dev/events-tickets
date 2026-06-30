import { usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { useTranslation } from '~/lib/i18n'

export default function CheckoutPage() {
  const { props } = usePage()
  const { t } = useTranslation()
  const user = (props as any).user

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-2xl font-heading mb-2">{t('checkout.title')}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {user ? `${t('checkout.signed_in_as')} ${user.email}` : t('checkout.guest_prompt')}
      </p>

      <form action="/checkout" method="POST" className="space-y-5">
        {!user && (
          <>
            <div>
              <Label htmlFor="fullName">{t('checkout.full_name_label')}</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="email">{t('checkout.email_label')}</Label>
              <Input id="email" name="email" type="email" required />
              <p className="text-xs text-muted-foreground mt-1">
                {t('checkout.tickets_email_hint')}
              </p>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <Button type="submit" className="w-full">
            {t('checkout.complete_purchase')}
          </Button>
        </div>
      </form>
    </div>
  )
}
