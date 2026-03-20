# Story 1.5 — Langue d'interface (FR/EN) & thème dark/light

## Status: in-progress

---

## Story

**En tant qu'** utilisateur,
**je veux** choisir ma langue (FR/EN) et basculer entre thème dark et light,
**afin de** personnaliser mon interface avec mémorisation entre sessions.

---

## Acceptance Criteria

- [x] AC1 — `LanguageSwitcher` bascule FR/EN immédiatement (rechargement page pour SSR)
- [x] AC2 — Préférence langue persistée dans `localStorage` ET cookie `locale` (pour SSR)
- [x] AC3 — Langue par défaut = locale navigateur détectée (`navigator.language`)
- [x] AC4 — `ThemeToggle` dark/light change instantanément via CSS custom properties
- [x] AC5 — Préférence thème persistée dans `localStorage`, respecte `prefers-color-scheme`
- [x] AC6 — Aucune string hardcodée — tout passe par `next-intl` (`useTranslations` / `getTranslations`)

---

## Tasks

- [x] T1 — Installer `next-intl`
- [x] T2 — Créer `messages/fr.json` et `messages/en.json`
- [x] T3 — Créer `src/i18n/config.ts`
- [x] T4 — Créer `src/hooks/useUserPreferences.ts`
- [x] T5 — Créer `src/components/ui/ThemeToggle.tsx`
- [x] T6 — Créer `src/components/ui/LanguageSwitcher.tsx`
- [x] T7 — Créer `src/components/providers/ThemeProvider.tsx`
- [x] T8 — Mettre à jour `src/app/layout.tsx` (ThemeProvider + NextIntlClientProvider)
- [x] T9 — Mettre à jour pages connexion + inscription (ThemeToggle + LanguageSwitcher + getTranslations)
- [x] T10 — Mettre à jour `LoginForm.tsx` (useTranslations)
- [x] T11 — Créer `src/lib/preferences.test.ts` (5 tests)
- [x] T12 — Mettre à jour `sprint-status.yaml`
- [x] T13 — Créer `src/i18n/request.ts` (getRequestConfig pour next-intl)
- [x] T14 — Mettre à jour `next.config.ts` (createNextIntlPlugin)
- [x] T15 — Brancher `useTranslations` dans `RegisterForm.tsx` (tous les champs)

---

## Dev Notes

### Architecture i18n sans routing URL

Locale stockée dans cookie `locale` (SSR) + localStorage (client). Pas de prefix `/fr/...` dans l'URL. Le layout server lit le cookie, charge les messages correspondants et les passe à `NextIntlClientProvider`.

### ThemeProvider

`next-themes` avec `attribute="class"` correspond au `.dark { ... }` existant dans `globals.css`. `defaultTheme="system"` respecte `prefers-color-scheme` (AC5).

### Config next-intl obligatoire

`next-intl` requiert deux éléments pour fonctionner avec App Router :
1. `src/i18n/request.ts` — `getRequestConfig` lit le cookie `locale` et charge les messages
2. `next.config.ts` — `createNextIntlPlugin('./src/i18n/request.ts')` enregistre la config

Les imports dynamiques de type `` import(`messages/${locale}.json`) `` ne sont **pas** supportés par le bundler — utiliser une map statique (`locale === 'en' ? import(...) : import(...)`) à la place.

### Hydratation

`suppressHydrationWarning` sur `ThemeToggle`, `LanguageSwitcher` et tous les `<input>` du `RegisterForm` (état monté côté client uniquement). Squelette vide rendu côté serveur.

---

## File List

| Fichier | Action |
|---------|--------|
| `messages/fr.json` | Créé |
| `messages/en.json` | Créé |
| `src/i18n/config.ts` | Créé |
| `src/hooks/useUserPreferences.ts` | Créé |
| `src/components/ui/ThemeToggle.tsx` | Créé |
| `src/components/ui/LanguageSwitcher.tsx` | Créé |
| `src/components/providers/ThemeProvider.tsx` | Créé |
| `src/app/layout.tsx` | Modifié |
| `src/app/auth/connexion/page.tsx` | Modifié |
| `src/app/auth/inscription/page.tsx` | Modifié |
| `src/components/auth/LoginForm.tsx` | Modifié |
| `src/lib/preferences.test.ts` | Créé |
| `src/i18n/request.ts` | Créé — getRequestConfig (lecture cookie locale) |
| `next.config.ts` | Modifié — createNextIntlPlugin |
| `src/components/auth/RegisterForm.tsx` | Modifié — useTranslations tous champs |
| `messages/fr.json` | Modifié — ajout country, country_placeholder, consent_pdf_aria |
| `messages/en.json` | Modifié — ajout country, country_placeholder, consent_pdf_aria |

---

## Change Log

| Date | Description |
|------|-------------|
| 2026-03-20 | Implémentation initiale Story 1.5 |
