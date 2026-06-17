import { useState } from 'react'
import { Form } from '@inertiajs/react'
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
  const [ticketTypes, setTicketTypes] = useState<TicketTypeInput[]>(
    event?.ticketTypes?.map((t: any) => ({
      name: t.name ?? '',
      description: t.description ?? '',
      basePrice: String(t.basePrice ?? ''),
      quantityTotal: String(t.quantityTotal ?? ''),
      maxPerOrder: String(t.maxPerOrder ?? ''),
    })) ?? [
      { name: 'Standard', description: '', basePrice: '', quantityTotal: '', maxPerOrder: '' },
    ]
  )

  const formAction = isEditing && event?.id ? `/dashboard/events/${event.id}` : '/dashboard/events'
  const formMethod = isEditing && event?.id ? 'put' : 'post'
  const steps = ['Basic Info', 'Date & Venue', 'Tickets', 'Review']

  const update = (field: string, value: string) => setFormData((d) => ({ ...d, [field]: value }))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <a href="/dashboard/events" className="hover:text-foreground">
          Events
        </a>
        <span>/</span>
        <span className="text-foreground font-medium">{isEditing ? 'Edit' : 'Create'} Event</span>
      </div>

      <h1 className="text-2xl font-heading mb-8">{isEditing ? 'Edit Event' : 'Create Event'}</h1>

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
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Event title, category, currency, description and cover image.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => update('title', e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => update('categoryId', e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <Label htmlFor="currency">Currency</Label>
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
                <FieldDescription>Currency used for ticket pricing and payments</FieldDescription>
              </Field>
              <Field>
                <Label htmlFor="description">Description</Label>
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
                <Label>Cover Image</Label>
                <CoverImageUpload name="coverImage" existingUrl={event?.coverImageUrl} />
                <FieldDescription>
                  Drag & drop or click to upload. Crop after selecting.
                </FieldDescription>
              </Field>
            </CardContent>
          </Card>

          <Card className={step === 1 ? '' : 'hidden'}>
            <CardHeader>
              <CardTitle>Date &amp; Venue</CardTitle>
              <CardDescription>When and where your event takes place.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <Label htmlFor="venueName">Venue Name</Label>
                <Input
                  id="venueName"
                  name="venueName"
                  value={formData.venueName}
                  onChange={(e) => update('venueName', e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="venueAddress">Venue Address</Label>
                <Input
                  id="venueAddress"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={(e) => update('venueAddress', e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="startDate">Start Date &amp; Time</Label>
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
                  <Label htmlFor="endDate">End Date &amp; Time</Label>
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
                  <CardTitle>Ticket Types</CardTitle>
                  <CardDescription>
                    Define ticket categories with prices and quantities.
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
                  Add Ticket Type
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {ticketTypes.map((ticket, i) => (
                <div key={i} className="p-4 border rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Ticket #{i + 1}</h3>
                    {ticketTypes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        className="text-destructive"
                        onClick={() => setTicketTypes(ticketTypes.filter((_, j) => j !== i))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <Label htmlFor={`ticketName${i}`}>Name</Label>
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
                      <Label htmlFor={`ticketPrice${i}`}>Price</Label>
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
                      <Label htmlFor={`ticketQty${i}`}>Total Quantity</Label>
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
                      <Label htmlFor={`ticketMax${i}`}>Max per Order</Label>
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
                    <Label htmlFor={`ticketDesc${i}`}>Description (optional)</Label>
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
              <CardTitle>Review</CardTitle>
              <CardDescription>
                Ready to submit. Review your details then click below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All steps completed. Your event will be saved as a draft.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Previous
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create Event'}</Button>
            )}
          </div>
        </FieldGroup>
      </Form>
    </div>
  )
}
