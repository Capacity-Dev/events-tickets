import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { useTranslation } from '~/lib/i18n'

export default function PayPage({
  order,
  currency,
  networks,
  countryCode,
  pinRequired,
  transactionId,
  instructions,
}: any) {
  const { t } = useTranslation()

  return (
    <div className="max-w-lg mx-auto">
      <a
        href={`/dashboard/orders/${order.id}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        {t('buyer.pay.back_to_order')}
      </a>

      <h1 className="text-2xl font-heading mt-2 mb-1">{t('buyer.pay.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {t('buyer.pay.order_label', { number: order.orderNumber })} &middot;{' '}
        {currency?.symbol ?? '$'}
        {order.totalGrossAmount}
      </p>

      {pinRequired && (
        <div className="border rounded-xl p-5 bg-card mb-6 space-y-3">
          <h2 className="text-lg font-semibold">{t('buyer.pay.pin_required')}</h2>
          {instructions && (
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: instructions }}
            />
          )}
          <form action="/orders/finalize" method="POST" className="space-y-4">
            <input type="hidden" name="transactionId" value={transactionId} />
            <input type="hidden" name="orderId" value={order.id} />
            <div>
              <Label htmlFor="pin">{t('buyer.pay.field_pin')}</Label>
              <Input id="pin" name="pin" type="text" inputMode="numeric" required />
            </div>
            <Button type="submit">{t('buyer.pay.confirm_payment')}</Button>
          </form>
        </div>
      )}

      {!pinRequired && (
        <div className="border rounded-xl p-5 bg-card">
          <h2 className="text-lg font-semibold mb-4">{t('buyer.pay.mobile_money_payment')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('buyer.pay.pay_button', {
              symbol: currency?.symbol ?? '$',
              amount: String(order.totalGrossAmount),
            })}{' '}
            ({currency?.name ?? 'Mobile Money'}, {countryCode})
            {networks?.length
              ? ` — ${networks.map((n: string) => n.charAt(0).toUpperCase() + n.slice(1)).join(', ')}`
              : ''}
          </p>

          <form action={`/dashboard/orders/${order.id}/pay`} method="POST" className="space-y-4">
            <div>
              <Label htmlFor="phone">{t('buyer.pay.field_phone')}</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+243XXXXXXXXX" required />
              <p className="text-xs text-muted-foreground mt-1">
                {t('buyer.pay.phone_hint', { code: countryCode })}
              </p>
            </div>

            <div>
              <Label htmlFor="network">{t('buyer.pay.field_network')}</Label>
              <select
                id="network"
                name="network"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{t('buyer.pay.select_network')}</option>
                {(networks || []).map((n: string) => (
                  <option key={n} value={n}>
                    {n.charAt(0).toUpperCase() + n.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              {t('buyer.pay.pay_button', {
                symbol: currency?.symbol ?? '$',
                amount: String(order.totalGrossAmount),
              })}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
