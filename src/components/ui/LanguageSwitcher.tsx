'use client'
import { useUserPreferences } from '@/hooks/useUserPreferences'
import type { Locale } from '@/i18n/config'

const LABELS: Record<Locale, string> = { fr: 'FR', en: 'EN' }
const NEXT: Record<Locale, Locale> = { fr: 'en', en: 'fr' }

export function LanguageSwitcher() {
  const { locale, setLocale, mounted } = useUserPreferences()

  if (!mounted) return <div className="h-9 w-16" aria-hidden="true" />

  const next = NEXT[locale]

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={`Changer la langue vers ${LABELS[next]}`}
      className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      suppressHydrationWarning
    >
      <span aria-hidden="true">🌐</span>
      {LABELS[locale]}
    </button>
  )
}
