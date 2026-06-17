import { usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

interface CurrencyData {
  id: string
  code: string
  name: string
  symbol: string
  countryCode: string
  networks: string[]
  exchangeRate: string
  isActive: boolean
  sortOrder: number
}

const ALL_NETWORKS = [
  'vodacom',
  'airtel',
  'orange',
  'africell',
  'mtn',
  'moov',
  'free',
  'togocom',
  'wave',
  'mpesa',
  'afrimoney',
  'qmoney',
  'aps',
  'coris',
  'celtiis',
]

export default function AdminCurrencies({ currencies }: { currencies: CurrencyData[] }) {
  const { adminPrefix } = usePage().props as any

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Currencies</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={`/${adminPrefix}/currencies`}
            method="POST"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <Label htmlFor="code">ISO Code</Label>
              <Input id="code" name="code" maxLength={3} required placeholder="USD" />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="US Dollar" />
            </div>
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input id="symbol" name="symbol" maxLength={10} required placeholder="$" />
            </div>
            <div>
              <Label htmlFor="countryCode">Country Code</Label>
              <Input id="countryCode" name="countryCode" maxLength={2} required placeholder="CD" />
            </div>
            <div>
              <Label htmlFor="exchangeRate">Exchange Rate (to USD)</Label>
              <Input
                id="exchangeRate"
                name="exchangeRate"
                type="number"
                step="0.000001"
                min="0"
                defaultValue="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue="0" />
            </div>
            <div className="sm:col-span-3">
              <Label>Supported Networks</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {ALL_NETWORKS.map((n) => (
                  <label key={n} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox" name="networks" value={n} className="rounded" />
                    {n.charAt(0).toUpperCase() + n.slice(1)}
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Check all supported mobile money networks for this currency
              </p>
            </div>
            <div className="sm:col-span-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  value="1"
                  defaultChecked
                  className="rounded"
                />
                Active
              </label>
            </div>
            <div className="sm:col-span-3">
              <Button type="submit">Add Currency</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Networks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sort</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No currencies yet
                </TableCell>
              </TableRow>
            ) : (
              currencies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-medium">{c.code}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.symbol}</TableCell>
                  <TableCell className="font-mono">{c.countryCode}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {Number(c.exchangeRate).toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(c.networks || []).map((n) => (
                        <Badge key={n} variant="outline" className="text-xs">
                          {n}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.isActive ? 'default' : 'outline'}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{c.sortOrder}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
