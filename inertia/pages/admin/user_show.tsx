import { usePage } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'

interface Props {
  user: any
  events: any[]
  orders: any[]
  payouts: any[]
}

export default function AdminUserShow({ user, events, orders, payouts }: Props) {
  const { t } = useTranslation()
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

  const orderStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success'
      case 'pending':
        return 'bg-amber/10 text-amber'
      case 'failed':
        return 'bg-destructive/10 text-destructive'
      case 'reserved':
        return 'bg-primary/10 text-primary'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-heading">{user.fullName}</h1>
        <a
          href={`/${adminPrefix}/users/${user.id}/edit`}
          className="btn-primary btn-sm no-underline"
        >
          {t('admin.user_show.edit_user')}
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <h2 className="font-semibold">{t('admin.user_show.profile')}</h2>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">{t('admin.user_show.name')}</p>
              <p className="text-sm font-medium">{user.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('admin.user_show.email')}</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('admin.user_show.role')}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                  user.role?.name === 'admin'
                    ? 'bg-destructive/10 text-destructive'
                    : user.role?.name === 'organizer'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {t('role.' + (user.role?.name ?? 'buyer'))}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('admin.user_show.joined')}</p>
              <p className="text-sm">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {events.length > 0 && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="font-semibold">
                  {t('admin.user_show.events_count')} ({events.length})
                </h2>
              </div>
              <div className="divide-y">
                {events.map((e: any) => (
                  <div key={e.id} className="p-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-foreground">{e.title}</span>
                      <span
                        className={`ml-3 text-xs px-2 py-0.5 rounded-full ${statusClass(e.status)}`}
                      >
                        {t('status.' + e.status)}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {e.startDate ? new Date(e.startDate).toLocaleDateString() : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {orders.length > 0 && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="font-semibold">
                  {t('admin.user_show.orders_count')} ({orders.length})
                </h2>
              </div>
              <div className="divide-y">
                {orders.map((o: any) => (
                  <a
                    key={o.id}
                    href={`/${adminPrefix}/transactions/${o.id}`}
                    className="p-4 flex items-center justify-between text-sm hover:bg-muted/50 transition-colors no-underline"
                  >
                    <div>
                      <span className="font-mono font-medium text-foreground">{o.orderNumber}</span>
                      <span
                        className={`ml-3 text-xs px-2 py-0.5 rounded-full ${orderStatusClass(o.status)}`}
                      >
                        {t('status.' + o.status)}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      ${Number(o.totalGrossAmount).toFixed(2)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {payouts.length > 0 && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="font-semibold">
                  {t('admin.user_show.payouts_count')} ({payouts.length})
                </h2>
              </div>
              <div className="divide-y">
                {payouts.map((p: any) => (
                  <div key={p.id} className="p-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-mono font-medium text-foreground">
                        {p.payoutReference ?? p.id.slice(0, 8)}
                      </span>
                      <span
                        className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                          p.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : p.status === 'processing'
                              ? 'bg-amber/10 text-amber'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {t('status.' + p.status)}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      ${Number(p.amount).toFixed(2)} {p.currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
