import { useState, useRef } from 'react'
import { useTranslation } from '~/lib/i18n'
import { cn } from '~/lib/utils'
import { Button, buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  UserPlus,
  Mail,
  MessageCircle,
  Trash2,
  Upload,
  Send,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Ticket,
} from 'lucide-react'

interface TicketType {
  id: string
  name: string
  basePrice: string
  quantityTotal: number
  quantitySold: number
}

interface InvitationRow {
  id: string
  guestName: string | null
  guestEmail: string | null
  guestPhone: string | null
  ticketCount: number
  tickets: { ticketNumber: string; uuid: string; status: string }[]
  createdAt: string | null
}

interface GuestEntry {
  key: string
  name: string
  email: string
  phone: string
  sendWhatsApp: boolean
  sendEmail: boolean
}

interface Props {
  event: any
  ticketTypes: TicketType[]
  invitations: InvitationRow[]
}

export default function InviteGuests({ event, ticketTypes, invitations }: Props) {
  const { t } = useTranslation()
  const [selectedTicketType, setSelectedTicketType] = useState(ticketTypes[0]?.id ?? '')
  const [guests, setGuests] = useState<GuestEntry[]>([
    {
      key: crypto.randomUUID(),
      name: '',
      email: '',
      phone: '',
      sendWhatsApp: true,
      sendEmail: false,
    },
  ])
  const [sending, setSending] = useState(false)
  const [lastResult, setLastResult] = useState<{
    success: number
    failed: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateGuest = (key: string, field: keyof GuestEntry, value: string | boolean) => {
    setGuests((prev) => prev.map((g) => (g.key === key ? { ...g, [field]: value } : g)))
    setLastResult(null)
  }

  const addGuest = () => {
    setGuests((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        name: '',
        email: '',
        phone: '',
        sendWhatsApp: true,
        sendEmail: false,
      },
    ])
    setLastResult(null)
  }

  const removeGuest = (key: string) => {
    if (guests.length <= 1) return
    setGuests((prev) => prev.filter((g) => g.key !== key))
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim())
      if (lines.length < 2) {
        toast.error(t('organizer.invite_guests.toast_csv_no_data'))
        return
      }

      const header = lines[0]
        .toLowerCase()
        .split(',')
        .map((h) => h.trim())
      const nameIdx = header.indexOf('name')
      const emailIdx = header.indexOf('email')
      const phoneIdx = header.indexOf('phone')

      if (nameIdx === -1) {
        toast.error(t('organizer.invite_guests.toast_csv_missing_name'))
        return
      }

      const parsed: GuestEntry[] = []
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim())
        if (cols[nameIdx]) {
          parsed.push({
            key: crypto.randomUUID(),
            name: cols[nameIdx] ?? '',
            email: cols[emailIdx] ?? '',
            phone: cols[phoneIdx] ?? '',
            sendWhatsApp: true,
            sendEmail: false,
          })
        }
      }

      if (parsed.length > 0) {
        setGuests(parsed)
        toast.success(t('organizer.invite_guests.toast_csv_loaded', { count: parsed.length }))
      } else {
        toast.error(t('organizer.invite_guests.toast_csv_no_valid_rows'))
      }
    }
    reader.readAsText(file)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getCsrfToken = () => {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : ''
  }

  const handleSend = async () => {
    if (!selectedTicketType) {
      toast.error(t('organizer.invite_guests.toast_select_ticket_type'))
      return
    }

    const validGuests = guests.filter((g) => g.name.trim())
    if (validGuests.length === 0) {
      toast.error(t('organizer.invite_guests.toast_no_guests'))
      return
    }

    setSending(true)
    setLastResult(null)

    try {
      const res = await fetch(`/dashboard/events/${event.id}/invite-guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfToken(),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          ticketTypeId: selectedTicketType,
          guests: validGuests.map((g) => ({
            name: g.name,
            email: g.email || undefined,
            phone: g.phone || undefined,
            sendWhatsApp: g.sendWhatsApp,
            sendEmail: g.sendEmail,
          })),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setLastResult({ success: data.success, failed: data.failed })
        if (data.success > 0) {
          toast.success(t('organizer.invite_guests.toast_sent', { count: data.success }))
          window.location.reload()
        }
        if (data.failed > 0) {
          toast.error(t('organizer.invite_guests.toast_partial_fail', { count: data.failed }))
        }
      } else {
        toast.error(data.error || t('organizer.invite_guests.toast_generic_error'))
      }
    } catch {
      toast.error(t('organizer.invite_guests.toast_network_error'))
    }
    setSending(false)
  }

  const selectedTicket = ticketTypes.find((tt) => tt.id === selectedTicketType)
  const remaining =
    selectedTicket && selectedTicket.quantityTotal > 0
      ? Math.max(0, selectedTicket.quantityTotal - selectedTicket.quantitySold)
      : null

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <a
          href={`/dashboard/events/${event.id}/analytics`}
          className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }), 'shrink-0 w-fit')}
        >
          <ArrowLeft className="size-4" />
          {t('organizer.invite_guests.back_to_analytics')}
        </a>
        <div className="flex-1" />
        <h1 className="text-xl sm:text-2xl font-heading">{t('organizer.invite_guests.title')}</h1>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="hidden"
        />
        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="size-3.5" />
          {t('organizer.invite_guests.import_csv')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('organizer.invite_guests.form_title')}</CardTitle>
              <CardDescription>
                {t('organizer.invite_guests.form_description', {
                  event: event.title,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ticketType">{t('organizer.invite_guests.field_ticket_type')}</Label>
                <select
                  id="ticketType"
                  value={selectedTicketType}
                  onChange={(e) => setSelectedTicketType(e.target.value)}
                  className="mt-1.5 flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {ticketTypes.length === 0 && (
                    <option value="">{t('organizer.invite_guests.no_ticket_types')}</option>
                  )}
                  {ticketTypes.map((tt) => (
                    <option key={tt.id} value={tt.id}>
                      {tt.name}
                      {remaining !== null ? ` (${remaining} left)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <Separator />

              {guests.map((guest, idx) => (
                <div key={guest.key} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('organizer.invite_guests.guest_label', { number: idx + 1 })}
                    </span>
                    {guests.length > 1 && (
                      <Button size="xs" variant="ghost" onClick={() => removeGuest(guest.key)}>
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`name-${guest.key}`}>
                        {t('organizer.invite_guests.field_name')}
                      </Label>
                      <Input
                        id={`name-${guest.key}`}
                        value={guest.name}
                        onChange={(e) => updateGuest(guest.key, 'name', e.target.value)}
                        placeholder={t('organizer.invite_guests.field_name_placeholder')}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`email-${guest.key}`}>
                        {t('organizer.invite_guests.field_email')}
                      </Label>
                      <Input
                        id={`email-${guest.key}`}
                        type="email"
                        value={guest.email}
                        onChange={(e) => updateGuest(guest.key, 'email', e.target.value)}
                        placeholder={t('organizer.invite_guests.field_email_placeholder')}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`phone-${guest.key}`}>
                        {t('organizer.invite_guests.field_phone')}
                      </Label>
                      <Input
                        id={`phone-${guest.key}`}
                        type="tel"
                        value={guest.phone}
                        onChange={(e) => updateGuest(guest.key, 'phone', e.target.value)}
                        placeholder="+237690000000"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Switch
                        checked={guest.sendWhatsApp}
                        onCheckedChange={(v) => updateGuest(guest.key, 'sendWhatsApp', v)}
                      />
                      <MessageCircle className="size-3.5 text-green-600" />
                      {t('organizer.invite_guests.toggle_whatsapp')}
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Switch
                        checked={guest.sendEmail}
                        onCheckedChange={(v) => updateGuest(guest.key, 'sendEmail', v)}
                      />
                      <Mail className="size-3.5 text-blue-600" />
                      {t('organizer.invite_guests.toggle_email')}
                    </label>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addGuest}>
                <UserPlus className="size-3.5" />
                {t('organizer.invite_guests.add_guest')}
              </Button>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t('organizer.invite_guests.guest_count', {
                    count: guests.filter((g) => g.name.trim()).length,
                  })}
                </p>
                <Button
                  onClick={handleSend}
                  disabled={sending || guests.every((g) => !g.name.trim())}
                >
                  {sending ? (
                    t('organizer.invite_guests.sending')
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      {t('organizer.invite_guests.send_invitations')}
                    </>
                  )}
                </Button>
              </div>

              {lastResult && (
                <div
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg text-sm',
                    lastResult.failed > 0
                      ? 'border border-amber-500 bg-amber-500/5 text-amber-700'
                      : 'border border-success bg-success/5 text-success'
                  )}
                >
                  {lastResult.failed > 0 ? (
                    <XCircle className="size-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="size-4 shrink-0" />
                  )}
                  <span>
                    {t('organizer.invite_guests.result_sent', { count: lastResult.success })}
                    {lastResult.failed > 0 &&
                      ` — ${t('organizer.invite_guests.result_failed', { count: lastResult.failed })}`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('organizer.invite_guests.invitation_history')}</CardTitle>
            <CardDescription>
              {t('organizer.invite_guests.invitation_history_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('organizer.invite_guests.table_guest')}</TableHead>
                    <TableHead className="text-right">
                      <Ticket className="size-3.5 inline mr-1" />
                    </TableHead>
                    <TableHead className="text-right">
                      {t('organizer.invite_guests.table_date')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.length > 0 ? (
                    invitations.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="text-sm">
                          <span className="font-medium">{inv.guestName ?? '—'}</span>
                          {inv.guestEmail && (
                            <span className="block text-xs text-muted-foreground truncate max-w-[160px]">
                              {inv.guestEmail}
                            </span>
                          )}
                          {inv.guestPhone && (
                            <span className="block text-xs text-muted-foreground">
                              {inv.guestPhone}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          <Badge variant="outline" className="text-xs">
                            {inv.ticketCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                          {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        {t('organizer.invite_guests.no_invitations')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
