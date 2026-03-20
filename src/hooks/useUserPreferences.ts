'use client'
import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import type { Locale } from '@/i18n/config'
import { defaultLocale, locales } from '@/i18n/config'

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return defaultLocale
  const lang = navigator.language.split('-')[0] as Locale
  return locales.includes(lang) ? lang : defaultLocale
}

export function useUserPreferences() {
  const { theme, setTheme } = useTheme()
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const saved = localStorage.getItem('locale') as Locale | null
    const resolved = saved && locales.includes(saved) ? saved : detectBrowserLocale()
    setLocaleState(resolved)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // Cookie pour SSR (1 an)
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    // Recharge la page pour que le layout server lise le nouveau cookie
    window.location.reload()
  }, [])

  return { locale, setLocale, theme, setTheme, mounted }
}
