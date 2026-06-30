import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
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
import { TemplateEditor } from '~/components/email_editor'
import { WhatsAppEditor } from '~/components/whatsapp_editor'
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
  const { t } = useTranslation()
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
  const [templateChannel, setTemplateChannel] = useState('whatsapp')

  const [editingEmail, setEditingEmail] = useState<any>(null)
  const [editingWhatsApp, setEditingWhatsApp] = useState<any>(null)

  const whatsappTemplates = templates.filter((t) => !t.channel || t.channel === 'whatsapp')
  const emailTemplates = templates.filter((t) => t.channel === 'email')

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

  const handleConnect = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `/${adminPrefix}/whatsapp-settings/connect`
    document.body.appendChild(form)
    form.submit()
  }

  const handleDisconnect = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `/${adminPrefix}/whatsapp-settings/disconnect`
    document.body.appendChild(form)
    form.submit()
  }

  const handleReset = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `/${adminPrefix}/whatsapp-settings/reset`
    document.body.appendChild(form)
    form.submit()
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
      if (res.ok) toast.success(t('admin.notifications.settings_saved'))
      else toast.error(t('admin.notifications.settings_save_failed'))
    } catch {
      toast.error(t('admin.notifications.settings_save_failed'))
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
          channel: templateChannel,
        }),
      })
      if (res.redirected) {
        window.location.href = res.url
        return
      }
      if (!res.ok) throw new Error('Failed to create template')
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const isConnected = connectionStatus.isConnected
  const isConnecting = connectionStatus.status === 'connecting'
  const statusLabel =
    connectionStatus.status === 'connected'
      ? t('admin.notifications.connected')
      : connectionStatus.status === 'connecting'
        ? t('admin.notifications.connecting')
        : t('admin.notifications.disconnected')

  const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    connected: 'default',
    connecting: 'secondary',
    disconnected: 'destructive',
  }

  return (
    <div>
      <Head title={t('admin.notifications.title')} />

      <h1 className="text-2xl font-heading mb-6">{t('admin.notifications.title')}</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="whatsapp">{t('admin.notifications.whatsapp')}</TabsTrigger>
          <TabsTrigger value="email">{t('admin.notifications.email')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('admin.notifications.notifications_tab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.notifications.provider')}</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="flex h-10 w-full max-w-xs rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="baileys">{t('admin.notifications.provider_baileys')}</option>
                <option value="meta">{t('admin.notifications.provider_meta')}</option>
                <option value="disabled">{t('admin.notifications.provider_disabled')}</option>
              </select>
            </CardContent>
          </Card>

          {provider === 'baileys' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {t('admin.notifications.connection_status')}
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
                    {t('admin.notifications.whatsapp_connected')}
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
                  <p className="text-sm text-muted-foreground">{t('admin.notifications.polling')}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConnect}
                    disabled={isConnected || isConnecting}
                  >
                    {t('admin.notifications.connect')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={!isConnected}
                  >
                    {t('admin.notifications.disconnect')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-destructive hover:text-destructive"
                  >
                    {t('admin.notifications.reset_session')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {provider === 'meta' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.notifications.provider_meta')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('admin.notifications.meta_coming_soon')}
                </p>
              </CardContent>
            </Card>
          )}

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.notifications.whatsapp_templates')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">{t('admin.notifications.new_template')}</h3>
                <div className="flex flex-col gap-3 max-w-md">
                  <div>
                    <Label htmlFor="tpl-name">{t('common.name')}</Label>
                    <Input
                      id="tpl-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tpl-category">{t('admin.notifications.category')}</Label>
                    <select
                      id="tpl-category"
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="utility">{t('admin.notifications.category_utility')}</option>
                      <option value="authentication">{t('admin.notifications.category_authentication')}</option>
                      <option value="marketing">{t('admin.notifications.category_marketing')}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="tpl-lang">{t('admin.notifications.language_code')}</Label>
                    <Input
                      id="tpl-lang"
                      value={templateLanguage}
                      onChange={(e) => setTemplateLanguage(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tpl-vars">{t('admin.notifications.variables_json')}</Label>
                    <Input
                      id="tpl-vars"
                      value={templateVariables}
                      onChange={(e) => setTemplateVariables(e.target.value)}
                      placeholder='["event_name","ticket_type"]'
                    />
                  </div>
                  <Button onClick={handleCreateTemplate} size="sm">
                    {t('admin.notifications.create_template')}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.name')}</TableHead>
                      <TableHead>{t('admin.notifications.type')}</TableHead>
                      <TableHead>{t('admin.notifications.category')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whatsappTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {t('admin.notifications.no_templates')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      whatsappTemplates.map((tpl) => (
                        <TableRow key={tpl.id}>
                          <TableCell className="font-medium">{tpl.name}</TableCell>
                          <TableCell className="text-sm capitalize">{tpl.type}</TableCell>
                          <TableCell className="text-sm capitalize">{tpl.category}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tpl.status === 'approved'
                                  ? 'default'
                                  : tpl.status === 'rejected'
                                    ? 'destructive'
                                    : 'outline'
                              }
                            >
                              {tpl.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingWhatsApp(tpl)}
                            >
                              {t('common.edit')}
                            </Button>
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
            {saving ? t('common.saving') : t('admin.notifications.save_settings')}
          </Button>
        </TabsContent>

        <TabsContent value="email" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.notifications.email_templates')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">{t('admin.notifications.new_email_template')}</h3>
                <div className="flex flex-col gap-3 max-w-md">
                  <div>
                    <Label htmlFor="email-tpl-name">{t('common.name')}</Label>
                    <Input
                      id="email-tpl-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-tpl-type">{t('admin.notifications.type')}</Label>
                    <select
                      id="email-tpl-type"
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="purchase_confirmation">{t('admin.notifications.type_purchase_confirmation')}</option>
                      <option value="reminder_3d">{t('admin.notifications.type_reminder_3d')}</option>
                      <option value="reminder_1d">{t('admin.notifications.type_reminder_1d')}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="email-tpl-lang">{t('admin.notifications.language_code')}</Label>
                    <Input
                      id="email-tpl-lang"
                      value={templateLanguage}
                      onChange={(e) => setTemplateLanguage(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      setTemplateChannel('email')
                      await handleCreateTemplate()
                    }}
                    size="sm"
                  >
                    {t('admin.notifications.create_template')}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.name')}</TableHead>
                      <TableHead>{t('admin.notifications.type')}</TableHead>
                      <TableHead>{t('admin.notifications.subject')}</TableHead>
                      <TableHead>{t('admin.notifications.language')}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {t('admin.notifications.no_email_templates')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      emailTemplates.map((tpl) => (
                        <TableRow key={tpl.id}>
                          <TableCell className="font-medium">{tpl.name}</TableCell>
                          <TableCell className="text-sm capitalize">{tpl.type}</TableCell>
                          <TableCell className="text-sm">{tpl.subject || '—'}</TableCell>
                          <TableCell className="text-sm">{tpl.languageCode}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => setEditingEmail(tpl)}>
                              {t('common.edit')}
                            </Button>
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
            {saving ? t('common.saving') : t('admin.notifications.save_settings')}
          </Button>
        </TabsContent>

        <TabsContent value="notifications" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.notifications.purchase_confirmation')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('admin.notifications.whatsapp_channel')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.notifications.whatsapp_purchase_desc')}
                  </p>
                </div>
                <Switch
                  checked={notifyPurchaseWhatsapp}
                  onCheckedChange={setNotifyPurchaseWhatsapp}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('admin.notifications.email')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.notifications.email_purchase_desc')}
                  </p>
                </div>
                <Switch checked={notifyPurchaseEmail} onCheckedChange={setNotifyPurchaseEmail} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.notifications.event_reminders')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('admin.notifications.reminder_3d')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.notifications.reminder_3d_desc')}
                  </p>
                </div>
                <Switch checked={notifyReminder3d} onCheckedChange={setNotifyReminder3d} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('admin.notifications.reminder_1d')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.notifications.reminder_1d_desc')}
                  </p>
                </div>
                <Switch checked={notifyReminder1d} onCheckedChange={setNotifyReminder1d} />
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? t('common.saving') : t('admin.notifications.save_settings')}
          </Button>
        </TabsContent>
      </Tabs>

      {editingEmail && (
        <TemplateEditor
          open={true}
          onClose={() => setEditingEmail(null)}
          template={editingEmail}
          adminPrefix={adminPrefix}
          onSaved={() => {
            window.location.reload()
          }}
        />
      )}
      {editingWhatsApp && (
        <WhatsAppEditor
          open={true}
          onClose={() => setEditingWhatsApp(null)}
          template={editingWhatsApp}
          adminPrefix={adminPrefix}
          onSaved={() => {
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
