import { usePage } from '@inertiajs/react'
import { formatCurrency, type CurrencyInfo } from '~/lib/currency'

export default function DashboardIndex({
  stats,
  currencies,
}: {
  stats: any
  currencies: CurrencyInfo[]
}) {
  const { isAdmin, adminPrefix } = usePage().props as any

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your events, orders and tickets.
        </p>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <a
            href={`/${adminPrefix || 'admin'}`}
            className="btn-primary btn-sm no-underline inline-flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Go to Admin Dashboard
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Events</p>
          <p className="text-3xl font-heading mt-2">{stats.totalEvents ?? 0}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Tickets Sold</p>
          <p className="text-3xl font-heading mt-2">{stats.totalSold ?? 0}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-3xl font-heading mt-2">
            {formatCurrency(Math.round(stats.totalRevenue ?? 0), undefined, currencies)}
          </p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-3xl font-heading mt-2">{stats.totalOrders ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <a href="/dashboard/events/create" className="btn-primary btn-sm no-underline">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Create Event
        </a>
        <a href="/dashboard/tickets" className="btn-outline btn-sm no-underline">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
          </svg>
          My Tickets
        </a>
        <a href="/dashboard/orders" className="btn-outline btn-sm no-underline">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          My Orders
        </a>
        <a href="/dashboard/events" className="btn-ghost btn-sm no-underline">
          View All Events &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.recentEvents?.length > 0 && (
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">Recent Events</h2>
            </div>
            <div className="divide-y">
              {stats.recentEvents.map((event: any) => (
                <a
                  key={event.id || 'unknown'}
                  href={event.id ? `/dashboard/events/${event.id}/edit` : '#'}
                  className="p-4 flex items-center justify-between text-sm hover:bg-muted/50 transition-colors no-underline"
                  onClick={!event.id ? (e) => e.preventDefault() : undefined}
                >
                  <div>
                    <span className="font-medium text-foreground">{event.title}</span>
                    <span
                      className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                        event.status === 'published'
                          ? 'bg-success/10 text-success'
                          : event.status === 'draft'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : '—'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {stats.recentOrders?.length > 0 && (
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">Recent Orders</h2>
            </div>
            <div className="divide-y">
              {stats.recentOrders.map((order: any) => (
                <a
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="p-4 flex items-center justify-between text-sm hover:bg-muted/50 transition-colors no-underline"
                >
                  <div>
                    <span className="font-mono font-medium text-foreground">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'paid'
                          ? 'bg-success/10 text-success'
                          : order.status === 'pending'
                            ? 'bg-amber/10 text-amber'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-xs">{order.itemsCount} items</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(order.totalGrossAmount, order.currency, currencies)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {!stats.recentEvents?.length && !stats.recentOrders?.length && (
          <div className="lg:col-span-2 text-center py-16 text-muted-foreground border rounded-xl bg-card">
            <p className="text-lg font-medium mb-1">Welcome!</p>
            <p className="text-sm">Create your first event or browse events to buy tickets.</p>
          </div>
        )}
      </div>
    </div>
  )
}
