import { formatCurrency, type CurrencyInfo } from '~/lib/currency'

export default function CartPage({
  cart,
  total,
  currencies,
}: {
  cart: any[]
  total: number
  currencies: CurrencyInfo[]
}) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-heading mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">Your cart is empty</p>
          <a href="/events" className="text-primary text-sm font-medium hover:underline">
            Browse events
          </a>
        </div>
      ) : (
        <>
          <div className="border rounded-xl divide-y mb-6">
            {cart.map((item, i) => (
              <div key={i} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.price * item.quantity, item.currency, currencies)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-8 px-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-heading">
              {formatCurrency(total, undefined, currencies)}
            </span>
          </div>

          <a
            href="/checkout"
            className="block w-full text-center rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/80 transition-colors no-underline"
          >
            Proceed to Checkout
          </a>
        </>
      )}
    </div>
  )
}
