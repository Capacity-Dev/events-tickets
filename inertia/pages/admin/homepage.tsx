import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminHomepage({ events }: { events: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Homepage Curation</h1>
      <p className="text-sm text-muted-foreground mb-4">Toggle featured status to control which events appear on the homepage.</p>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event: any) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  <Badge variant={event.isFeatured ? 'default' : 'outline'}>
                    {event.isFeatured ? 'Featured' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {event.startDate ? new Date(event.startDate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <form action={`/admin/homepage/${event.id}/toggle-featured`} method="POST" className="inline">
                    <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-7 px-3 text-xs font-medium cursor-pointer">
                      {event.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
