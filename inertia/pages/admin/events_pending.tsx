import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminPendingEvents({ events }: { events: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Pending Events</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No pending events</TableCell></TableRow>
            ) : events.map((event: any) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell className="text-sm">{event.organizer?.fullName ?? event.organizer?.email ?? '-'}</TableCell>
                <TableCell><Badge variant="outline">{event.category?.name ?? 'Uncategorized'}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{event.createdAt ? new Date(event.createdAt).toLocaleDateString() : '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <form action={`/admin/events/${event.id}/approve`} method="POST" className="inline">
                      <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-success text-success-foreground h-7 px-3 text-xs font-medium border-none cursor-pointer hover:brightness-90">Approve</button>
                    </form>
                    <form action={`/admin/events/${event.id}/reject`} method="POST" className="inline">
                      <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-destructive text-destructive h-7 px-3 text-xs font-medium bg-transparent cursor-pointer hover:bg-destructive/10">Reject</button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
