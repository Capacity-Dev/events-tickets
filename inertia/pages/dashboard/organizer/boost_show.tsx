import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { boostStatusVariant } from '~/lib/boost_status'

export default function BoostShow({ boost, insights }: { boost: any; insights: any }) {
  const { t } = useTranslation()
  const [pausing, setPausing] = useState(false)
  const [resuming, setResuming] = useState(false)

  const stats = insights ?? {
    impressions: boost.metaImpressions,
    clicks: boost.metaClicks,
    spend: boost.metaSpent,
    ctr: boost.metaCtr,
    cpc: boost.metaCpc,
  }

  const channels = Array.isArray(boost.channels)
    ? boost.channels
    : JSON.parse(boost.channels || '[]')

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading mb-1">
            {boost.headline || t('organizer.boost_show.title_fallback')}
          </h1>
          <p className="text-muted-foreground">
            {boost.event?.title} &middot;{' '}
            <Badge variant={boostStatusVariant[boost.status] || 'outline'}>
              {t('status.' + boost.status)}
            </Badge>
          </p>
        </div>
        <div className="flex gap-2">
          {boost.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              disabled={pausing}
              onClick={async () => {
                setPausing(true)
                try {
                  await router.post(`/dashboard/boosts/${boost.id}/pause`)
                } finally {
                  setPausing(false)
                }
              }}
            >
              {pausing ? t('organizer.boost_show.pausing') : t('organizer.boost_show.pause')}
            </Button>
          )}
          {boost.status === 'paused' && (
            <Button
              variant="outline"
              size="sm"
              disabled={resuming}
              onClick={async () => {
                setResuming(true)
                try {
                  await router.post(`/dashboard/boosts/${boost.id}/resume`)
                } finally {
                  setResuming(false)
                }
              }}
            >
              {resuming ? t('organizer.boost_show.resuming') : t('organizer.boost_show.resume')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.boost_show.stat_budget')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">${boost.budget}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{boost.budgetType}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.boost_show.stat_spent')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">${Number(stats.spend).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('organizer.boost_show.meta_ads')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.boost_show.stat_impressions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.impressions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.boost_show.stat_clicks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{stats.clicks.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              {t('organizer.boost_show.stat_ctr')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading">{Number(stats.ctr).toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('organizer.boost_show.campaign_details')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('organizer.boost_show.meta_campaign_id')}
              </span>
              <span className="font-mono text-xs">{boost.metaCampaignId || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('organizer.boost_show.meta_adset_id')}
              </span>
              <span className="font-mono text-xs">{boost.metaAdsetId || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('organizer.boost_show.meta_ad_id')}</span>
              <span className="font-mono text-xs">{boost.metaAdId || '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('organizer.boost_show.field_channels')}
              </span>
              <span>{channels.join(', ') || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('organizer.boost_show.field_cta')}</span>
              <span>{boost.callToAction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('organizer.boost_show.field_start')}</span>
              <span>{boost.startDate ? new Date(boost.startDate).toLocaleDateString() : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('organizer.boost_show.field_end')}</span>
              <span>{boost.endDate ? new Date(boost.endDate).toLocaleDateString() : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('organizer.boost_show.fee_rule')}</span>
              <span className="font-mono text-xs">
                {boost.feeRuleId || t('organizer.boost_show.no_markup')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('organizer.boost_show.markup')}</span>
              <span>${Number(boost.markupAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('organizer.boost_show.meta_net_budget')}
              </span>
              <span>${Number(boost.metaBudget).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        {boost.event && (
          <Card>
            <CardHeader>
              <CardTitle>{t('organizer.boost_show.event_card_title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="font-semibold">{boost.event.title}</p>
              <p className="text-sm text-muted-foreground">{boost.event.venueName}</p>
              <a
                href={`/events/${boost.event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {t('organizer.boost_show.view_public_page')}
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
