import { router } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
import { Badge } from '~/components/ui/badge'
import { toast } from 'sonner'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'outline',
  published: 'default',
  rejected: 'destructive',
  cancelled: 'outline',
  completed: 'secondary',
}

interface EventSummary {
  id: string
  title: string
  slug: string
  status: string
  startDate: string | null
  visibility?: string
  privateSlug?: string | null
  privatePaymentStatus?: string | null
  ticketTypes?: { quantitySold: number; quantityTotal: number }[]
}

export default function OrganizerEvents({ events }: { events: EventSummary[] }) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading">{t('organizer.events.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <a
          href="/dashboard/events/create"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-3 text-sm font-medium no-underline"
        >
          {t('organizer.events.create_event')}
        </a>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border rounded-xl bg-card">
          <p className="text-lg font-medium mb-1">{t('organizer.events.empty_title')}</p>
          <p className="text-sm">{t('organizer.events.empty_description')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const totalSold =
              event.ticketTypes?.reduce((s, ticket) => s + (ticket.quantitySold ?? 0), 0) ?? 0
            const totalCapacity =
              event.ticketTypes?.reduce((s, ticket) => s + ticket.quantityTotal, 0) ?? 0
            const fillRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0

            return (
              <div key={event.id} className="border rounded-xl p-5 bg-card space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.startDate
                      ? new Date(event.startDate).toLocaleDateString()
                      : t('organizer.events.no_date')}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={statusVariant[event.status] ?? 'outline'}>
                    {t('status.' + event.status)}
                  </Badge>
                  {event.visibility === 'unlisted' && (
                    <Badge variant="outline">{t('organizer.events.badge_private')}</Badge>
                  )}
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {t('organizer.events.sold_count', {
                        sold: totalSold,
                        capacity: totalCapacity,
                      })}
                    </span>
                  )}
                </div>

                {totalCapacity > 0 && (
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(fillRate, 100)}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={event.id ? `/dashboard/events/${event.id}/analytics` : '#'}
                    onClick={!event.id ? (e) => e.preventDefault() : undefined}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    {t('organizer.events.view_details')} &rarr;
                  </a>

                  <div className="flex-1" />

                  {event.status === 'published' && (
                    <a
                      href={event.id ? `/dashboard/check-in/${event.id}` : '#'}
                      onClick={!event.id ? (e) => e.preventDefault() : undefined}
                      className="inline-flex items-center justify-center rounded-lg border border-success text-success bg-transparent hover:bg-success/10 h-7 px-2 text-xs font-medium no-underline"
                    >
                      {t('organizer.events.check_in')}
                    </a>
                  )}

                  <a
                    href={event.id ? `/dashboard/events/${event.id}/edit` : '#'}
                    onClick={!event.id ? (e) => e.preventDefault() : undefined}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-7 px-2 text-xs font-medium no-underline text-foreground"
                  >
                    {t('common.edit')}
                  </a>

                  {event.status === 'draft' && (
                    <button
                      type="button"
                      onClick={() =>
                        event.id && router.post(`/dashboard/events/${event.id}/publish`)
                      }
                      className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-7 px-2 text-xs font-medium border-none cursor-pointer"
                    >
                      {t('organizer.events.publish')}
                    </button>
                  )}

                  {event.visibility === 'unlisted' &&
                    event.privatePaymentStatus !== 'paid' &&
                    event.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() =>
                          event.id && router.post(`/dashboard/events/${event.id}/pay-private-fee`)
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-primary text-primary bg-transparent hover:bg-primary/10 h-7 px-2 text-xs font-medium cursor-pointer"
                      >
                        {t('organizer.events.pay_fee')}
                      </button>
                    )}

                  {event.privateSlug && event.status === 'published' && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/e/${event.privateSlug}`
                        )
                        toast.success(t('organizer.events.toast_private_link_copied'))
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-7 px-2 text-xs font-medium cursor-pointer"
                    >
                      {t('organizer.events.copy_link')}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
