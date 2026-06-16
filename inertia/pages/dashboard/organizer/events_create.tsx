import { useState } from 'react'
import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

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

export default function OrganizerEventForm({
  categories = [],
  event,
}: {
  categories?: CategorySummary[]
  event?: any
}) {
  const isEditing = !!event
  const [step, setStep] = useState(0)
  const [ticketTypes, setTicketTypes] = useState<TicketTypeInput[]>(
    event?.ticketTypes?.map((t: any) => ({
      name: t.name ?? '',
      description: t.description ?? '',
      basePrice: String(t.basePrice ?? ''),
      quantityTotal: String(t.quantityTotal ?? ''),
      maxPerOrder: String(t.maxPerOrder ?? ''),
    })) ?? [{ name: 'Standard', description: '', basePrice: '', quantityTotal: '', maxPerOrder: '' }]
  )

  const routeName = isEditing ? 'dashboard.organizer.events.update' : 'dashboard.organizer.events.store'
  const steps = ['Basic Info', 'Date & Venue', 'Tickets', 'Review']

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <a href="/dashboard/organizer/events" className="hover:text-foreground">Events</a>
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
              <span className={`flex items-center justify-center size-6 rounded-full text-xs font-bold border-2 ${
                i === step
                  ? 'border-primary-foreground bg-primary-foreground text-primary'
                  : i < step
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground'
              }`}>
                {i < step ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      <Form
        route={routeName}
        {...(isEditing ? { params: { id: event.id } as any } : {})}
        className="space-y-6"
      >
        {renderFormContent()}
      </Form>
    </div>
  )

  function renderFormContent() {
    return (
      <>
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" name="title" defaultValue={event?.title} required />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" name="slug" defaultValue={event?.slug} placeholder="leave blank to auto-generate" />
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={event?.categoryId ?? ''}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                defaultValue={event?.description ?? ''}
                rows={5}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Date & Venue</h2>
            <div>
              <Label htmlFor="venueName">Venue Name</Label>
              <Input id="venueName" name="venueName" defaultValue={event?.venueName ?? ''} />
            </div>
            <div>
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input id="venueAddress" name="venueAddress" defaultValue={event?.venueAddress ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input id="startDate" name="startDate" type="datetime-local" defaultValue={event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : ''} required />
              </div>
              <div>
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input id="endDate" name="endDate" type="datetime-local" defaultValue={event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ''} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ticket Types</h2>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setTicketTypes([...ticketTypes, { name: '', description: '', basePrice: '', quantityTotal: '', maxPerOrder: '' }])}
              >
                Add Ticket Type
              </Button>
            </div>

            {ticketTypes.map((ticket, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
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
                  <div>
                    <Label htmlFor={`ticketName${i}`}>Name</Label>
                    <Input
                      id={`ticketName${i}`}
                      name={`ticketTypes[${i}][name]`}
                      value={ticket.name}
                      onChange={(e) => {
                        const next = [...ticketTypes]
                        next[i] = { ...next[i], name: e.target.value }
                        setTicketTypes(next)
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`ticketPrice${i}`}>Price ($)</Label>
                    <Input
                      id={`ticketPrice${i}`}
                      name={`ticketTypes[${i}][basePrice]`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={ticket.basePrice}
                      onChange={(e) => {
                        const next = [...ticketTypes]
                        next[i] = { ...next[i], basePrice: e.target.value }
                        setTicketTypes(next)
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`ticketQty${i}`}>Total Quantity</Label>
                    <Input
                      id={`ticketQty${i}`}
                      name={`ticketTypes[${i}][quantityTotal]`}
                      type="number"
                      min="1"
                      value={ticket.quantityTotal}
                      onChange={(e) => {
                        const next = [...ticketTypes]
                        next[i] = { ...next[i], quantityTotal: e.target.value }
                        setTicketTypes(next)
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`ticketMax${i}`}>Max per Order</Label>
                    <Input
                      id={`ticketMax${i}`}
                      name={`ticketTypes[${i}][maxPerOrder]`}
                      type="number"
                      min="1"
                      value={ticket.maxPerOrder}
                      onChange={(e) => {
                        const next = [...ticketTypes]
                        next[i] = { ...next[i], maxPerOrder: e.target.value }
                        setTicketTypes(next)
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`ticketDesc${i}`}>Description (optional)</Label>
                  <Input
                    id={`ticketDesc${i}`}
                    name={`ticketTypes[${i}][description]`}
                    value={ticket.description}
                    onChange={(e) => {
                      const next = [...ticketTypes]
                        next[i] = { ...next[i], description: e.target.value }
                        setTicketTypes(next)
                      }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Review</h2>
            <div className="p-4 border rounded-lg space-y-2 text-sm">
              <p className="text-muted-foreground">Ready to submit. Review your details then click the button below.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
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
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create Event'}
            </Button>
          )}
        </div>
      </>
    )
  }
}
