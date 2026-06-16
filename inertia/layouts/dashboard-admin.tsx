import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const navItems = [
  { label: 'Moderation', href: '/admin/events/pending', icon: '📋' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Fee Rules', href: '/admin/fee-rules', icon: '⚙️' },
  { label: 'Finances', href: '/admin/finances', icon: '💰' },
  { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
  { label: 'Homepage', href: '/admin/homepage', icon: '🏠' },
  { label: 'WhatsApp', href: '/admin/whatsapp', icon: '💬' },
]

export default function DashboardAdminLayout({
  children,
}: {
  children: ReactElement<Data.SharedProps>
}) {
  const { url } = usePage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { toast.dismiss() }, [url])
  useEffect(() => {
    if (children.props.flash.error) toast.error(children.props.flash.error)
    if (children.props.flash.success) toast.success(children.props.flash.success)
  })

  return (
    <div className="flex h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col lg:static lg:block max-lg:data-[open=false]:hidden" data-open={sidebarOpen || undefined}>
        <div className="flex h-14 items-center gap-2 px-6 border-b">
          <a href="/" className="font-heading text-lg text-primary no-underline">Admin</a>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline',
                url === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}>
              <span aria-hidden>{item.icon}</span>{item.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t"><p className="text-xs text-muted-foreground">Admin Panel</p></div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <button type="button" aria-label="Toggle sidebar" className="lg:hidden inline-flex items-center justify-center rounded-lg hover:bg-muted size-8" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h14M3 10h14M3 15h14"/></svg>
          </button>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button type="button" className="rounded-full hover:opacity-80">
                <Avatar className="size-8"><AvatarFallback className="text-xs">{children.props.user?.initials ?? 'A'}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem><a href="/" className="block w-full">View Site</a></DropdownMenuItem>
              <DropdownMenuItem>
                <form action="/logout" method="POST" className="w-full">
                  <button type="submit" className="w-full text-left cursor-pointer bg-transparent border-none font-inherit">Logout</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  )
}
