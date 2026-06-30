import { useState } from 'react'
import { useTranslation } from '~/lib/i18n'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { boostStatusVariant } from '~/lib/boost_status'
import { toast } from 'sonner'

export default function AdminBoosts({
  boosts,
  privateEventFee = '0',
  privateEventCurrency = 'USD',
}: {
  boosts: any[]
  privateEventFee?: string
  privateEventCurrency?: string
}) {
  const { t } = useTranslation()
  const [fee, setFee] = useState(privateEventFee)
  const [currency, setCurrency] = useState(privateEventCurrency)
  const [saving, setSaving] = useState(false)

  const handleSaveFee = async () => {
    setSaving(true)
    try {
      const res = await fetch('/admin/settings/private-event-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fee, currency }),
      })
      if (res.ok) {
        toast.success(t('admin.boosts.fee_updated'))
      } else {
        toast.error(t('common.save_failed'))
      }
    } catch {
      toast.error(t('common.save_failed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('admin.boosts.title')}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('admin.boosts.private_event_fee')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t('admin.boosts.private_event_fee_desc')}
          </p>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <Label htmlFor="privateFee">{t('admin.boosts.price')}</Label>
              <Input
                id="privateFee"
                type="number"
                min="0"
                step="0.01"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-32"
              />
            </div>
            <div>
              <Label htmlFor="privateCurrency">{t('admin.boosts.currency')}</Label>
              <Input
                id="privateCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase().slice(0, 3))}
                maxLength={3}
                className="w-24"
              />
            </div>
            <Button size="sm" onClick={handleSaveFee} disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="mb-8" />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.boosts.event')}</TableHead>
              <TableHead>{t('admin.boosts.organizer')}</TableHead>
              <TableHead>{t('admin.boosts.budget')}</TableHead>
              <TableHead>{t('admin.boosts.markup')}</TableHead>
              <TableHead>{t('admin.boosts.meta_spent')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead>{t('admin.boosts.impressions')}</TableHead>
              <TableHead>{t('admin.boosts.clicks')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {boosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {t('admin.boosts.no_boosts')}
                </TableCell>
              </TableRow>
            ) : (
              boosts.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium text-sm">
                    {b.event?.title ?? b.headline}
                  </TableCell>
                  <TableCell className="text-sm">
                    {b.organizer?.fullName ?? b.organizer?.email}
                  </TableCell>
                  <TableCell className="text-sm">${b.budget}</TableCell>
                  <TableCell className="text-sm">${Number(b.markupAmount).toFixed(2)}</TableCell>
                  <TableCell className="text-sm">${Number(b.metaSpent).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={boostStatusVariant[b.status] || 'outline'}>
                      {t('status.' + b.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{b.metaImpressions.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{b.metaClicks.toLocaleString()}</TableCell>
                  <TableCell>
                    {(b.status === 'active' || b.status === 'paused') && (
                      <form
                        action={`/admin/boosts/${b.id}/cancel`}
                        method="POST"
                        onSubmit={(e) => {
                          if (!confirm(t('admin.boosts.cancel_confirm'))) e.preventDefault()
                        }}
                      >
                        <input type="hidden" name="_method" value="POST" />
                        <Button type="submit" variant="destructive" size="sm">
                          {t('common.cancel')}
                        </Button>
                      </form>
                    )}
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
