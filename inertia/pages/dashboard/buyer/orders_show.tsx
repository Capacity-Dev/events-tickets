import { formatCurrency, type CurrencyInfo } from '~/lib/currency'

export default function BuyerOrderShow({
  order,
  currencies,
}: {
  order: any
  currencies: CurrencyInfo[]
}) {
  return (
    <div className="max-w-2xl">
      <a href="/dashboard/orders" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to orders
      </a>
      <h1 className="text-2xl font-heading mt-2 mb-1">Order {order.orderNumber}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {order.status} &middot;{' '}
        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
      </p>

      <div className="border rounded-xl divide-y">
        {order.items?.map((item: any) => (
          <div key={item.id} className="p-4 flex justify-between">
            <div>
              <p className="font-medium text-sm">{item.ticketType?.name ?? 'Ticket'}</p>
              <p className="text-xs text-muted-foreground">
                Qty: {item.quantity} &times;{' '}
                {formatCurrency(item.unitPrice, order.currency, currencies)}
              </p>
            </div>
            <p className="font-medium text-sm">
              {formatCurrency(item.lineTotal, order.currency, currencies)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 px-4">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-heading">
          {formatCurrency(order.totalGrossAmount, order.currency, currencies)}
        </span>
      </div>
    </div>
  )
}
