import { useState } from 'react'
import { Form } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Field } from '~/components/ui/field'
import { FieldGroup } from '~/components/ui/field-group'
import { FieldDescription } from '~/components/ui/field-description'
import CoverImageUpload from '~/components/cover-image-upload'

interface TicketTypeInput {
  name: string
  description: string
  basePrice: string
  quantityTotal: string
  maxPerOrder: string
}

interface CategorySummary {
  id: string
  name: string
}

interface CurrencySummary {
  id: string
  code: string
  name: string
  symbol: string
}

export default function OrganizerEventForm({
  categories = [],
  currencies = [],
  event,
}: {
  categories?: CategorySummary[]
  currencies?: CurrencySummary[]
  event?: any
}) {
  const { t } = useTranslation()
  const isEditing = !!event
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    title: event?.title ?? '',
    categoryId: event?.categoryId ?? '',
    currency: event?.ticketTypes?.[0]?.currency ?? currencies[0]?.code ?? 'USD',
    description: event?.description ?? '',
    venueName: event?.venueName ?? '',
    venueAddress: event?.venueAddress ?? '',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
  })
  const [visibility, setVisibility] = useState<string>(event?.visibility ?? 'public')
  const [accessPassword, setAccessPassword] = useState('')
  const [ticketTypes, setTicketTypes] = useState<TicketTypeInput[]>(
    event?.ticketTypes?.map((tt: any) => ({
      name: tt.name ?? '',
      description: tt.description ?? '',
      basePrice: String(tt.basePrice ?? ''),
      quantityTotal: String(tt.quantityTotal ?? ''),
      maxPerOrder: String(tt.maxPerOrder ?? ''),
    })) ?? [
      { name: 'Standard', description: '', basePrice: '', quantityTotal: '', maxPerOrder: '' },
    ]
  )

  const formAction = isEditing && event?.id ? `/dashboard/events/${event.id}` : '/dashboard/events'
  const formMethod = isEditing && event?.id ? 'put' : 'post'
  const steps = [
    t('organizer.events_create.step_basic_info'),
    t('organizer.events_create.step_date_venue'),
    t('organizer.events_create.step_tickets'),
    t('organizer.events_create.step_privacy'),
    t('organizer.events_create.step_review'),
  ]

  const update = (field: string, value: string) => setFormData((d) => ({ ...d, [field]: value }))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <a href="/dashboard/events" className="hover:text-foreground">
          {t('organizer.events_create.breadcrumb_events')}
        </a>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isEditing
            ? t('organizer.events_create.edit_title')
            : t('organizer.events_create.create_title')}
        </span>
      </div>

      <h1 className="text-2xl font-heading mb-8">
        {isEditing
          ? t('organizer.events_create.edit_title')
          : t('organizer.events_create.create_title')}
      </h1>

      <div className="flex mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                i === step
                  ? 'bg-primary text-primary-foreground'
                  : i < step
                    ? 'text-primary'
                    : 'text-muted-foreground'
              }`}
            >
              <span
                className={`flex items-center justify-center size-6 rounded-full text-xs font-bold border-2 ${
                  i === step
                    ? 'border-primary-foreground bg-primary-foreground text-primary'
                    : i < step
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground'
                }`}
              >
                {i < step ? '\u2713' : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      <Form action={formAction} method={formMethod as any}>
        <FieldGroup>
          <Card className={step === 0 ? '' : 'hidden'}>
            <CardHeader>
              <CardTitle>{t('organizer.events_create.section_basic_info')}</CardTitle>
              <CardDescription>
                {t('organizer.events_create.section_basic_info_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <Label htmlFor="title">{t('organizer.events_create.field_event_title')}</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => update('title', e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="categoryId">{t('organizer.events_create.field_category')}</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => update('categoryId', e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">{t('organizer.events_create.no_category')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <Label htmlFor="currency">{t('organizer.events_create.field_currency')}</Label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={(e) => update('currency', e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {currencies.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
                <FieldDescription>
                  {t('organizer.events_create.field_currency_desc')}
                </FieldDescription>
              </Field>
              <Field>
                <Label htmlFor="description">
                  {t('organizer.events_create.field_description')}
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={5}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </Field>
              <Field>
                <Label>{t('organizer.events_create.field_cover_image')}</Label>
                <CoverImageUpload name="coverImage" existingUrl={event?.coverImageUrl} />
                <FieldDescription>
                  {t('organizer.events_create.field_cover_image_desc')}
                </FieldDescription>
              </Field>
            </CardContent>
          </Card>

          <Card className={step === 1 ? '' : 'hidden'}>
            <CardHeader>
              <CardTitle>{t('organizer.events_create.section_date_venue')}</CardTitle>
              <CardDescription>
                {t('organizer.events_create.section_date_venue_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <Label htmlFor="venueName">{t('organizer.events_create.field_venue_name')}</Label>
                <Input
                  id="venueName"
                  name="venueName"
                  value={formData.venueName}
                  onChange={(e) => update('venueName', e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="venueAddress">
                  {t('organizer.events_create.field_venue_address')}
                </Label>
                <Input
                  id="venueAddress"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={(e) => update('venueAddress', e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="startDate">{t('organizer.events_create.field_start_date')}</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => update('startDate', e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="endDate">{t('organizer.events_create.field_end_date')}</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => update('endDate', e.target.value)}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card className={step === 2 ? '' : 'hidden'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('organizer.events_create.section_ticket_types')}</CardTitle>
                  <CardDescription>
                    {t('organizer.events_create.section_ticket_types_desc')}
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    setTicketTypes([
                      ...ticketTypes,
                      {
                        name: '',
                        description: '',
                        basePrice: '',
                        quantityTotal: '',
                        maxPerOrder: '',
                      },
                    ])
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-icon="inline-start"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  {t('organizer.events_create.add_ticket_type')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {ticketTypes.map((ticket, i) => (
                <div key={i} className="p-4 border rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      {t('organizer.events_create.ticket_number', { n: i + 1 })}
                    </h3>
                    {ticketTypes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="text-destructive"
                        onClick={() => setTicketTypes(ticketTypes.filter((_, j) => j !== i))}
                      >
                        {t('common.remove')}
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <Label htmlFor={`ticketName${i}`}>{t('common.name')}</Label>
                      <Input
                        id={`ticketName${i}`}
                        name={`ticketTypes[${i}][name]`}
                        value={ticket.name}
                        onChange={(e) => {
                          const n = [...ticketTypes]
                          n[i] = { ...n[i], name: e.target.value }
                          setTicketTypes(n)
                        }}
                        required
                      />
                    </Field>
                    <Field>
                      <Label htmlFor={`ticketPrice${i}`}>
                        {t('organizer.events_create.field_price')}
                      </Label>
                      <Input
                        id={`ticketPrice${i}`}
                        name={`ticketTypes[${i}][basePrice]`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={ticket.basePrice}
                        onChange={(e) => {
                          const n = [...ticketTypes]
                          n[i] = { ...n[i], basePrice: e.target.value }
                          setTicketTypes(n)
                        }}
                        required
                      />
                    </Field>
                    <Field>
                      <Label htmlFor={`ticketQty${i}`}>
                        {t('organizer.events_create.field_total_quantity')}
                      </Label>
                      <Input
                        id={`ticketQty${i}`}
                        name={`ticketTypes[${i}][quantityTotal]`}
                        type="number"
                        min="1"
                        value={ticket.quantityTotal}
                        onChange={(e) => {
                          const n = [...ticketTypes]
                          n[i] = { ...n[i], quantityTotal: e.target.value }
                          setTicketTypes(n)
                        }}
                        required
                      />
                    </Field>
                    <Field>
                      <Label htmlFor={`ticketMax${i}`}>
                        {t('organizer.events_create.field_max_per_order')}
                      </Label>
                      <Input
                        id={`ticketMax${i}`}
                        name={`ticketTypes[${i}][maxPerOrder]`}
                        type="number"
                        min="1"
                        value={ticket.maxPerOrder}
                        onChange={(e) => {
                          const n = [...ticketTypes]
                          n[i] = { ...n[i], maxPerOrder: e.target.value }
                          setTicketTypes(n)
                        }}
                      />
                    </Field>
                  </div>
                  <Field>
                    <Label htmlFor={`ticketDesc${i}`}>
                      {t('organizer.events_create.field_ticket_description')}
                    </Label>
                    <Input
                      id={`ticketDesc${i}`}
                      name={`ticketTypes[${i}][description]`}
                      value={ticket.description}
                      onChange={(e) => {
                        const n = [...ticketTypes]
                        n[i] = { ...n[i], description: e.target.value }
                        setTicketTypes(n)
                      }}
                    />
                  </Field>
                  <input
                    type="hidden"
                    name={`ticketTypes[${i}][currency]`}
                    value={formData.currency}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={step === 3 ? '' : 'hidden'}>
            <CardHeader>
              <CardTitle>{t('organizer.events_create.section_privacy')}</CardTitle>
              <CardDescription>{t('organizer.events_create.section_privacy_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-sm">
                      {t('organizer.events_create.visibility_public')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('organizer.events_create.visibility_public_desc')}
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="unlisted"
                    checked={visibility === 'unlisted'}
                    onChange={() => setVisibility('unlisted')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-sm">
                      {t('organizer.events_create.visibility_unlisted')}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('organizer.events_create.visibility_unlisted_desc')}
                      {accessPassword
                        ? ' ' + t('organizer.events_create.visibility_unlisted_password')
                        : ''}
                    </p>
                  </div>
                </label>
              </div>

              <Separator />

              <Field>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="secureEvent"
                    checked={accessPassword.length > 0}
                    onChange={(e) => {
                      if (!e.target.checked) setAccessPassword('')
                    }}
                    disabled={visibility === 'public'}
                    className="h-4 w-4 rounded border-input text-primary"
                  />
                  <Label
                    htmlFor="secureEvent"
                    className={visibility === 'public' ? 'opacity-50' : ''}
                  >
                    {t('organizer.events_create.secure_with_password')}
                  </Label>
                </div>
                <FieldDescription>
                  {t('organizer.events_create.secure_with_password_desc')}
                </FieldDescription>
              </Field>

              {accessPassword.length > 0 && (
                <Field>
                  <Label htmlFor="accessPassword">
                    {t('organizer.events_create.field_event_password')}
                  </Label>
                  <Input
                    id="accessPassword"
                    type="text"
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    minLength={4}
                    placeholder={t('organizer.events_create.field_event_password_placeholder')}
                  />
                </Field>
              )}
            </CardContent>
          </Card>

          <Card className={step === 4 ? '' : 'hidden'}>
            <CardHeader>
              <CardTitle>{t('organizer.events_create.section_review')}</CardTitle>
              <CardDescription>{t('organizer.events_create.section_review_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                {t('organizer.events_create.review_draft_note')}
              </p>
              {visibility === 'unlisted' && (
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  <span className="font-medium">
                    {t('organizer.events_create.review_private_event')}
                  </span>{' '}
                  — {t('organizer.events_create.review_private_note')}
                  {accessPassword ? ', ' + t('organizer.events_create.review_password_note') : ''}.
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          <input type="hidden" name="visibility" value={visibility} />
          {accessPassword && <input type="hidden" name="accessPassword" value={accessPassword} />}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              {t('common.previous')}
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                {t('common.next')}
              </Button>
            ) : (
              <Button type="submit">
                {isEditing ? t('common.save_changes') : t('organizer.events.create_event')}
              </Button>
            )}
          </div>
        </FieldGroup>
      </Form>
    </div>
  )
}
