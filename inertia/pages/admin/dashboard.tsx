import { usePage } from '@inertiajs/react'

interface Props {
  stats: { totalUsers: number; totalEvents: number; totalOrders: number; totalRevenue: number }
  recentUsers: any[]
  recentOrders: any[]
  eventsByStatus: { status: string; count: number }[]
}

export default function AdminDashboard({
  stats,
  recentUsers,
  recentOrders,
  eventsByStatus,
}: Props) {
  const { adminPrefix } = usePage().props as any

  const statusClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/10 text-success'
      case 'draft':
        return 'bg-muted text-muted-foreground'
      case 'rejected':
        return 'bg-destructive/10 text-destructive'
      case 'frozen':
        return 'bg-amber/10 text-amber'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-3xl font-heading mt-2">{stats.totalUsers}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Total Events</p>
          <p className="text-3xl font-heading mt-2">{stats.totalEvents}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-3xl font-heading mt-2">{stats.totalOrders}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-heading mt-2">
            ${Number(stats.totalRevenue).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <a href={`/${adminPrefix}/events/pending`} className="btn-primary btn-sm no-underline">
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
          Moderation
        </a>
        <a href={`/${adminPrefix}/transactions`} className="btn-outline btn-sm no-underline">
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
          </svg>
          Transactions
        </a>
        <a href={`/${adminPrefix}/users`} className="btn-outline btn-sm no-underline">
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Users
        </a>
        <a href={`/${adminPrefix}/finances`} className="btn-outline btn-sm no-underline">
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
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Finances
        </a>
      </div>

      {eventsByStatus.length > 0 && (
        <div className="border rounded-xl bg-card overflow-hidden mb-8">
          <div className="p-4 border-b bg-muted/50">
            <h2 className="font-semibold">Events by Status</h2>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {eventsByStatus.map((s) => (
              <span
                key={s.status}
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusClass(s.status)}`}
              >
                {s.status}: {s.count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentUsers.length > 0 && (
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">Recent Users</h2>
            </div>
            <div className="divide-y">
              {recentUsers.map((u: any) => (
                <a
                  key={u.id}
                  href={`/${adminPrefix}/users/${u.id}`}
                  className="p-4 flex items-center justify-between text-sm hover:bg-muted/50 transition-colors no-underline"
                >
                  <div>
                    <span className="font-medium text-foreground">{u.fullName}</span>
                    <span className="text-muted-foreground ml-2">{u.email}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      u.role === 'admin'
                        ? 'bg-destructive/10 text-destructive'
                        : u.role === 'organizer'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {u.role ?? 'buyer'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {recentOrders.length > 0 && (
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">Recent Orders</h2>
            </div>
            <div className="divide-y">
              {recentOrders.map((o: any) => (
                <a
                  key={o.id}
                  href={`/${adminPrefix}/transactions/${o.id}`}
                  className="p-4 flex items-center justify-between text-sm hover:bg-muted/50 transition-colors no-underline"
                >
                  <div>
                    <span className="font-mono font-medium text-foreground">{o.orderNumber}</span>
                    <span
                      className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                        o.status === 'paid'
                          ? 'bg-success/10 text-success'
                          : o.status === 'pending'
                            ? 'bg-amber/10 text-amber'
                            : o.status === 'failed'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-xs">
                      {o.buyer?.fullName ?? o.guestEmail ?? 'Guest'}
                    </span>
                    <span className="font-medium text-foreground">
                      ${Number(o.totalGrossAmount).toFixed(2)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {!recentUsers.length && !recentOrders.length && (
          <div className="lg:col-span-2 text-center py-16 text-muted-foreground border rounded-xl bg-card">
            <p className="text-lg font-medium mb-1">Welcome!</p>
            <p className="text-sm">Manage your platform from this dashboard.</p>
          </div>
        )}
      </div>
    </div>
  )
}
