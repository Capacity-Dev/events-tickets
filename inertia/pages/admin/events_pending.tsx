import { usePage } from '@inertiajs/react'

export default function AdminPendingEvents({ events }: { events: any[] }) {
  const { adminPrefix } = usePage().props as any

  const statusClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/10 text-success'
      case 'draft':
        return 'bg-muted text-muted-foreground'
      case 'rejected':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Event Moderation</h1>

      <div className="border rounded-xl bg-card overflow-hidden">
        {events.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No events yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Title
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Organizer
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Frozen
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Created
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => (
                <tr key={event.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium text-sm">{event.title}</td>
                  <td className="p-3 text-sm">
                    {event.organizer?.fullName ?? event.organizer?.email ?? '—'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${statusClass(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {event.isFrozen ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber/10 text-amber">
                        Frozen
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5 flex-wrap">
                      {event.status !== 'published' && event.status !== 'rejected' && (
                        <form
                          action={`/${adminPrefix}/events/${event.id}/approve`}
                          method="POST"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-success text-success-foreground h-7 px-2.5 text-xs font-medium border-none cursor-pointer hover:brightness-90"
                          >
                            Publish
                          </button>
                        </form>
                      )}
                      {event.status === 'published' && (
                        <form
                          action={`/${adminPrefix}/events/${event.id}/reject`}
                          method="POST"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg border border-destructive text-destructive h-7 px-2.5 text-xs font-medium bg-transparent cursor-pointer hover:bg-destructive/10"
                          >
                            Reject
                          </button>
                        </form>
                      )}
                      {event.isFrozen ? (
                        <form
                          action={`/${adminPrefix}/events/${event.id}/unfreeze`}
                          method="POST"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg border border-success text-success h-7 px-2.5 text-xs font-medium bg-transparent cursor-pointer hover:bg-success/10"
                          >
                            Unfreeze
                          </button>
                        </form>
                      ) : (
                        <form
                          action={`/${adminPrefix}/events/${event.id}/freeze`}
                          method="POST"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg border border-amber text-amber h-7 px-2.5 text-xs font-medium bg-transparent cursor-pointer hover:bg-amber/10"
                          >
                            Freeze
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
