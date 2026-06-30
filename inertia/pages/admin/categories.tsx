import { useTranslation } from '~/lib/i18n'
import { usePage } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminCategories({ categories }: { categories: any[] }) {
  const { t } = useTranslation()
  const { adminPrefix } = usePage().props as any

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('admin.categories.title')}</h1>

      <div className="border rounded-xl p-5 bg-card mb-8 max-w-sm">
        <h2 className="text-lg font-semibold mb-4">{t('admin.categories.new_category')}</h2>
        <Form route="admin.categories.store" className="space-y-4">
          <div>
            <Label htmlFor="name">{t('admin.categories.name')}</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="slug">{t('admin.categories.slug_hint')}</Label>
            <Input id="slug" name="slug" />
          </div>
          <div>
            <Label htmlFor="displayOrder">{t('admin.categories.display_order')}</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue="0" />
          </div>
          <Button type="submit">{t('admin.categories.create')}</Button>
        </Form>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.categories.name')}</TableHead>
              <TableHead>{t('admin.categories.slug')}</TableHead>
              <TableHead>{t('admin.categories.order_col')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{cat.slug}</TableCell>
                <TableCell className="text-sm">{cat.displayOrder}</TableCell>
                <TableCell className="text-right">
                  <form
                    action={`/${adminPrefix}/categories/${cat.id}`}
                    method="POST"
                    className="inline"
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg border border-destructive text-destructive h-7 px-2 text-xs font-medium bg-transparent cursor-pointer hover:bg-destructive/10"
                    >
                      {t('common.delete')}
                    </button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
