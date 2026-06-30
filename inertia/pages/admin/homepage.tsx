import { useTranslation } from '~/lib/i18n'
import { usePage } from '@inertiajs/react'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminHomepage({ events }: { events: any[] }) {
  const { t } = useTranslation()
  const { adminPrefix } = usePage().props as any

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('admin.homepage.title')}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t('admin.homepage.subtitle')}</p>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.homepage.title_col')}</TableHead>
              <TableHead>{t('admin.homepage.featured')}</TableHead>
              <TableHead>{t('admin.homepage.date')}</TableHead>
              <TableHead className="text-right">{t('admin.homepage.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event: any) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  <Badge variant={event.isFeatured ? 'default' : 'outline'}>
                    {event.isFeatured
                      ? t('admin.homepage.featured_badge')
                      : t('admin.homepage.hidden_badge')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {event.startDate ? new Date(event.startDate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <form
                    action={`/${adminPrefix}/homepage/${event.id}/toggle-featured`}
                    method="POST"
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-7 px-3 text-xs font-medium cursor-pointer"
                    >
                      {event.isFeatured
                        ? t('admin.homepage.unfeature')
                        : t('admin.homepage.feature')}
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
