'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-9 w-9" aria-hidden="true" />

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-pressed={isDark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      suppressHydrationWarning
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
