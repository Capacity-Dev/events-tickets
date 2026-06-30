import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { toast } from 'sonner'
import { formatCurrency, type CurrencyInfo } from '~/lib/currency'
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
  published: 'default',
  rejected: 'destructive',
  cancelled: 'outline',
  completed: 'secondary',
}

interface TicketTypeData {
  id: string
  name: string
  basePrice: string
  currency: string | null
  quantityTotal: number
  quantitySold: number
}

interface BuyerData {
  id: string
  name: string
  email: string | null
  totalSpent: number
  ticketCount: number
}

interface OrderData {
  id: string
  orderNumber: string
  status: string
  totalGrossAmount: string
  currency: string | null
  ticketCount: number
  createdAt: string | null
  buyerName: string
  buyerEmail: string | null
}

interface TimelineEntry {
  date: string
  count: number
  revenue: number
}

interface Stats {
  totalSold: number
  totalCapacity: number
  fillRate: number
  totalRevenue: number
  ticketCount: number
  checkedInCount: number
  uniqueBuyers: number
  recentOrders: OrderData[]
  buyers: BuyerData[]
  salesTimeline: TimelineEntry[]
}

export default function OrganizerAnalytics({
  event,
  stats,
  currencies,
}: {
  event: any
  stats: Stats
  currencies: CurrencyInfo[]
}) {
  const { t } = useTranslation()
  const [editDialog, setEditDialog] = useState<TicketTypeData | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [editQty, setEditQty] = useState('')

  const openEdit = (ticket: TicketTypeData) => {
    setEditDialog(ticket)
    setEditPrice(ticket.basePrice)
    setEditQty(String(ticket.quantityTotal))
  }

  const submitEdit = () => {
    if (!editDialog) return
    router.patch(`/dashboard/events/${event.id}/ticket-types/${editDialog.id}`, {
      basePrice: editPrice,
      quantityTotal: Number(editQty),
    })
    setEditDialog(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <a href="/dashboard/events" className="hover:text-foreground">
              {t('organizer.analytics.breadcrumb_events')}
            </a>
            <span>/</span>
            <span className="text-foreground font-medium">{event.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading">{event.title}</h1>
            <Badge variant={statusVariant[event.status] ?? 'outline'}>
              {t('status.' + event.status)}
            </Badge>
          </div>
          {event.venueName && (
            <p className="text-sm text-muted-foreground mt-1">
              {event.venueName}
              {event.venueAddress ? ` — ${event.venueAddress}` : ''}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={event.id ? `/dashboard/events/${event.id}/edit` : '#'}
            onClick={!event.id ? (e) => e.preventDefault() : undefined}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-9 px-3 text-sm font-medium"
          >
            {t('organizer.analytics.edit_event')}
          </a>
          {event.status === 'published' && (
            <a
              href={event.id ? `/dashboard/check-in/${event.id}` : '#'}
              onClick={!event.id ? (e) => e.preventDefault() : undefined}
              className="inline-flex items-center justify-center rounded-lg border border-success text-success bg-transparent hover:bg-success/10 h-9 px-3 text-sm font-medium no-underline"
            >
              {t('organizer.analytics.check_in')}
            </a>
          )}
          {event.slug && (
            <>
              <a
                href={`/events/${event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-3 text-sm font-medium"
              >
                {t('organizer.analytics.view_public_page')}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/events/${event.slug}`)
                  toast.success(t('organizer.analytics.toast_link_copied'))
                }}
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
                  className="mr-1.5"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {t('common.copy_link')}
              </Button>
              <a
                href={`/dashboard/events/${event.id}/boost`}
                className="inline-flex items-center justify-center rounded-lg border border-amber-500 text-amber-600 dark:text-amber-400 bg-transparent hover:bg-amber-500/10 h-9 px-3 text-sm font-medium no-underline"
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
                  className="mr-1.5"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {t('organizer.analytics.boost')}
              </a>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.analytics.stat_tickets_sold')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.totalSold}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('organizer.analytics.stat_of_total', { total: stats.totalCapacity })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.analytics.stat_fill_rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.fillRate}%</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(stats.fillRate, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.analytics.stat_revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">
              {formatCurrency(stats.totalRevenue, undefined, currencies)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.analytics.stat_unique_buyers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.uniqueBuyers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.analytics.stat_checked_in')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.checkedInCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('organizer.analytics.stat_of_tickets', { count: stats.ticketCount })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('organizer.analytics.section_ticket_types')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('organizer.analytics.table_type')}</TableHead>
                  <TableHead>{t('organizer.analytics.table_price')}</TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_sold')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_capacity')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_revenue')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.ticketTypes?.length > 0 ? (
                  event.ticketTypes.map((tt: any) => {
                    const sold = tt.quantitySold ?? 0
                    const rev = sold * Number(tt.basePrice)
                    const fill =
                      tt.quantityTotal > 0 ? Math.round((sold / tt.quantityTotal) * 100) : 0
                    return (
                      <TableRow key={tt.id}>
                        <TableCell className="font-medium">
                          {tt.name}
                          <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 flex-1 min-w-12 rounded-full bg-muted">
                              <div
                                className="h-1.5 rounded-full bg-primary"
                                style={{ width: `${Math.min(fill, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{fill}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(tt.basePrice, tt.currency, currencies)}
                        </TableCell>
                        <TableCell className="text-right text-sm">{sold}</TableCell>
                        <TableCell className="text-right text-sm">{tt.quantityTotal}</TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {formatCurrency(rev, tt.currency, currencies)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="xs" onClick={() => openEdit(tt)}>
                            {t('common.edit')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {t('organizer.analytics.no_ticket_types')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('organizer.analytics.section_sales_timeline')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.salesTimeline.length > 0 ? (
              <div className="space-y-3">
                {stats.salesTimeline.map((entry) => (
                  <div key={entry.date} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex items-center gap-4">
                      <span>
                        {t('organizer.analytics.timeline_tickets', { count: entry.count })}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(entry.revenue, undefined, currencies)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                {t('organizer.analytics.no_sales_data')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('organizer.analytics.section_recent_orders')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('organizer.analytics.table_order')}</TableHead>
                  <TableHead>{t('organizer.analytics.table_buyer')}</TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_tickets')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_amount')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_date')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.orderNumber}</TableCell>
                      <TableCell className="text-sm">
                        <span className="font-medium">{order.buyerName}</span>
                        {order.buyerEmail && (
                          <span className="block text-xs text-muted-foreground">
                            {order.buyerEmail}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm">{order.ticketCount}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatCurrency(order.totalGrossAmount, order.currency, currencies)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {t('organizer.analytics.no_orders')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('organizer.analytics.section_buyers')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('organizer.analytics.table_name_email')}</TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_tickets')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('organizer.analytics.table_total_spent')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.buyers.length > 0 ? (
                  stats.buyers.map((buyer) => (
                    <TableRow key={buyer.id}>
                      <TableCell className="text-sm">
                        <span className="font-medium">{buyer.name}</span>
                        {buyer.email && buyer.name !== buyer.email && (
                          <span className="block text-xs text-muted-foreground">{buyer.email}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm">{buyer.ticketCount}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatCurrency(buyer.totalSpent, undefined, currencies)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      {t('organizer.analytics.no_buyers')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {t('organizer.analytics.edit_ticket_type_title', { name: editDialog?.name ?? '' })}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="editPrice">{t('organizer.analytics.field_price')}</Label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                min="0"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editQty">{t('organizer.analytics.field_total_capacity')}</Label>
              <Input
                id="editQty"
                type="number"
                min={editDialog?.quantitySold ?? 0}
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('organizer.analytics.already_sold_min', {
                  sold: editDialog?.quantitySold ?? 0,
                  min: editDialog?.quantitySold ?? 0,
                })}
              </p>
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialog(null)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={submitEdit}>{t('common.save_changes')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
