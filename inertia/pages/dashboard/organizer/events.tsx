import { router } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {
  Pencil,
  QrCode,
  Link as LinkIcon,
  MoreHorizontal,
  Rocket,
  Banknote,
  BarChart3,
} from 'lucide-react'

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading">{t('organizer.events.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <a
          href="/dashboard/events/create"
          className={cn(buttonVariants({ size: 'sm' }), 'w-full sm:w-auto no-underline')}
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
              <Card key={event.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground leading-tight">{event.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString()
                        : t('organizer.events.no_date')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Badge variant={statusVariant[event.status] ?? 'outline'}>
                      {t('status.' + event.status)}
                    </Badge>
                    {event.visibility === 'unlisted' && (
                      <Badge variant="outline">{t('organizer.events.badge_private')}</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col gap-3">
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {t('organizer.events.sold_count', {
                            sold: totalSold,
                            capacity: totalCapacity,
                          })}
                        </span>
                        <span>{fillRate}%</span>
                      </div>
                      {totalCapacity > 0 && (
                        <div className="h-1.5 w-full rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(fillRate, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {/* Primary: Analytics / Details */}
                    <a
                      href={event.id ? `/dashboard/events/${event.id}/analytics` : '#'}
                      onClick={!event.id ? (e) => e.preventDefault() : undefined}
                      className={cn(
                        buttonVariants({ size: 'sm', variant: 'default' }),
                        'shrink-0 no-underline'
                      )}
                    >
                      <BarChart3 className="size-3.5" />
                      <span className="hidden sm:inline">{t('organizer.events.view_details')}</span>
                      <span className="sm:hidden">{t('common.view')}</span>
                    </a>

                    {/* Check-in */}
                    {event.status === 'published' && (
                      <a
                        href={event.id ? `/dashboard/check-in/${event.id}` : '#'}
                        onClick={!event.id ? (e) => e.preventDefault() : undefined}
                        className={cn(
                          buttonVariants({ size: 'sm', variant: 'outline' }),
                          'shrink-0 border-success text-success hover:bg-success/10 no-underline'
                        )}
                      >
                        <QrCode className="size-3.5" />
                        <span className="hidden sm:inline">{t('organizer.events.check_in')}</span>
                      </a>
                    )}

                    {/* Desktop secondary actions */}
                    <div className="hidden sm:flex flex-wrap gap-2">
                      <a
                        href={event.id ? `/dashboard/events/${event.id}/edit` : '#'}
                        onClick={!event.id ? (e) => e.preventDefault() : undefined}
                        className={cn(
                          buttonVariants({ size: 'sm', variant: 'outline' }),
                          'shrink-0 no-underline'
                        )}
                      >
                        <Pencil className="size-3.5" />
                        {t('common.edit')}
                      </a>

                      {event.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            event.id && router.post(`/dashboard/events/${event.id}/publish`)
                          }
                        >
                          <Rocket className="size-3.5" />
                          {t('organizer.events.publish')}
                        </Button>
                      )}

                      {event.visibility === 'unlisted' &&
                        event.privatePaymentStatus !== 'paid' &&
                        event.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              event.id &&
                              router.post(`/dashboard/events/${event.id}/pay-private-fee`)
                            }
                          >
                            <Banknote className="size-3.5" />
                            {t('organizer.events.pay_fee')}
                          </Button>
                        )}

                      {event.privateSlug && event.status === 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/e/${event.privateSlug}`
                            )
                            toast.success(t('organizer.events.toast_private_link_copied'))
                          }}
                        >
                          <LinkIcon className="size-3.5" />
                          {t('organizer.events.copy_link')}
                        </Button>
                      )}
                    </div>

                    {/* Mobile overflow dropdown */}
                    <div className="sm:hidden ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="size-3.5" />
                            {t('common.actions')}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              if (event.id) {
                                window.location.href = `/dashboard/events/${event.id}/edit`
                              }
                            }}
                          >
                            <Pencil className="size-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>

                          {event.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() =>
                                event.id && router.post(`/dashboard/events/${event.id}/publish`)
                              }
                            >
                              <Rocket className="size-4" />
                              {t('organizer.events.publish')}
                            </DropdownMenuItem>
                          )}

                          {event.visibility === 'unlisted' &&
                            event.privatePaymentStatus !== 'paid' &&
                            event.status === 'draft' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  event.id &&
                                  router.post(`/dashboard/events/${event.id}/pay-private-fee`)
                                }
                              >
                                <Banknote className="size-4" />
                                {t('organizer.events.pay_fee')}
                              </DropdownMenuItem>
                            )}

                          {event.privateSlug && event.status === 'published' && (
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/e/${event.privateSlug}`
                                )
                                toast.success(t('organizer.events.toast_private_link_copied'))
                              }}
                            >
                              <LinkIcon className="size-4" />
                              {t('organizer.events.copy_link')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
