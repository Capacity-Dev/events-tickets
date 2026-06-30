import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { formatCurrency, type CurrencyInfo } from '~/lib/currency'
import { useTranslation } from '~/lib/i18n'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  reserved: 'secondary',
  paid: 'default',
  failed: 'destructive',
  refunded: 'outline',
  cancelled: 'outline',
  expired: 'outline',
}

export default function BuyerOrders({
  orders,
  currencies,
}: {
  orders: any[]
  currencies: CurrencyInfo[]
}) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">{t('buyer.orders.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('buyer.orders.table_order')}</TableHead>
              <TableHead>{t('buyer.orders.table_status')}</TableHead>
              <TableHead>{t('buyer.orders.table_items')}</TableHead>
              <TableHead>{t('buyer.orders.table_total')}</TableHead>
              <TableHead>{t('buyer.orders.table_date')}</TableHead>
              <TableHead className="text-right">{t('buyer.orders.table_actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  {t('buyer.orders.empty_state')}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status] ?? 'outline'}>
                      {t('status.' + order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatCurrency(order.totalGrossAmount, order.currency, currencies)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`/dashboard/orders/${order.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-7 px-2 text-xs font-medium"
                    >
                      {t('buyer.orders.view')}
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
