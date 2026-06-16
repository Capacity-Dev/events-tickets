export default function CartPage({ cart, total }: { cart: any[]; total: number }) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-heading mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">Your cart is empty</p>
          <a href="/events" className="text-primary text-sm font-medium hover:underline">Browse events</a>
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
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-8 px-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-heading">${total.toFixed(2)}</span>
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
