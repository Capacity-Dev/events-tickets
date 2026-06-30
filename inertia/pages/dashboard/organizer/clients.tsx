import { useRef } from 'react'
import { router } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
import { Input } from '~/components/ui/input'
import { formatCurrency, type CurrencyInfo } from '~/lib/currency'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

interface ClientData {
  id: string
  name: string
  email: string | null
  totalSpent: number
  ticketCount: number
  eventCount: number
}

interface EventFilter {
  id: string
  title: string
}

export default function OrganizerClients({
  clients,
  allEvents,
  currencies,
  search,
  eventId,
}: {
  clients: ClientData[]
  allEvents: EventFilter[]
  currencies: CurrencyInfo[]
  search: string
  eventId: string
}) {
  const { t } = useTranslation()
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const doSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params: Record<string, string> = {}
      const val = searchRef.current?.value?.trim()
      if (val) params.search = val
      if (eventId) params.eventId = eventId
      router.get('/dashboard/clients', params, {
        preserveState: true,
        replace: true,
        only: ['clients'],
      })
    }, 300)
  }

  const handleEventFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (e.target.value) params.eventId = e.target.value
    router.get('/dashboard/clients', params, {
      preserveState: true,
      replace: true,
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading">{t('organizer.clients.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clients.length} buyer{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <select
          value={eventId}
          onChange={handleEventFilter}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">{t('organizer.clients.all_events')}</option>
          {allEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <Input
          ref={searchRef}
          type="text"
          placeholder={t('organizer.clients.search_placeholder')}
          defaultValue={search}
          onChange={doSearch}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('organizer.clients.table_name_email')}</TableHead>
              <TableHead className="text-right">{t('organizer.clients.table_tickets')}</TableHead>
              <TableHead className="text-right">
                {t('organizer.clients.table_total_spent')}
              </TableHead>
              <TableHead className="text-right">{t('organizer.clients.table_events')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                  {search || eventId
                    ? t('organizer.clients.no_results')
                    : t('organizer.clients.empty_state')}
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="text-sm">
                    <span className="font-medium">{client.name}</span>
                    {client.email && client.name !== client.email && (
                      <span className="block text-xs text-muted-foreground">{client.email}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm">{client.ticketCount}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(client.totalSpent, undefined, currencies)}
                  </TableCell>
                  <TableCell className="text-right text-sm">{client.eventCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
