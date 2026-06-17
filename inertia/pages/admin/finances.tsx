import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { formatCurrency, type CurrencyInfo } from '~/lib/currency'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  paid: 'default',
  pending: 'outline',
  failed: 'destructive',
  refunded: 'secondary',
}

export default function AdminFinances({
  orders,
  currencies,
}: {
  orders: any[]
  currencies: CurrencyInfo[]
}) {
  const totalRevenue = orders.reduce(
    (s: number, o: any) => s + (o.totalGrossAmount ? Number(o.totalGrossAmount) : 0),
    0
  )

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Financial Overview</h1>
      <div className="border rounded-xl p-5 bg-card mb-8 inline-block">
        <p className="text-sm text-muted-foreground">Total Revenue (last 100 orders)</p>
        <p className="text-3xl font-heading mt-1">
          {formatCurrency(totalRevenue, 'USD', currencies)}
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o: any) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-sm">{o.orderNumber}</TableCell>
                  <TableCell className="text-sm">{o.buyer?.email ?? '-'}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(o.totalGrossAmount, o.currency, currencies)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[o.status] ?? 'outline'}>{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">{o.paymentMethod ?? '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
