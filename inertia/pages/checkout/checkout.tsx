import { usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

export default function CheckoutPage() {
  const { props } = usePage()
  const user = (props as any).user

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-2xl font-heading mb-2">Checkout</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {user ? `Signed in as ${user.email}` : 'Enter your details to complete the purchase.'}
      </p>

      <form action="/checkout" method="POST" className="space-y-5">
        {!user && (
          <>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
              <p className="text-xs text-muted-foreground mt-1">Tickets will be sent to this email</p>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <Button type="submit" className="w-full">
            Complete Purchase
          </Button>
        </div>
      </form>
    </div>
  )
}
