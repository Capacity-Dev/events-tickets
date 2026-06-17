import { usePage } from '@inertiajs/react'
import { formatCurrency } from '~/lib/currency'

interface Props {
  orders: any[]
  pagination: { total: number; perPage: number; currentPage: number; lastPage: number }
  currentStatus: string
  search: string
  dateFrom: string
  dateTo: string
}

export default function AdminTransactions({
  orders,
  pagination,
  currentStatus,
  search,
  dateFrom,
  dateTo,
}: Props) {
  const { adminPrefix } = usePage().props as any

  const statusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success'
      case 'pending':
        return 'bg-amber/10 text-amber'
      case 'failed':
        return 'bg-destructive/10 text-destructive'
      case 'reserved':
        return 'bg-primary/10 text-primary'
      case 'refunded':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const statuses = ['', 'pending', 'paid', 'reserved', 'failed', 'refunded']

  const buildUrl = (overrides: Record<string, string>) => {
    const params = new URLSearchParams()
    if (overrides.page) params.set('page', overrides.page)
    else if (pagination.currentPage > 1) {
      params.set('page', String(pagination.currentPage))
    }
    const s = overrides.status !== undefined ? overrides.status : currentStatus
    if (s) params.set('status', s)
    const q = overrides.q !== undefined ? overrides.q : search
    if (q) params.set('q', q)
    const df = overrides.dateFrom !== undefined ? overrides.dateFrom : dateFrom
    if (df) params.set('dateFrom', df)
    const dt = overrides.dateTo !== undefined ? overrides.dateTo : dateTo
    if (dt) params.set('dateTo', dt)
    const qs = params.toString()
    return `/${adminPrefix}/transactions${qs ? '?' + qs : ''}`
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">{pagination.total} orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form action={`/${adminPrefix}/transactions`} method="GET" className="flex flex-wrap gap-3 flex-1">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search order #, email, phone..."
            className="input-field min-h-10 w-full sm:w-64 text-sm"
          />
          {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
          <input
            type="date"
            name="dateFrom"
            defaultValue={dateFrom}
            className="input-field min-h-10 w-auto text-sm"
            title="From date"
          />
          <input
            type="date"
            name="dateTo"
            defaultValue={dateTo}
            className="input-field min-h-10 w-auto text-sm"
            title="To date"
          />
          <button type="submit" className="btn-primary btn-sm">
            Search
          </button>
          {(search || dateFrom || dateTo) && (
            <a href={buildUrl({ q: '', dateFrom: '', dateTo: '' })} className="btn-outline btn-sm no-underline">
              Clear
            </a>
          )}
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {statuses.map((s) => (
          <a
            key={s}
            href={buildUrl({ status: s, page: '1' })}
            className={`text-xs font-medium px-3 py-1.5 rounded-full no-underline transition-colors ${
              currentStatus === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s || 'All'}
          </a>
        ))}
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No transactions found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order #
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Buyer
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Method
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <a
                      href={`/${adminPrefix}/transactions/${o.id}`}
                      className="font-mono text-sm text-primary no-underline hover:underline"
                    >
                      {o.orderNumber}
                    </a>
                  </td>
                  <td className="p-3 text-sm">
                    <div>{o.buyer?.fullName ?? 'Guest'}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.buyer?.email ?? o.guestEmail ?? o.guestPhone ?? ''}
                    </div>
                  </td>
                  <td className="p-3 text-sm font-medium">
                    {formatCurrency(o.totalGrossAmount, o.currency)}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{o.paymentMethod ?? '—'}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.lastPage > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {pagination.currentPage > 1 && (
            <a href={buildUrl({ page: String(pagination.currentPage - 1) })} className="btn-outline btn-sm no-underline">
              Previous
            </a>
          )}
          <span className="text-sm text-muted-foreground self-center">
            Page {pagination.currentPage} of {pagination.lastPage}
          </span>
          {pagination.currentPage < pagination.lastPage && (
            <a href={buildUrl({ page: String(pagination.currentPage + 1) })} className="btn-outline btn-sm no-underline">
              Next
            </a>
          )}
        </div>
      )}
    </div>
  )
}
