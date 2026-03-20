'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/register'

type Props = {
  defaultRole?: 'JOUEUR' | 'AGENT'
  defaultTenantSlug?: string
}

export function RegisterForm({ defaultRole = 'JOUEUR', defaultTenantSlug = 'dev' }: Props) {
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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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
        <p className="font-semibold text-base">✅ Compte créé avec succès !</p>
        {form.isMinor && (
          <p>
            Votre profil restera non-public jusqu&apos;à validation du consentement parental par notre équipe.
          </p>
        )}
        <p>Un email de confirmation vous a été envoyé à <strong>{form.email}</strong>.</p>
        <button
          onClick={() => router.push('/auth/connexion')}
          className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Se connecter
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm"
      aria-label="Formulaire d'inscription"
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

      {/* Nom */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-name" className="text-sm font-medium">
          Nom complet <span aria-hidden="true">*</span>
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
          placeholder="Jean Dupont"
          suppressHydrationWarning
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-email" className="text-sm font-medium">
          Adresse email <span aria-hidden="true">*</span>
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
          placeholder="jean@example.com"
          suppressHydrationWarning
        />
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-password" className="text-sm font-medium">
          Mot de passe <span aria-hidden="true">*</span>
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
          Minimum 8 caractères
        </p>
      </div>

      {/* Rôle */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reg-role" className="text-sm font-medium">
          Je suis <span aria-hidden="true">*</span>
        </label>
        <select
          id="reg-role"
          required
          aria-required="true"
          value={form.role}
          onChange={(e) => set('role', e.target.value as 'JOUEUR' | 'AGENT')}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        >
          <option value="JOUEUR">Joueur (talent)</option>
          <option value="AGENT">Agent (recruteur)</option>
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
          Je suis mineur(e) de moins de 18 ans
        </label>
      </div>

      {/* Section consentement parental */}
      {form.isMinor && (
        <div
          role="region"
          aria-labelledby="parental-consent-heading"
          className="rounded-md border border-amber-300 bg-amber-50 px-4 py-4 space-y-3"
        >
          <h2
            id="parental-consent-heading"
            className="text-sm font-semibold text-amber-900"
          >
            Consentement parental requis
          </h2>
          <p id="reg-minor-desc" className="text-xs text-amber-800">
            Votre profil restera non-public tant que le consentement parental n&apos;aura pas été validé.
            Téléchargez le formulaire, faites-le signer par votre représentant légal, puis envoyez-le à notre équipe.
          </p>
          <a
            href="/api/consentement-parental"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Télécharger le formulaire de consentement parental (ouvre un nouvel onglet)"
            className="inline-block rounded-md border border-amber-600 bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            📄 Télécharger le formulaire PDF
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
              J&apos;ai pris connaissance du formulaire et mon représentant légal a donné son accord pour la création de ce compte <span aria-hidden="true">*</span>
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {loading ? 'Création du compte...' : 'Créer mon compte'}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Déjà un compte ?{' '}
        <a href="/auth/connexion" className="underline hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary rounded">
          Se connecter
        </a>
      </p>
    </form>
  )
}
