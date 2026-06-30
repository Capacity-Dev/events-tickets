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

export default function AdminWhatsApp({ templates }: { templates: any[] }) {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('admin.whatsapp.title')}</h1>

      <div className="border rounded-xl p-5 bg-card mb-8 max-w-md">
        <h2 className="text-lg font-semibold mb-4">{t('admin.whatsapp.new_template')}</h2>
        <Form route="admin.whatsapp.store" className="space-y-4">
          <div>
            <Label htmlFor="name">{t('admin.whatsapp.template_name')}</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="category">{t('admin.whatsapp.category')}</Label>
            <select
              id="category"
              name="category"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="utility">{t('admin.whatsapp.category_utility')}</option>
              <option value="authentication">{t('admin.whatsapp.category_authentication')}</option>
              <option value="marketing">{t('admin.whatsapp.category_marketing')}</option>
            </select>
          </div>
          <div>
            <Label htmlFor="languageCode">{t('admin.whatsapp.language')}</Label>
            <Input id="languageCode" name="languageCode" defaultValue="en_US" />
          </div>
          <div>
            <Label htmlFor="variables">{t('admin.whatsapp.variables')}</Label>
            <Input id="variables" name="variables" placeholder='["event_name","ticket_type"]' />
          </div>
          <Button type="submit">{t('admin.whatsapp.create_template')}</Button>
        </Form>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.name')}</TableHead>
              <TableHead>{t('admin.whatsapp.category')}</TableHead>
              <TableHead>{t('admin.whatsapp.language')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead>{t('admin.whatsapp.created')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t('admin.whatsapp.no_templates')}
                </TableCell>
              </TableRow>
            ) : (
              templates.map((tp: any) => (
                <TableRow key={tp.id}>
                  <TableCell className="font-medium">{tp.name}</TableCell>
                  <TableCell className="text-sm capitalize">{tp.category}</TableCell>
                  <TableCell className="text-sm">{tp.languageCode}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tp.status === 'approved'
                          ? 'default'
                          : tp.status === 'rejected'
                            ? 'destructive'
                            : 'outline'
                      }
                    >
                      {tp.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tp.createdAt ? new Date(tp.createdAt).toLocaleDateString() : '-'}
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
