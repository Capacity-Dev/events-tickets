import { usePage } from '@inertiajs/react'
import { formatCurrency } from '~/lib/currency'

interface Props {
  order: any
}

export default function AdminTransactionShow({ order }: Props) {
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

  const buyerName = order.buyer?.fullName ?? 'Guest'
  const buyerEmail = order.buyer?.email ?? order.guestEmail ?? '—'
  const buyerPhone = order.guestPhone ?? '—'

  return (
    <div>
      <div className="mb-6">
        <a
          href={`/${adminPrefix}/transactions`}
          className="text-sm text-muted-foreground no-underline hover:text-foreground"
        >
          &larr; Back to Transactions
        </a>
        <h1 className="text-2xl font-heading mt-2">Order {order.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">Order Details</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-muted-foreground">Order #</span>
                <span className="font-mono font-medium">{order.orderNumber}</span>

                <span className="text-muted-foreground">Status</span>
                <span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass(order.status)}`}>
                    {order.status}
                  </span>
                </span>

                <span className="text-muted-foreground">Created</span>
                <span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}</span>

                <span className="text-muted-foreground">Paid at</span>
                <span>{order.paidAt ? new Date(order.paidAt).toLocaleString() : '—'}</span>

                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">
                  {formatCurrency(order.totalGrossAmount, order.currency)}
                </span>

                {Number(order.platformFeeAmount) > 0 && (
                  <>
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span>{formatCurrency(order.platformFeeAmount, order.currency)}</span>
                  </>
                )}

                {Number(order.organizerNetAmount) > 0 && (
                  <>
                    <span className="text-muted-foreground">Organizer Net</span>
                    <span>{formatCurrency(order.organizerNetAmount, order.currency)}</span>
                  </>
                )}

                {order.cancellationReason && (
                  <>
                    <span className="text-muted-foreground">Cancel Reason</span>
                    <span className="text-destructive">{order.cancellationReason}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="font-semibold">Items ({order.items.length})</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ticket Type
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Qty
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Price
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3 text-sm">{item.ticketType?.name ?? 'Unknown'}</td>
                      <td className="p-3 text-sm">{item.quantity}</td>
                      <td className="p-3 text-sm">
                        {formatCurrency(item.unitPrice, order.currency)}
                      </td>
                      <td className="p-3 text-sm font-medium">
                        {formatCurrency(item.lineTotal, order.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {order.items && order.items.some((i: any) => i.tickets?.length > 0) && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="font-semibold">Tickets</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ticket #
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Type
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Checked in
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.flatMap((item: any) =>
                    (item.tickets || []).map((ticket: any) => (
                      <tr key={ticket.id} className="border-b">
                        <td className="p-3">
                          <a
                            href={`/tickets/${ticket.uuid}`}
                            className="font-mono text-sm text-primary no-underline hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {ticket.ticketNumber}
                          </a>
                        </td>
                        <td className="p-3 text-sm">{item.ticketType?.name ?? '—'}</td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              ticket.status === 'valid'
                                ? 'bg-success/10 text-success'
                                : ticket.status === 'used'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">Buyer</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm break-all">{buyerEmail}</p>
              </div>
              {buyerPhone && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{buyerPhone}</p>
                </div>
              )}
              {order.buyer?.id && (
                <div>
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <a
                    href={`/${adminPrefix}/users/${order.buyer.id}`}
                    className="text-sm text-primary no-underline hover:underline"
                  >
                    #{order.buyer.id}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">Payment</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Method</p>
                <p className="text-sm">{order.paymentMethod ?? 'Pending'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="text-sm">{order.currency}</p>
              </div>
              {order.paymentIntentId && (
                <div>
                  <p className="text-xs text-muted-foreground">Mbiyopay Transaction</p>
                  <p className="text-sm font-mono text-xs break-all">{order.paymentIntentId}</p>
                </div>
              )}
              {order.mbiyopayAuthMode && (
                <div>
                  <p className="text-xs text-muted-foreground">Auth Mode</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {order.mbiyopayAuthMode}
                  </span>
                </div>
              )}
              {order.paymentProcessorFee && Number(order.paymentProcessorFee) > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Processor Fee</p>
                  <p className="text-sm">
                    {formatCurrency(order.paymentProcessorFee, order.currency)}
                  </p>
                </div>
              )}
              {order.ipAddress && (
                <div>
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <p className="text-sm font-mono text-xs">{order.ipAddress}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-xl bg-card space-y-3">
            <h2 className="font-semibold text-sm">Actions</h2>
            {order.paymentIntentId && (
              <form action={`/${adminPrefix}/transactions/${order.id}/recheck`} method="POST">
                <button
                  type="submit"
                  className="btn-outline btn-sm w-full inline-flex items-center gap-2 justify-center"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Recheck Mbiyopay Status
                </button>
              </form>
            )}
            <button
              type="button"
              className="btn-outline btn-sm w-full text-muted-foreground"
              disabled
            >
              Process Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
