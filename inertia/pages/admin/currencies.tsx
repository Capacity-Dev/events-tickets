import { useState, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
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

function getCheckedNetworks(parent: HTMLElement | null) {
  if (!parent) return [] as string[]
  const boxes = parent.querySelectorAll<HTMLInputElement>('input.network-cb:checked')
  return Array.from(boxes).map((cb) => cb.value)
}

export default function AdminCurrencies({ currencies }: { currencies: CurrencyData[] }) {
  const { adminPrefix } = usePage().props as any
  const [editCurrency, setEditCurrency] = useState<CurrencyData | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const addFormRef = useRef<HTMLFormElement>(null)
  const editContainerRef = useRef<HTMLDivElement>(null)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const form = addFormRef.current
    if (!form) return
    setSubmitting(true)

    const fd = new FormData(form)
    const networks = getCheckedNetworks(form)

    router.post(`/${adminPrefix}/currencies`, {
      code: fd.get('code'),
      name: fd.get('name'),
      symbol: fd.get('symbol'),
      countryCode: fd.get('countryCode'),
      exchangeRate: fd.get('exchangeRate'),
      sortOrder: fd.get('sortOrder') ?? '0',
      isActive: fd.get('isActive') ? '1' : '0',
      networks,
    })
  }

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    const container = editContainerRef.current
    if (!container || !editCurrency) return
    setSubmitting(true)

    const fd = new FormData(e.currentTarget as HTMLFormElement)
    const networks = getCheckedNetworks(container)

    router.post(`/${adminPrefix}/currencies/${editCurrency.id}`, {
      code: fd.get('code'),
      name: fd.get('name'),
      symbol: fd.get('symbol'),
      countryCode: fd.get('countryCode'),
      exchangeRate: fd.get('exchangeRate'),
      sortOrder: fd.get('sortOrder') ?? '0',
      isActive: fd.get('isActive') ? '1' : '0',
      networks,
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Currencies</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={addFormRef}
            onSubmit={handleAdd}
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
                    <input type="checkbox" className="network-cb rounded" value={n} />
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
              <Button type="submit" disabled={submitting}>
                Add Currency
              </Button>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => setEditCurrency(c)}
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-7 px-2 text-xs font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editCurrency} onOpenChange={() => setEditCurrency(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Currency — {editCurrency?.code}</DialogTitle>
          </DialogHeader>
          {editCurrency && (
            <div ref={editContainerRef}>
              <form onSubmit={handleEdit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-code">ISO Code</Label>
                    <Input
                      id="edit-code"
                      name="code"
                      maxLength={3}
                      required
                      defaultValue={editCurrency.code}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input id="edit-name" name="name" required defaultValue={editCurrency.name} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-symbol">Symbol</Label>
                    <Input
                      id="edit-symbol"
                      name="symbol"
                      maxLength={10}
                      required
                      defaultValue={editCurrency.symbol}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-countryCode">Country Code</Label>
                    <Input
                      id="edit-countryCode"
                      name="countryCode"
                      maxLength={2}
                      required
                      defaultValue={editCurrency.countryCode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-exchangeRate">Exchange Rate (to USD)</Label>
                    <Input
                      id="edit-exchangeRate"
                      name="exchangeRate"
                      type="number"
                      step="0.000001"
                      min="0"
                      required
                      defaultValue={editCurrency.exchangeRate}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-sortOrder">Sort Order</Label>
                    <Input
                      id="edit-sortOrder"
                      name="sortOrder"
                      type="number"
                      min="0"
                      defaultValue={String(editCurrency.sortOrder)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Supported Networks</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ALL_NETWORKS.map((n) => (
                      <label key={n} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="network-cb rounded"
                          value={n}
                          defaultChecked={editCurrency.networks.includes(n)}
                        />
                        {n.charAt(0).toUpperCase() + n.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      value="1"
                      defaultChecked={editCurrency.isActive}
                      className="rounded"
                    />
                    Active
                  </label>
                </div>

                <Separator />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditCurrency(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
