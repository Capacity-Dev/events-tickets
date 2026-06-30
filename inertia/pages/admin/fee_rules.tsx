import { useTranslation } from '~/lib/i18n'
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
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('admin.fee_rules.title')}</h1>

      <div className="border rounded-xl p-5 bg-card mb-8 max-w-md">
        <h2 className="text-lg font-semibold mb-4">{t('admin.fee_rules.new_rule')}</h2>
        <Form route="admin.fee.rules.store" className="space-y-4">
          <div>
            <Label htmlFor="name">{t('admin.fee_rules.rule_name')}</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="type">{t('admin.fee_rules.type')}</Label>
            <select
              id="type"
              name="type"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="percentage">{t('admin.fee_rules.type_percentage')}</option>
              <option value="fixed_amount">{t('admin.fee_rules.type_fixed_amount')}</option>
              <option value="hybrid">{t('admin.fee_rules.type_hybrid')}</option>
              <option value="per_lot">{t('admin.fee_rules.type_per_lot')}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="value">{t('admin.fee_rules.value')}</Label>
              <Input id="value" name="value" type="number" step="0.01" required />
            </div>
            <div>
              <Label htmlFor="appliesTo">{t('admin.fee_rules.applies_to')}</Label>
              <select
                id="appliesTo"
                name="appliesTo"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="buyer">{t('admin.fee_rules.applies_buyer')}</option>
                <option value="organizer">{t('admin.fee_rules.applies_organizer')}</option>
                <option value="split">{t('admin.fee_rules.applies_split')}</option>
                <option value="boost">{t('admin.fee_rules.applies_boost')}</option>
              </select>
            </div>
          </div>
          <Button type="submit">{t('admin.fee_rules.create_rule')}</Button>
        </Form>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.name')}</TableHead>
              <TableHead>{t('admin.fee_rules.type')}</TableHead>
              <TableHead>{t('admin.fee_rules.value')}</TableHead>
              <TableHead>{t('admin.fee_rules.applies_to')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t('admin.fee_rules.no_rules')}
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
                      {t('status.' + r.status)}
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
