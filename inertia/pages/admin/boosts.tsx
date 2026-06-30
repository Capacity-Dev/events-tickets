import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { boostStatusVariant } from '~/lib/boost_status'

export default function AdminBoosts({ boosts }: { boosts: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Boosts</h1>
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
