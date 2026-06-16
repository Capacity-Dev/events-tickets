import { Form } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function OrganizerPayouts({ payouts }: { payouts: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Payouts</h1>

      <div className="border rounded-xl p-5 bg-card mb-8">
        <h2 className="text-lg font-semibold mb-4">Request Payout</h2>
        <Form route="dashboard.organizer.payouts.request" className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0" required />
          </div>
          <div>
            <Label htmlFor="payoutMethod">Payout Method</Label>
            <select id="payoutMethod" name="payoutMethod" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>
          <Button type="submit">Request Payout</Button>
        </Form>
      </div>

      <div className="border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Requested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No payouts yet</TableCell></TableRow>
            ) : payouts.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">${p.amount}</TableCell>
                <TableCell><Badge variant={p.status === 'completed' ? 'default' : 'outline'}>{p.status}</Badge></TableCell>
                <TableCell className="text-sm">{p.payoutMethod ?? '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
