'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  tenantSlug: z.string().min(1, 'Veuillez sélectionner un pays'),
})

type LoginForm = z.infer<typeof loginSchema>

type Tenant = { slug: string; name: string; country: string }

const ROLE_REDIRECT: Record<string, string> = {
  JOUEUR: '/joueur/tableau-de-bord',
  AGENT: '/agent/tableau-de-bord',
  SCOUT: '/scout/tableau-de-bord',
  ADMIN: '/admin/tableau-de-bord',
}

export function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '', tenantSlug: '' })
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/tenants')
      .then((r) => r.json())
      .then((data: Tenant[]) => {
        setTenants(data)
        if (data.length === 1) {
          setForm((f) => ({ ...f, tenantSlug: data[0].slug }))
        }
      })
      .catch(() => {/* silencieux — le champ reste vide */})
  }, [])

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
        if (res?.error === 'ACCOUNT_SUSPENDED') {
          setError('Votre compte a été suspendu. Contactez le support.')
        } else {
          // Message générique — ne révèle pas si l'email existe (AC6)
          setError('Identifiants incorrects. Vérifiez votre email et mot de passe.')
        }
        return
      }

      // Récupérer la session pour rediriger selon le rôle (AC2)
      router.refresh()
      const session = await getSession()
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
        <label htmlFor="tenantSlug" className="text-sm font-medium">
          Pays
        </label>
        <select
          id="tenantSlug"
          required
          value={form.tenantSlug}
          onChange={(e) => setForm((f) => ({ ...f, tenantSlug: e.target.value }))}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        >
          <option value="" disabled>Sélectionnez votre pays...</option>
          {tenants.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name} ({t.country})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="joueur@example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}
