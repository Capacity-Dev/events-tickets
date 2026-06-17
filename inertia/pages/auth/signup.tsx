import { router, usePage } from '@inertiajs/react'
import { useRef } from 'react'
import type { SharedProps } from '@adonisjs/inertia/types'

const t = (key: string) => {
  const { locale } = usePage().props as unknown as SharedProps & { locale: 'fr' | 'en' }
  const en: Record<string, string> = {
    'auth.signup_title': 'Sign up',
    'auth.signup_subtitle': 'Create your account',
    'auth.fullname_label': 'Full name',
    'auth.fullname_placeholder': 'Your name',
    'auth.email_label': 'Email',
    'auth.email_placeholder': 'you@example.com',
    'auth.password_label': 'Password',
    'auth.password_placeholder': 'At least 8 characters',
    'auth.confirm_password_label': 'Confirm password',
    'auth.confirm_password_placeholder': 'Repeat password',
    'auth.signup_submit': 'Sign up',
    'auth.google_button': 'Continue with Google',
    'auth.or_email': 'Or continue with email',
    'auth.have_account': 'Already have an account?',
    'auth.signin_link': 'Sign in',
  }
  const fr: Record<string, string> = {
    'auth.signup_title': "S'inscrire",
    'auth.signup_subtitle': 'Créez votre compte',
    'auth.fullname_label': 'Nom complet',
    'auth.fullname_placeholder': 'Votre nom',
    'auth.email_label': 'Email',
    'auth.email_placeholder': 'vous@exemple.com',
    'auth.password_label': 'Mot de passe',
    'auth.password_placeholder': '8 caractères minimum',
    'auth.confirm_password_label': 'Confirmer le mot de passe',
    'auth.confirm_password_placeholder': 'Répétez le mot de passe',
    'auth.signup_submit': "S'inscrire",
    'auth.google_button': 'Continuer avec Google',
    'auth.or_email': 'Ou par email',
    'auth.have_account': 'Déjà un compte ?',
    'auth.signin_link': 'Se connecter',
  }
  return locale === 'fr' ? (fr[key] ?? key) : (en[key] ?? key)
}

export default function Signup() {
  const fullNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/signup', {
      fullName: fullNameRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
      passwordConfirmation: confirmRef.current?.value ?? '',
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-heading">{t('auth.signup_title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('auth.signup_subtitle')}</p>
        </div>

        <a
          href="/auth/google"
          className="flex items-center justify-center gap-3 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors no-underline"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t('auth.google_button')}
        </a>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('auth.or_email')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">
              {t('auth.fullname_label')}
            </label>
            <input
              ref={fullNameRef}
              type="text"
              name="fullName"
              id="fullName"
              autoComplete="name"
              placeholder={t('auth.fullname_placeholder')}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              {t('auth.email_label')}
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder={t('auth.email_placeholder')}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              {t('auth.password_label')}
            </label>
            <input
              ref={passwordRef}
              type="password"
              name="password"
              id="password"
              autoComplete="new-password"
              placeholder={t('auth.password_placeholder')}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirmation" className="text-sm font-medium">
              {t('auth.confirm_password_label')}
            </label>
            <input
              ref={confirmRef}
              type="password"
              name="passwordConfirmation"
              id="passwordConfirmation"
              autoComplete="new-password"
              placeholder={t('auth.confirm_password_placeholder')}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground h-10 text-sm font-medium hover:bg-primary/80 transition-colors border-none cursor-pointer"
          >
            {t('auth.signup_submit')}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t('auth.have_account')}{' '}
          <a href="/login" className="text-primary font-medium hover:underline">
            {t('auth.signin_link')}
          </a>
        </p>
      </div>
    </div>
  )
}
