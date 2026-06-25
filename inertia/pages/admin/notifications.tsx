import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { toast } from 'sonner'

interface Props {
  templates: any[]
  connectionStatus: { isConnected: boolean; status: string; qrCode: string | null }
  settings: Record<string, string>
  adminPrefix: string
}

export default function Notifications({
  templates,
  connectionStatus: initialStatus,
  settings,
  adminPrefix,
}: Props) {
  const [connectionStatus, setConnectionStatus] = useState(initialStatus)
  const [polling, setPolling] = useState(false)
  const [provider, setProvider] = useState(settings.whatsapp_provider ?? 'baileys')

  const [notifyPurchaseWhatsapp, setNotifyPurchaseWhatsapp] = useState(
    settings.notify_purchase_whatsapp === '1'
  )
  const [notifyPurchaseEmail, setNotifyPurchaseEmail] = useState(
    settings.notify_purchase_email === '1'
  )
  const [notifyReminder3d, setNotifyReminder3d] = useState(settings.notify_reminder_3d === '1')
  const [notifyReminder1d, setNotifyReminder1d] = useState(settings.notify_reminder_1d === '1')
  const [saving, setSaving] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateCategory, setTemplateCategory] = useState('utility')
  const [templateLanguage, setTemplateLanguage] = useState('en_US')
  const [templateVariables, setTemplateVariables] = useState('')

  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('tab') || 'whatsapp'
    }
    return 'whatsapp'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', tab)
      window.history.replaceState({}, '', url.toString())
    }
  }, [tab])

  useEffect(() => {
    if (connectionStatus.status === 'connecting' && !polling) {
      setPolling(true)
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/${adminPrefix}/whatsapp-settings/status`)
          const data = await res.json()
          setConnectionStatus(data)
          if (data.status !== 'connecting') {
            setPolling(false)
            clearInterval(interval)
          }
        } catch {}
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [connectionStatus.status, polling, adminPrefix])

  const handleConnect = async () => {
    try {
      await (typeof window !== 'undefined' && window)
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `/${adminPrefix}/whatsapp-settings/connect`
      form.innerHTML = '<input type="hidden" name="_method" value="POST" />'
      document.body.appendChild(form)
      form.submit()
    } catch {}
  }

  const handleDisconnect = async () => {
    try {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `/${adminPrefix}/whatsapp-settings/disconnect`
      document.body.appendChild(form)
      form.submit()
    } catch {}
  }

  const handleReset = async () => {
    try {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `/${adminPrefix}/whatsapp-settings/reset`
      document.body.appendChild(form)
      form.submit()
    } catch {}
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/${adminPrefix}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_provider: provider,
          notify_purchase_whatsapp: notifyPurchaseWhatsapp ? '1' : '0',
          notify_purchase_email: notifyPurchaseEmail ? '1' : '0',
          notify_reminder_3d: notifyReminder3d ? '1' : '0',
          notify_reminder_1d: notifyReminder1d ? '1' : '0',
        }),
      })
      if (res.ok) toast.success('Settings saved')
      else toast.error('Failed to save settings')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const res = await fetch(`/${adminPrefix}/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          category: templateCategory,
          languageCode: templateLanguage,
          variables: templateVariables,
        }),
      })
      if (res.redirected) {
        window.location.href = res.url
        return
      }
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to create template')
      }
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const isConnected = connectionStatus.isConnected
  const isConnecting = connectionStatus.status === 'connecting'
  const statusLabel =
    connectionStatus.status === 'connected'
      ? 'Connected'
      : connectionStatus.status === 'connecting'
        ? 'Connecting...'
        : 'Disconnected'

  const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    connected: 'default',
    connecting: 'secondary',
    disconnected: 'destructive',
  }

  return (
    <div>
      <Head title="Notifications" />

      <h1 className="text-2xl font-heading mb-6">Notifications</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="flex h-10 w-full max-w-xs rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="baileys">Local (Baileys)</option>
                <option value="meta">Meta API</option>
                <option value="disabled">Disabled</option>
              </select>
            </CardContent>
          </Card>

          {provider === 'baileys' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Connection Status
                  <Badge variant={statusVariant[connectionStatus.status] || 'outline'}>
                    {statusLabel}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {isConnected && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    WhatsApp connected
                  </div>
                )}
                {connectionStatus.qrCode && (
                  <img
                    src={connectionStatus.qrCode}
                    alt="WhatsApp QR Code"
                    className="w-64 h-64 rounded-lg border border-border"
                  />
                )}
                {polling && (
                  <p className="text-sm text-muted-foreground">Polling for connection...</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConnect}
                    disabled={isConnected || isConnecting}
                  >
                    Connect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={!isConnected}
                  >
                    Disconnect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-destructive hover:text-destructive"
                  >
                    Reset Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {provider === 'meta' && (
            <Card>
              <CardHeader>
                <CardTitle>Meta API</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Meta WhatsApp Cloud API will be available soon.
                </p>
              </CardContent>
            </Card>
          )}

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">New Template</h3>
                <div className="flex flex-col gap-3 max-w-md">
                  <div>
                    <Label htmlFor="tpl-name">Name</Label>
                    <Input
                      id="tpl-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tpl-category">Category</Label>
                    <select
                      id="tpl-category"
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="utility">Utility</option>
                      <option value="authentication">Authentication</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="tpl-lang">Language Code</Label>
                    <Input
                      id="tpl-lang"
                      value={templateLanguage}
                      onChange={(e) => setTemplateLanguage(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tpl-vars">Variables (JSON array)</Label>
                    <Input
                      id="tpl-vars"
                      value={templateVariables}
                      onChange={(e) => setTemplateVariables(e.target.value)}
                      placeholder='["event_name","ticket_type"]'
                    />
                  </div>
                  <Button onClick={handleCreateTemplate} size="sm">
                    Create Template
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No templates
                        </TableCell>
                      </TableRow>
                    ) : (
                      templates.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.name}</TableCell>
                          <TableCell className="text-sm capitalize">{t.category}</TableCell>
                          <TableCell className="text-sm">{t.languageCode}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                t.status === 'approved'
                                  ? 'default'
                                  : t.status === 'rejected'
                                    ? 'destructive'
                                    : 'outline'
                              }
                            >
                              {t.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </TabsContent>

        <TabsContent value="notifications" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Confirmation d'achat</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoyer une confirmation WhatsApp après achat
                  </p>
                </div>
                <Switch
                  checked={notifyPurchaseWhatsapp}
                  onCheckedChange={setNotifyPurchaseWhatsapp}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoyer un email de confirmation après achat
                  </p>
                </div>
                <Switch checked={notifyPurchaseEmail} onCheckedChange={setNotifyPurchaseEmail} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rappels d'événement</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rappel J-3</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification WhatsApp 3 jours avant l'événement
                  </p>
                </div>
                <Switch checked={notifyReminder3d} onCheckedChange={setNotifyReminder3d} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rappel J-1</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification WhatsApp 1 jour avant l'événement
                  </p>
                </div>
                <Switch checked={notifyReminder1d} onCheckedChange={setNotifyReminder1d} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
