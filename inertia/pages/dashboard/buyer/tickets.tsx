export default function BuyerTickets({ tickets }: { tickets: any[] }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">My Tickets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-1">No tickets yet</p>
          <p className="text-sm">Purchase tickets to an event to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket: any) => (
            <div key={ticket.id} className="border rounded-xl p-5 bg-card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{ticket.event?.title ?? 'Unknown event'}</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.ticketType?.name ?? 'Unknown type'}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    ticket.status === 'valid'
                      ? 'bg-success/10 text-success'
                      : ticket.status === 'used'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">#{ticket.ticketNumber}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
