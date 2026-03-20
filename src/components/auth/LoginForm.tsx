'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  tenantSlug: z.string().min(1),
})

type LoginFormData = z.infer<typeof loginSchema>

const ROLE_REDIRECT: Record<string, string> = {
  JOUEUR: '/joueur/tableau-de-bord',
  AGENT: '/agent/tableau-de-bord',
  SCOUT: '/scout/tableau-de-bord',
  ADMIN: '/admin/tableau-de-bord',
}

export function LoginForm() {
  const t = useTranslations('auth.connexion')
  const router = useRouter()
  const [form, setForm] = useState<LoginFormData>({ email: '', password: '', tenantSlug: 'dev' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = loginSchema.safeParse(form)
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Données invalides')
      return
    }

    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        tenantSlug: form.tenantSlug,
        redirect: false,
      })

      if (!res?.ok) {
        setError(res?.error === 'ACCOUNT_SUSPENDED' ? t('error_suspended') : t('error_generic'))
        return
      }

      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role as string | undefined
      const redirect = (role && ROLE_REDIRECT[role]) ?? '/'
      router.push(redirect)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">{t('email')}</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          suppressHydrationWarning
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">{t('password')}</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          suppressHydrationWarning
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? t('loading') : t('submit')}
      </button>
    </form>
  )
}
