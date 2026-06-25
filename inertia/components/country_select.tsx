import { useState, useRef, useEffect } from 'react'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const COUNTRIES = [
  { code: 'CD', name: 'République Démocratique du Congo' },
  { code: 'CG', name: 'Congo Brazzaville' },
  { code: 'AO', name: 'Angola' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'CF', name: 'République Centrafricaine' },
  { code: 'TD', name: 'Tchad' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'GQ', name: 'Guinée Équatoriale' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GN', name: 'Guinée' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LR', name: 'Libéria' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'ML', name: 'Mali' },
  { code: 'MA', name: 'Maroc' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibie' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigéria' },
  { code: 'UG', name: 'Ouganda' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'SS', name: 'Soudan du Sud' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'TG', name: 'Togo' },
  { code: 'ZM', name: 'Zambie' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'GW', name: 'Guinée-Bissau' },
  { code: 'MU', name: 'Maurice' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MR', name: 'Mauritanie' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'CA', name: 'Canada (Québec)' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'LB', name: 'Liban' },
  { code: 'HT', name: 'Haïti' },
  { code: 'RE', name: 'La Réunion' },
]

interface CountrySelectProps {
  selected: string[]
  onChange: (codes: string[]) => void
}

export function CountrySelect({ selected, onChange }: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (code: string) => {
    if (selected.includes(code)) {
      onChange(selected.filter((c) => c !== code))
    } else {
      onChange([...selected, code])
    }
  }

  const remove = (code: string) => {
    onChange(selected.filter((c) => c !== code))
  }

  const selectedNames = COUNTRIES.filter((c) => selected.includes(c.code))

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center min-h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          selected.length === 0 && 'text-muted-foreground',
          open && 'border-ring'
        )}
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">Select countries...</span>
        ) : (
          <div className="flex gap-1 flex-wrap">
            {selectedNames.map((c) => (
              <span
                key={c.code}
                className="inline-flex items-center gap-1 rounded bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium"
              >
                {c.name.slice(0, 12)}
                {c.name.length > 12 ? '…' : ''}
              </span>
            ))}
          </div>
        )}
        <svg
          className={cn(
            'ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform',
            open && 'rotate-180'
          )}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 border-b">
            <Input
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
          </div>
          {selected.length > 0 && (
            <div
              className="flex gap-1 flex-wrap p-2 border-b max-h-24 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedNames.map((c) => (
                <Badge
                  key={c.code}
                  variant="default"
                  className="cursor-pointer gap-1 pr-1 text-xs"
                  onClick={() => remove(c.code)}
                >
                  {c.name.slice(0, 10)}
                  {c.name.length > 10 ? '…' : ''}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hover:text-destructive"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </Badge>
              ))}
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-xs text-muted-foreground hover:text-foreground px-1"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">No countries found</p>
            ) : (
              filtered.map((c) => (
                <label
                  key={c.code}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted text-sm transition-colors',
                    selected.includes(c.code) && 'bg-primary/5'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(c.code)}
                    onChange={() => toggle(c.code)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{c.name}</span>
                  {selected.includes(c.code) && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
