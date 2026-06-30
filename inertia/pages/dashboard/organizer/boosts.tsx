import { useTranslation } from '~/lib/i18n'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function Boosts({ boosts }: { boosts: any[] }) {
  const { t } = useTranslation()

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-heading mb-2">{t('organizer.boosts.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('organizer.boosts.subtitle')}</p>

      {boosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-1">{t('organizer.boosts.empty_title')}</p>
            <p className="text-sm">{t('organizer.boosts.empty_description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('organizer.boosts.table_event')}</TableHead>
                <TableHead>{t('organizer.boosts.table_status')}</TableHead>
                <TableHead>{t('organizer.boosts.table_budget')}</TableHead>
                <TableHead>{t('organizer.boosts.table_spent')}</TableHead>
                <TableHead>{t('organizer.boosts.table_impressions')}</TableHead>
                <TableHead>{t('organizer.boosts.table_clicks')}</TableHead>
                <TableHead>{t('organizer.boosts.table_ctr')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boosts.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <a
                      href={`/dashboard/boosts/${b.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {b.event?.title ?? b.headline ?? t('organizer.boosts.fallback_title')}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        b.status === 'active'
                          ? 'default'
                          : b.status === 'failed'
                            ? 'destructive'
                            : 'outline'
                      }
                    >
                      {t('status.' + b.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">${b.budget}</TableCell>
                  <TableCell className="text-sm">${b.metaSpent}</TableCell>
                  <TableCell className="text-sm">{b.metaImpressions.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{b.metaClicks.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{Number(b.metaCtr).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
