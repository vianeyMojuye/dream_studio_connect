import { describe, it, expect } from 'vitest'
import { locales, defaultLocale } from '@/i18n/config'

describe('i18n config', () => {
  it('T1 — locales contient fr et en', () => {
    expect(locales).toContain('fr')
    expect(locales).toContain('en')
  })

  it('T2 — defaultLocale est fr', () => {
    expect(defaultLocale).toBe('fr')
  })

  it('T3 — messages fr.json existent et ont les clés auth', async () => {
    const fr = await import('../../messages/fr.json')
    expect(fr.auth).toBeDefined()
    expect(fr.auth.connexion.submit).toBe('Se connecter')
    expect(fr.preferences.theme).toBe('Thème')
  })

  it('T4 — messages en.json existent et ont les clés auth', async () => {
    const en = await import('../../messages/en.json')
    expect(en.auth).toBeDefined()
    expect(en.auth.connexion.submit).toBe('Sign in')
    expect(en.preferences.theme).toBe('Theme')
  })

  it('T5 — les deux fichiers ont les mêmes clés de premier niveau', async () => {
    const fr = await import('../../messages/fr.json')
    const en = await import('../../messages/en.json')
    expect(Object.keys(fr)).toEqual(Object.keys(en))
  })
})
