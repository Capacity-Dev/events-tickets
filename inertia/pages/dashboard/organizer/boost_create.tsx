import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { CountrySelect } from '~/components/country_select'
import { toast } from 'sonner'

const BUDGET_PRESETS = [10, 25, 50, 100, 250, 500]
const CHANNELS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'messenger', label: 'Messenger' },
]
const CTA_OPTIONS = [
  { value: 'LEARN_MORE', label: 'Learn More' },
  { value: 'BOOK_NOW', label: 'Book Now' },
  { value: 'SHOP_NOW', label: 'Buy Tickets' },
  { value: 'SIGN_UP', label: 'Sign Up' },
]

export default function BoostCreate({ event, appUrl }: { event: any; appUrl: string }) {
  const [budget, setBudget] = useState(25)
  const [budgetType, setBudgetType] = useState('daily')
  const [durationDays, setDurationDays] = useState(7)
  const [channels, setChannels] = useState<string[]>(['facebook'])
  const [headline, setHeadline] = useState(event.title?.slice(0, 40) ?? '')
  const [primaryText, setPrimaryText] = useState((event.description ?? '').slice(0, 125))
  const [callToAction, setCallToAction] = useState('LEARN_MORE')
  const [countries, setCountries] = useState<string[]>(['CD'])
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(65)
  const [loading, setLoading] = useState(false)

  const toggleChannel = (key: string) => {
    setChannels((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]))
  }

  const handleCreateBoost = async () => {
    if (channels.length === 0) {
      toast.error('Select at least one channel')
      return
    }
    setLoading(true)
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + durationDays)

      const targeting = {
        countries,
        ageMin,
        ageMax,
        languages: ['fr'],
      }

      const payload = {
        eventId: event.id,
        budget,
        budgetType,
        currency: event.currency ?? 'USD',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        channels: JSON.stringify(channels),
        targeting: JSON.stringify(targeting),
        headline,
        primaryText,
        callToAction,
      }

      await fetch(`/dashboard/events/${event.id}/boost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      })

      toast.success('Boost created! Confirm payment?')
      router.visit('/dashboard/boosts')
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to create boost')
    } finally {
      setLoading(false)
    }
  }

  const previewLink = `${appUrl}/events/${event.slug}`
  const coverUrl = event.coverImageUrl
    ? event.coverImageUrl.startsWith('http')
      ? event.coverImageUrl
      : `${appUrl}${event.coverImageUrl}`
    : null

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-heading mb-2">Boost Event</h1>
      <p className="text-muted-foreground mb-8">{event.title}</p>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-2 flex-wrap">
                {BUDGET_PRESETS.map((v) => (
                  <Button
                    key={v}
                    variant={budget === v ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBudget(v)}
                  >
                    ${v}
                  </Button>
                ))}
                <Button
                  variant={!BUDGET_PRESETS.includes(budget) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBudget(0)}
                >
                  Custom
                </Button>
              </div>
              {!BUDGET_PRESETS.includes(budget) && (
                <div>
                  <Label htmlFor="custom-budget">Custom Budget ($)</Label>
                  <Input
                    id="custom-budget"
                    type="number"
                    min={1}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>
              )}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="budgetType"
                    checked={budgetType === 'daily'}
                    onChange={() => setBudgetType('daily')}
                  />
                  <span className="text-sm">Daily</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="budgetType"
                    checked={budgetType === 'lifetime'}
                    onChange={() => setBudgetType('lifetime')}
                  />
                  <span className="text-sm">Lifetime</span>
                </label>
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={90}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Channels & Targeting</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label className="mb-2 block">Channels</Label>
                <div className="flex gap-2 flex-wrap">
                  {CHANNELS.map((ch) => (
                    <Button
                      key={ch.key}
                      variant={channels.includes(ch.key) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleChannel(ch.key)}
                    >
                      {ch.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-4">
                <div>
                  <Label className="mb-2 block">Countries</Label>
                  <CountrySelect selected={countries} onChange={setCountries} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age-min">Age Min</Label>
                  <Input
                    id="age-min"
                    type="number"
                    min={13}
                    max={65}
                    value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="age-max">Age Max</Label>
                  <Input
                    id="age-max"
                    type="number"
                    min={18}
                    max={65}
                    value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ad Content</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label htmlFor="headline">Headline (max 40 chars)</Label>
                <Input
                  id="headline"
                  maxLength={40}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
                <span className="text-xs text-muted-foreground">{headline.length}/40</span>
              </div>
              <div>
                <Label htmlFor="primary-text">Primary Text (max 125 chars)</Label>
                <Input
                  id="primary-text"
                  maxLength={125}
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                />
                <span className="text-xs text-muted-foreground">{primaryText.length}/125</span>
              </div>
              <div>
                <Label htmlFor="cta">Call to Action</Label>
                <select
                  id="cta"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {CTA_OPTIONS.map((cta) => (
                    <option key={cta.value} value={cta.value}>
                      {cta.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Facebook Feed
              </p>
              <div className="bg-muted rounded-lg overflow-hidden">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={event.title}
                    className="w-full aspect-[1.91/1] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[1.91/1] flex items-center justify-center text-3xl font-heading text-primary bg-secondary">
                    {event.title?.charAt(0) ?? 'E'}
                  </div>
                )}
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-sm font-semibold">{headline}</p>
                  <p className="text-xs text-muted-foreground">{primaryText}</p>
                  <a
                    href={previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {previewLink}
                  </a>
                  <span className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-8 px-4 text-xs font-medium self-start">
                    {CTA_OPTIONS.find((c) => c.value === callToAction)?.label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleCreateBoost} disabled={loading || channels.length === 0} size="lg">
            {loading ? 'Creating...' : 'Create Boost'}
          </Button>
        </div>
      </div>
    </div>
  )
}
