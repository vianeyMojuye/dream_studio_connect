'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { registerUser } from '@/lib/register'

type Tenant = { slug: string; name: string; country: string }

type Props = {
  defaultRole?: 'JOUEUR' | 'AGENT'
  defaultTenantSlug?: string
}

export function RegisterForm({ defaultRole = 'JOUEUR', defaultTenantSlug = '' }: Props) {
  const t = useTranslations('auth.inscription')
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole as 'JOUEUR' | 'AGENT',
    tenantSlug: defaultTenantSlug,
    isMinor: false,
    parentalConsentGiven: false,
  })
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/tenants')
      .then((r) => r.json())
      .then((data: Tenant[]) => {
        setTenants(data)
        setForm((f) => {
          // Si aucun slug par défaut n'est fourni, on prend le premier tenant de la liste
          if (!f.tenantSlug && data.length > 0) {
            return { ...f, tenantSlug: data[0].slug }
          }
          return f
        })
      })
      .catch(() => {})
  }, [])

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await registerUser(form)
      if (!result.success) {
        setError(result.error)
        return
      }
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-md bg-green-50 border border-green-200 px-6 py-5 text-sm text-green-800 space-y-3"
      >
        <p className="font-semibold text-base">✅ {t('success_title')}</p>
        {form.isMinor && <p>{t('success_minor')}</p>}
        <p>{t('success_email')} <strong>{form.email}</strong>.</p>
        <button
          onClick={() => router.push('/auth/connexion')}
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('success_login')}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm"
      aria-label={t('title')}
      noValidate
    >
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Pays */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-tenant" className="text-sm font-medium">
          {t('country')} <span aria-hidden="true">*</span>
        </label>
        <select
          id="reg-tenant"
          required
          aria-required="true"
          value={form.tenantSlug}
          onChange={(e) => set('tenantSlug', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          suppressHydrationWarning
        >
          <option value="" disabled>{t('country_placeholder')}</option>
          {tenants.map((ten) => (
            <option key={ten.slug} value={ten.slug}>
              {ten.name} ({ten.slug})
            </option>
          ))}
        </select>
      </div>

      {/* Nom */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-name" className="text-sm font-medium">
          {t('name')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="reg-name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          suppressHydrationWarning
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-email" className="text-sm font-medium">
          {t('email')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          suppressHydrationWarning
        />
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-password" className="text-sm font-medium">
          {t('password')} <span aria-hidden="true">*</span>
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          aria-describedby="reg-password-hint"
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          suppressHydrationWarning
        />
        <p id="reg-password-hint" className="text-xs text-muted-foreground">
          {t('password_hint')}
        </p>
      </div>

      {/* Rôle */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-role" className="text-sm font-medium">
          {t('role')} <span aria-hidden="true">*</span>
        </label>
        <select
          id="reg-role"
          required
          aria-required="true"
          value={form.role}
          onChange={(e) => set('role', e.target.value as 'JOUEUR' | 'AGENT')}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          suppressHydrationWarning
        >
          <option value="JOUEUR">{t('role_joueur')}</option>
          <option value="AGENT">{t('role_agent')}</option>
        </select>
      </div>

      {/* Déclaration mineur */}
      <div className="flex items-start gap-2">
        <input
          id="reg-minor"
          type="checkbox"
          aria-describedby="reg-minor-desc"
          checked={form.isMinor}
          onChange={(e) => set('isMinor', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border focus:ring-2 focus:ring-primary"
          suppressHydrationWarning
        />
        <label htmlFor="reg-minor" className="text-sm">
          {t('is_minor')}
        </label>
      </div>

      {/* Section consentement parental */}
      {form.isMinor && (
        <div
          role="region"
          aria-labelledby="parental-consent-heading"
          className="rounded-md border border-amber-300 bg-amber-50 px-4 py-4 space-y-3"
        >
          <h2 id="parental-consent-heading" className="text-sm font-semibold text-amber-900">
            {t('consent_title')}
          </h2>
          <p id="reg-minor-desc" className="text-xs text-amber-800">
            {t('consent_desc')}
          </p>
          <a
            href="/api/consentement-parental"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('consent_pdf_aria')}
            className="inline-block rounded-md border border-amber-600 bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            📄 {t('consent_pdf')}
          </a>
          <div className="flex items-start gap-2">
            <input
              id="reg-parental-consent"
              type="checkbox"
              required
              aria-required="true"
              checked={form.parentalConsentGiven}
              onChange={(e) => set('parentalConsentGiven', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border focus:ring-2 focus:ring-primary"
              suppressHydrationWarning
            />
            <label htmlFor="reg-parental-consent" className="text-xs text-amber-800">
              {t('consent_check')} <span aria-hidden="true">*</span>
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {loading ? t('loading') : t('submit')}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        {t('has_account')}{' '}
        <a href="/auth/connexion" className="underline hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary rounded">
          {t('login_link')}
        </a>
      </p>
    </form>
  )
}
