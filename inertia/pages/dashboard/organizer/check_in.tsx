export default function OrganizerCheckIn({ event }: { event: any }) {
  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-heading mb-2">Check-in</h1>
      <p className="text-sm text-muted-foreground mb-8">{event.title}</p>

      <div className="border-2 border-dashed rounded-xl p-12 mb-6">
        <p className="text-lg font-semibold mb-2">QR Scanner</p>
        <p className="text-sm text-muted-foreground">Camera access will scan QR codes to validate tickets.</p>
      </div>

      <div className="text-left border rounded-xl divide-y">
        <div className="p-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Event</span>
          <span className="font-medium">{event.title}</span>
        </div>
        <div className="p-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className="text-success font-medium">{event.status}</span>
        </div>
      </div>
    </div>
  )
}
