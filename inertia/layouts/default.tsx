import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import { useTranslation } from '~/lib/i18n'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()
  const { t } = useTranslation()
  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  return (
    <>
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto flex h-14 items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <Link route="home" className="flex items-center gap-2 no-underline">
              <svg
                width="120"
                height="24"
                viewBox="0 0 195 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M180 37.5v-30h-7.5V0H195v7.5h-7.5v30H180ZM150 15V7.5h-15V0h15v7.5h7.5V15H150Zm-15 22.5V30h-7.5V7.5h7.5V30h15v7.5h-15Zm15-7.5v-7.5h7.5V30H150ZM82.5 37.5v-30H90V0h15v7.5h7.5v30H105v-15H90v15h-7.5ZM90 15h15V7.8H90V15ZM45 37.5V0h22.5v7.5h-15V15h15v7.5h-15V30h15v7.5H45ZM0 37.5V0h22.5v7.5H30V15h-7.5v15H30v7.5h-7.5V30H15v-7.5H7.5v15H0ZM7.5 15h14.7V7.5H7.5V15Z"
                  fill="currentColor"
                />
              </svg>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/events"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors no-underline"
              >
                {t('nav.browse')}
              </Link>
              {children.props.user && (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors no-underline"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    href="/dashboard/tickets"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors no-underline"
                  >
                    {t('nav.my_tickets')}
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors no-underline"
                  >
                    {t('nav.my_orders')}
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {children.props.user ? (
              <>
                <span className="hidden sm:inline-flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {children.props.user.initials ?? t('common.user_initial_fallback')}
                </span>
                <Form route="session.destroy">
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {t('common.logout')}
                  </button>
                </Form>
              </>
            ) : (
              <>
                <Link
                  route="session.create"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors no-underline"
                >
                  {t('nav.signin')}
                </Link>
                <Link
                  route="new_account.create"
                  className="px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors no-underline"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
