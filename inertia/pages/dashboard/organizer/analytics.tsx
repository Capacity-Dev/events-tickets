import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
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
  const [editDialog, setEditDialog] = useState<TicketTypeData | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [editQty, setEditQty] = useState('')

  const openEdit = (t: TicketTypeData) => {
    setEditDialog(t)
    setEditPrice(t.basePrice)
    setEditQty(String(t.quantityTotal))
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
              Events
            </a>
            <span>/</span>
            <span className="text-foreground font-medium">{event.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading">{event.title}</h1>
            <Badge variant={statusVariant[event.status] ?? 'outline'}>{event.status}</Badge>
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
            Edit Event
          </a>
          {event.slug && (
            <a
              href={`/events/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-3 text-sm font-medium"
            >
              View Public Page
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.totalSold}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {stats.totalCapacity} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Fill Rate
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
              Revenue
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
              Unique Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.uniqueBuyers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Checked In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.checkedInCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {stats.ticketCount} tickets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Types</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.ticketTypes?.length > 0 ? (
                  event.ticketTypes.map((t: any) => {
                    const sold = t.quantitySold ?? 0
                    const rev = sold * Number(t.basePrice)
                    const fill =
                      t.quantityTotal > 0 ? Math.round((sold / t.quantityTotal) * 100) : 0
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">
                          {t.name}
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
                          {formatCurrency(t.basePrice, t.currency, currencies)}
                        </TableCell>
                        <TableCell className="text-right text-sm">{sold}</TableCell>
                        <TableCell className="text-right text-sm">{t.quantityTotal}</TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {formatCurrency(rev, t.currency, currencies)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="xs" onClick={() => openEdit(t)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No ticket types defined
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Timeline</CardTitle>
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
                      <span>{entry.count} tickets</span>
                      <span className="font-medium">
                        {formatCurrency(entry.revenue, undefined, currencies)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No sales data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
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
                      No orders yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buyers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name / Email</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
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
                      No buyers yet
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
            <DialogTitle>Edit Ticket Type — {editDialog?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="editPrice">Price</Label>
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
              <Label htmlFor="editQty">Total Capacity</Label>
              <Input
                id="editQty"
                type="number"
                min={editDialog?.quantitySold ?? 0}
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editDialog?.quantitySold ?? 0} already sold. Minimum:{' '}
                {editDialog?.quantitySold ?? 0}.
              </p>
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialog(null)}>
                Cancel
              </Button>
              <Button onClick={submitEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
