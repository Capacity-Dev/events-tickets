import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function Boosts({ boosts }: { boosts: any[] }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-heading mb-2">My Boosts</h1>
      <p className="text-muted-foreground mb-8">Promoted events</p>

      {boosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-1">No boosts yet</p>
            <p className="text-sm">Go to an event analytics page to boost it.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boosts.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <a
                      href={`/dashboard/boosts/${b.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {b.event?.title ?? b.headline ?? 'Boost'}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        b.status === 'active'
                          ? 'default'
                          : b.status === 'failed'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">${b.budget}</TableCell>
                  <TableCell className="text-sm">${b.metaSpent}</TableCell>
                  <TableCell className="text-sm">{b.metaImpressions.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{b.metaClicks.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{Number(b.metaCtr).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
