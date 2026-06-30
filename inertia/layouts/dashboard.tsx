import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { router, usePage } from '@inertiajs/react'
import { type ReactElement, useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useTranslation } from '~/lib/i18n'

export default function DashboardLayout({
  children,
}: {
  children: ReactElement<Data.SharedProps>
}) {
  const { url, props } = usePage() as any
  const { t } = useTranslation()
  const isAdmin = props.isAdmin
  const adminPrefix = props.adminPrefix
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    {
      label: t('nav.events'),
      href: '/dashboard/events',
      icon: (
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
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: t('nav.new_event'),
      href: '/dashboard/events/create',
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: t('nav.orders'),
      href: '/dashboard/orders',
      icon: (
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      label: t('nav.my_tickets'),
      href: '/dashboard/tickets',
      icon: (
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
          <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z" />
        </svg>
      ),
    },
    {
      label: t('nav.clients'),
      href: '/dashboard/clients',
      icon: (
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: t('nav.payouts'),
      href: '/dashboard/payouts',
      icon: (
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
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: t('nav.settings'),
      href: '/dashboard/settings',
      icon: (
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
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ]

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) toast.error(children.props.flash.error)
    if (children.props.flash.success) toast.success(children.props.flash.success)
  })

  useEffect(() => {
    setSidebarOpen(false)
  }, [url])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col',
          'transition-transform duration-200 ease-out',
          'max-lg:-translate-x-full',
          sidebarOpen && 'max-lg:translate-x-0',
          'lg:static lg:translate-x-0'
        )}
      >
        <div className="flex h-14 items-center gap-2 px-6 border-b shrink-0">
          <a href="/" className="font-heading text-lg text-primary no-underline">
            {t('common.brand_name')}
          </a>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              url === item.href || (item.href !== '/' && url.startsWith(item.href + '/'))
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label}
              </a>
            )
          })}
        </nav>

        {isAdmin && (
          <div className="p-3 border-t">
            <a
              href={`/${adminPrefix || 'admin'}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors bg-primary/10 text-primary hover:bg-primary/20"
            >
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {t('nav.go_to_admin_dashboard')}
            </a>
          </div>
        )}

        <div className="p-4 border-t shrink-0">
          <p className="text-xs text-muted-foreground">{t('dashboard.sidebar_footer')}</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6 shrink-0">
          <button
            type="button"
            aria-label={t('common.toggle_menu')}
            className="lg:hidden inline-flex items-center justify-center rounded-lg hover:bg-muted size-9"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full hover:opacity-80 transition-opacity"
              aria-label={t('common.user_menu')}
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {children.props.user?.initials ?? t('common.user_initial_fallback')}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {children.props.user?.email ?? ''}
              </div>
              <DropdownMenuSeparator />
              <a
                href="/"
                className="block px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-muted no-underline text-foreground"
              >
                {t('nav.view_site')}
              </a>
              <DropdownMenuSeparator />
              <button
                type="button"
                onClick={() => router.post('/logout')}
                className="w-full text-left px-2 py-1.5 text-sm rounded cursor-pointer bg-transparent border-none font-inherit hover:bg-muted"
              >
                {t('nav.logout')}
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  )
}
