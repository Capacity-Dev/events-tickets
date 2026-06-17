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

export default function AdminFeeRules({ rules }: { rules: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Fee Rules</h1>

      <div className="border rounded-xl p-5 bg-card mb-8 max-w-md">
        <h2 className="text-lg font-semibold mb-4">New Fee Rule</h2>
        <Form route="admin.fee.rules.store" className="space-y-4">
          <div>
            <Label htmlFor="name">Rule Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="fixed_amount">Fixed Amount</option>
              <option value="hybrid">Hybrid</option>
              <option value="per_lot">Per Lot</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="value">Value</Label>
              <Input id="value" name="value" type="number" step="0.01" required />
            </div>
            <div>
              <Label htmlFor="appliesTo">Applies To</Label>
              <select
                id="appliesTo"
                name="appliesTo"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="buyer">Buyer</option>
                <option value="organizer">Organizer</option>
                <option value="split">Split</option>
              </select>
            </div>
          </div>
          <Button type="submit">Create Rule</Button>
        </Form>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Applies To</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No fee rules
                </TableCell>
              </TableRow>
            ) : (
              rules.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-sm">{r.type}</TableCell>
                  <TableCell className="text-sm">
                    {r.value}
                    {r.type === 'percentage' ? '%' : ''}
                  </TableCell>
                  <TableCell className="text-sm">{r.appliesTo}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'active' ? 'default' : 'outline'}>
                      {r.status}
                    </Badge>
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
