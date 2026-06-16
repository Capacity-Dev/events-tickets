import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

const networks = [
  { value: 'vodacom', label: 'Vodacom' },
  { value: 'airtel', label: 'Airtel' },
  { value: 'orange', label: 'Orange' },
  { value: 'africell', label: 'Africell' },
]

export default function PayPage({ order, pinRequired, transactionId, instructions }: any) {
  return (
    <div className="max-w-lg mx-auto">
      <a href={`/dashboard/buyer/orders/${order.id}`} className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to order
      </a>

      <h1 className="text-2xl font-heading mt-2 mb-1">Complete Payment</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Order {order.orderNumber} &middot; ${order.totalGrossAmount}
      </p>

      {pinRequired && (
        <div className="border rounded-xl p-5 bg-card mb-6 space-y-3">
          <h2 className="text-lg font-semibold">PIN Required</h2>
          {instructions && (
            <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: instructions }} />
          )}
          <form action="/orders/finalize" method="POST" className="space-y-4">
            <input type="hidden" name="transactionId" value={transactionId} />
            <input type="hidden" name="orderId" value={order.id} />
            <div>
              <Label htmlFor="pin">Enter PIN / OTP</Label>
              <Input id="pin" name="pin" type="text" inputMode="numeric" required />
            </div>
            <Button type="submit">Confirm Payment</Button>
          </form>
        </div>
      )}

      {!pinRequired && (
        <div className="border rounded-xl p-5 bg-card">
          <h2 className="text-lg font-semibold mb-4">Mobile Money Payment</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Pay with mobile money (DRC networks: Vodacom, Airtel, Orange, Africell).
          </p>

          <form action={`/dashboard/buyer/orders/${order.id}/pay`} method="POST" className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+243XXXXXXXXX"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g. +243 for DRC)
              </p>
            </div>

            <div>
              <Label htmlFor="network">Mobile Network</Label>
              <select
                id="network"
                name="network"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select network</option>
                {networks.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              Pay ${order.totalGrossAmount}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
