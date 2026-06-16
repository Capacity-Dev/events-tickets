export default function OrganizerAnalytics({ event }: { event: any }) {
  const totalSold = event.ticketTypes?.reduce((s: number, t: any) => s + (t.quantitySold ?? 0), 0) ?? 0
  const totalCapacity = event.ticketTypes?.reduce((s: number, t: any) => s + t.quantityTotal, 0) ?? 0
  const revenue = event.ticketTypes?.reduce((s: number, t: any) => s + (t.quantitySold ?? 0) * Number(t.basePrice), 0) ?? 0

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{event.title} — Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Tickets Sold</p>
          <p className="text-3xl font-heading mt-1">{totalSold} / {totalCapacity}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-3xl font-heading mt-1">${revenue.toFixed(2)}</p>
        </div>
        <div className="border rounded-xl p-5 bg-card">
          <p className="text-sm text-muted-foreground">Fill Rate</p>
          <p className="text-3xl font-heading mt-1">{totalCapacity ? Math.round(totalSold / totalCapacity * 100) : 0}%</p>
        </div>
      </div>

      <div className="border rounded-xl p-5 bg-card">
        <h2 className="text-lg font-semibold mb-4">Tickets by Type</h2>
        <div className="space-y-3">
          {event.ticketTypes?.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between text-sm">
              <span className="font-medium">{t.name}</span>
              <span className="text-muted-foreground">{t.quantitySold ?? 0} / {t.quantityTotal} sold</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
