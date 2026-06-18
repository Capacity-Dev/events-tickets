import { useState, useCallback } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'

interface Props {
  event: any
}

interface ScanLog {
  id: string
  ticketNumber: string
  ticketType: string
  buyerName: string
  success: boolean
  error?: string
  checkedInAt?: string
}

export default function OrganizerCheckIn({ event }: Props) {
  const [paused, setPaused] = useState(false)
  const [manualUuid, setManualUuid] = useState('')
  const [lastResult, setLastResult] = useState<null | {
    success: boolean
    message: string
    ticket?: any
  }>(null)
  const [scans, setScans] = useState<ScanLog[]>([])
  const [scanning, setScanning] = useState(false)
  const [scannerError, setScannerError] = useState('')

  const getCsrfToken = useCallback(() => {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : ''
  }, [])

  const doScan = useCallback(
    async (uuid: string) => {
      setScanning(true)
      setLastResult(null)
      try {
        const res = await fetch(`/dashboard/check-in/${event.id}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
          body: JSON.stringify({ ticketUuid: uuid }),
        })
        const data = await res.json()

        if (data.success && data.ticket) {
          setLastResult({ success: true, message: 'Ticket validated', ticket: data.ticket })
          setScans((prev) => [
            {
              id: data.ticket.uuid,
              ticketNumber: data.ticket.ticketNumber,
              ticketType: data.ticket.ticketType,
              buyerName: data.ticket.buyerName,
              success: true,
              checkedInAt: data.ticket.checkedInAt,
            },
            ...prev.slice(0, 99),
          ])
        } else {
          setLastResult({ success: false, message: data.error || 'Invalid ticket' })
          setScans((prev) => [
            {
              id: uuid,
              ticketNumber: '—',
              ticketType: '—',
              buyerName: '—',
              success: false,
              error: data.error || 'Unknown error',
            },
            ...prev.slice(0, 99),
          ])
        }

        setManualUuid('')
      } catch {
        setLastResult({ success: false, message: 'Network error. Try again.' })
      }
      setScanning(false)
    },
    [event.id, getCsrfToken]
  )

  const handleScan = useCallback(
    (codes: any[]) => {
      if (paused || scanning) return
      const code = codes[0]?.rawValue?.trim()
      if (!code) return
      let uuid = code
      if (uuid.includes('/tickets/')) {
        uuid = uuid.split('/tickets/').pop()!.split('?')[0]
      }
      setPaused(true)
      doScan(uuid)
    },
    [paused, scanning, doScan]
  )

  const handleDismiss = () => {
    setLastResult(null)
    setPaused(false)
  }

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!manualUuid.trim() || scanning) return
      doScan(manualUuid.trim())
    },
    [manualUuid, scanning, doScan]
  )

  const checkedIn = scans.filter((s) => s.success).length

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading">Check-in</h1>
          <p className="text-sm text-muted-foreground mt-1">{event.title}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Checked in</p>
          <p className="text-xl font-heading">{checkedIn}</p>
        </div>
      </div>

      {lastResult && (
        <div
          className={`border rounded-xl p-4 mb-6 ${
            lastResult.success
              ? 'border-success bg-success/5'
              : 'border-destructive bg-destructive/5'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {lastResult.success ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--destructive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${lastResult.success ? 'text-success' : 'text-destructive'}`}>
                {lastResult.message}
              </p>
              {lastResult.ticket && (
                <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                  <p>{lastResult.ticket.ticketNumber} &middot; {lastResult.ticket.ticketType}</p>
                  <p>{lastResult.ticket.buyerName}</p>
                  {lastResult.ticket.buyerEmail && (
                    <p className="text-xs">{lastResult.ticket.buyerEmail}</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer p-1"
              aria-label="Dismiss"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <Scanner
          constraints={{ facingMode: 'environment' }}
          paused={paused}
          onScan={handleScan}
          onError={(err: any) => setScannerError(err?.message ?? '')}
          formats={['qr_code']}
          components={{ finder: true, onOff: true }}
          styles={{ container: { borderRadius: '12px', overflow: 'hidden' } }}
        />
        {scannerError && (
          <p className="text-xs text-muted-foreground mt-1 text-center">{scannerError}</p>
        )}
      </div>

      <div className="border rounded-xl bg-card overflow-hidden mb-6">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="font-semibold text-sm">Manual Entry</h2>
        </div>
        <form onSubmit={handleManualSubmit} className="p-4 flex gap-2">
          <input
            type="text"
            value={manualUuid}
            onChange={(e) => setManualUuid(e.target.value)}
            placeholder="Ticket UUID or /tickets/xxx"
            className="input-field min-h-10 flex-1 text-sm"
          />
          <button type="submit" disabled={scanning || !manualUuid.trim()} className="btn-primary btn-sm">
            Validate
          </button>
        </form>
      </div>

      {scans.length > 0 && (
        <div className="border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent Scans</h2>
            <span className="text-xs text-muted-foreground">{scans.length} scans</span>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {scans.map((s, i) => (
              <div
                key={s.id + '-' + i}
                className={`p-3 flex items-center gap-3 text-sm ${
                  s.success ? '' : 'bg-destructive/5'
                }`}
              >
                <div
                  className={`flex-shrink-0 size-2 rounded-full ${
                    s.success ? 'bg-success' : 'bg-destructive'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{s.ticketNumber}</span>
                    <span className="text-muted-foreground">{s.ticketType}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.success ? s.buyerName : s.error}
                  </div>
                </div>
                {s.success && s.checkedInAt && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(s.checkedInAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
