import { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import { useTranslation } from '~/lib/i18n'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

export default function AdminWhatsAppSettings({ status: initialStatus }: { status: any }) {
  const { t } = useTranslation()
  const { adminPrefix } = usePage().props as any
  const [status, setStatus] = useState(initialStatus)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    if (status.status === 'connecting') {
      setPolling(true)
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/${adminPrefix}/whatsapp-settings/status`)
          const data = await res.json()
          setStatus(data)
          if (data.status !== 'connecting') {
            clearInterval(interval)
            setPolling(false)
          }
        } catch {}
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [status.status, adminPrefix])

  const handleConnect = () => {
    router.post(`/${adminPrefix}/whatsapp-settings/connect`)
  }

  const handleDisconnect = () => {
    router.post(`/${adminPrefix}/whatsapp-settings/disconnect`)
  }

  const handleReset = () => {
    router.post(`/${adminPrefix}/whatsapp-settings/reset`)
  }

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('admin.whatsapp_settings.title')}</h1>

      <div className="flex flex-col gap-6 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.whatsapp_settings.connection_status')}</CardTitle>
            <CardDescription>{t('admin.whatsapp_settings.scan_qr')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{t('admin.whatsapp_settings.status_label')}</span>
              <Badge
                variant={
                  status.status === 'connected'
                    ? 'default'
                    : status.status === 'connecting'
                      ? 'outline'
                      : 'destructive'
                }
              >
                {status.status === 'connected'
                  ? t('admin.whatsapp_settings.connected')
                  : status.status === 'connecting'
                    ? t('admin.whatsapp_settings.connecting')
                    : t('admin.whatsapp_settings.disconnected')}
              </Badge>
              {status.isConnected && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-success"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>

            {status.qrCode && (
              <div className="border border-border rounded-xl p-4 bg-background">
                <p className="text-sm text-muted-foreground mb-3">
                  {t('admin.whatsapp_settings.scan_qr_hint')}
                </p>
                <img src={status.qrCode} alt="WhatsApp QR Code" className="w-64 h-64 mx-auto" />
              </div>
            )}

            <Separator />

            <div className="flex gap-2">
              <Button
                onClick={handleConnect}
                disabled={status.status === 'connected' || status.status === 'connecting'}
                variant="default"
                size="sm"
              >
                {t('admin.whatsapp_settings.connect')}
              </Button>
              <Button
                onClick={handleDisconnect}
                disabled={status.status !== 'connected'}
                variant="outline"
                size="sm"
              >
                {t('admin.whatsapp_settings.disconnect')}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="text-destructive"
              >
                {t('admin.whatsapp_settings.reset_session')}
              </Button>
            </div>

            {polling && <p className="text-xs text-muted-foreground">{t('admin.whatsapp_settings.polling')}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
