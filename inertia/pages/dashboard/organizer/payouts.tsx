import { router } from '@inertiajs/react'
import { useState } from 'react'
import { useTranslation } from '~/lib/i18n'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

interface CurrencyData {
  id: string
  code: string
  name: string
  symbol: string
  countryCode: string
  networks: string[]
  exchangeRate: string
}

export default function OrganizerPayouts({
  payouts,
  currencies,
  events,
}: {
  payouts: any[]
  currencies: CurrencyData[]
  events: any[]
}) {
  const { t } = useTranslation()
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]?.code ?? 'USD')
  const activeCurrency = currencies.find((c) => c.code === selectedCurrency)
  const networks: string[] = activeCurrency?.networks ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    router.post('/dashboard/payouts', Object.fromEntries(data))
  }

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('organizer.payouts.title')}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('organizer.payouts.section_request')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <Label htmlFor="currency">{t('organizer.payouts.field_currency')}</Label>
              <select
                id="currency"
                name="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {currencies.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="amount">{t('organizer.payouts.field_amount')}</Label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0" required />
            </div>

            <div>
              <Label htmlFor="eventId">{t('organizer.payouts.field_event')}</Label>
              <select
                id="eventId"
                name="eventId"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{t('organizer.payouts.all_events')}</option>
                {events.map((ev: any) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>

            <Separator />

            <div>
              <Label htmlFor="beneficiary">{t('organizer.payouts.field_beneficiary')}</Label>
              <Input
                id="beneficiary"
                name="beneficiary"
                required
                placeholder={t('organizer.payouts.placeholder_full_name')}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">{t('organizer.payouts.field_phone')}</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                placeholder="+243XXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('organizer.payouts.phone_hint')}
              </p>
            </div>

            <div>
              <Label htmlFor="network">{t('organizer.payouts.field_network')}</Label>
              <select
                id="network"
                name="network"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{t('organizer.payouts.select_network')}</option>
                {networks.map((n: string) => (
                  <option key={n} value={n}>
                    {n.charAt(0).toUpperCase() + n.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('organizer.payouts.via_mobile_money')}</span>
            </div>

            <Button type="submit">{t('organizer.payouts.button_request')}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('organizer.payouts.table_amount')}</TableHead>
              <TableHead>{t('organizer.payouts.table_currency')}</TableHead>
              <TableHead>{t('organizer.payouts.table_status')}</TableHead>
              <TableHead>{t('organizer.payouts.table_beneficiary')}</TableHead>
              <TableHead>{t('organizer.payouts.table_network')}</TableHead>
              <TableHead>{t('organizer.payouts.table_requested')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {t('organizer.payouts.no_payouts')}
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.currency} {Number(p.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{p.currency ?? 'USD'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === 'completed'
                          ? 'default'
                          : p.status === 'processing'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {t('status.' + p.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{p.beneficiary ?? '-'}</TableCell>
                  <TableCell className="text-sm">{p.network ?? '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.requestedAt
                      ? new Date(p.requestedAt).toLocaleDateString()
                      : p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
