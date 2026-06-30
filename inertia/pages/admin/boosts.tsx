import { useState } from 'react'
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
        toast.success('Private event fee updated')
      } else {
        toast.error('Failed to save')
      }
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Boosts &amp; Private Events</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Private Event Fee</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Organizers must pay this fee before publishing a private (unlisted) event.
          </p>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <Label htmlFor="privateFee">Price</Label>
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
              <Label htmlFor="privateCurrency">Currency</Label>
              <Input
                id="privateCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase().slice(0, 3))}
                maxLength={3}
                className="w-24"
              />
            </div>
            <Button size="sm" onClick={handleSaveFee} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="mb-8" />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Markup</TableHead>
              <TableHead>Meta Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Impr.</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {boosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No boosts
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
                    <Badge variant={boostStatusVariant[b.status] || 'outline'}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{b.metaImpressions.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{b.metaClicks.toLocaleString()}</TableCell>
                  <TableCell>
                    {(b.status === 'active' || b.status === 'paused') && (
                      <form
                        action={`/admin/boosts/${b.id}/cancel`}
                        method="POST"
                        onSubmit={(e) => {
                          if (!confirm('Cancel this boost?')) e.preventDefault()
                        }}
                      >
                        <input type="hidden" name="_method" value="POST" />
                        <Button type="submit" variant="destructive" size="sm">
                          Cancel
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
