import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'outline',
  pending_approval: 'secondary',
  published: 'default',
  rejected: 'destructive',
  cancelled: 'outline',
  completed: 'secondary',
}

interface TicketTypeSummary {
  quantitySold: number
}

interface EventSummary {
  id: string
  title: string
  slug: string
  status: string
  startDate: string | null
  ticketTypes?: TicketTypeSummary[]
}

export default function OrganizerEvents({ events }: { events: EventSummary[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading">My Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <a
          href="/dashboard/organizer/events/create"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-2.5 text-sm font-medium"
        >
          Create Event
        </a>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tickets sold</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  No events yet. Create your first event to get started.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[event.status] ?? 'outline'}>
                      {event.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {event.ticketTypes?.reduce((sum, t) => sum + (t.quantitySold ?? 0), 0) ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/dashboard/organizer/events/${event.id}/edit`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-7 px-2 text-xs font-medium"
                      >
                        Edit
                      </a>
                      {event.status === 'draft' && (
                        <form
                          action={`/dashboard/organizer/events/${event.id}/publish`}
                          method="POST"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-7 px-2 text-xs font-medium border-none cursor-pointer"
                          >
                            Publish
                          </button>
                        </form>
                      )}
                    </div>
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
