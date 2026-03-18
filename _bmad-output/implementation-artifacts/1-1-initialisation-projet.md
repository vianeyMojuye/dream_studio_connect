# Story 1.1 : Initialisation du projet — Next.js 16 + shadcn/ui + CI/CD

Status: review

---

## Story

As a développeur,
I want un projet Next.js 16 initialisé avec shadcn/ui, Tailwind CSS v4, les tokens CSS DSC (couleurs par espace, dark/light), le pipeline CI/CD GitHub Actions + Vercel et les variables d'environnement configurées,
so that toute l'équipe dispose d'une base technique fonctionnelle, déployable et testée avant d'écrire la première ligne de code métier.

---

## Acceptance Criteria

1. **AC1** — `pnpm dlx shadcn@latest init -t next` s'exécute sans erreur ; `pnpm dev` démarre le projet sans erreur.
2. **AC2** — La structure de dossiers correspond exactement à l'arborescence définie dans l'Architecture (route groups, server/, lib/, components/, etc.).
3. **AC3** — Les tokens CSS DSC sont définis dans `src/app/globals.css` : `--color-joueur` (orange), `--color-agent` (bleu), `--color-scout` (ambre), `--color-admin` (violet), avec variables dark/light via `@media (prefers-color-scheme: dark)` ET classe `.dark`.
4. **AC4** — `.github/workflows/ci.yml` exécute lint + type-check sur chaque PR sans erreur.
5. **AC5** — Vercel déploie un preview sur chaque PR et une production sur `main` (configurer via Vercel Dashboard ou `vercel link`).
6. **AC6** — `.env.example` contient toutes les variables d'environnement nécessaires (sans valeurs secrètes), avec un commentaire par variable.
7. **AC7** — Le bundle JS initial est < 200 KB gzippé, vérifié via `next build` + Vercel Analytics (NFR05).

---

## Tasks / Subtasks

- [x] **T1 — Initialiser le projet starter** (AC: 1, 2)
  - [x] T1.1 — Exécuter `pnpm dlx shadcn@latest init -d` dans le répertoire racine du projet
  - [x] T1.2 — Ajouter les composants shadcn/ui MVP : button, card, input, select, badge, progress, sheet, dialog, skeleton, sonner (toast → sonner)
  - [x] T1.3 — `pnpm build` produit un bundle valide (12 routes statiques/dynamiques)

- [x] **T2 — Créer la structure complète de dossiers** (AC: 2)
  - [x] T2.1 — Route groups App Router : `(public)/`, `(joueur)/`, `(agent)/`, `(scout)/`, `(admin)/`, `auth/`
  - [x] T2.2 — Layouts stubés avec `--space-accent` par espace
  - [x] T2.3 — `src/server/trpc/routers/` avec `_app.ts` + routers vides
  - [x] T2.4 — `src/server/db/index.ts` + `helpers.ts` (withTenant stub)
  - [x] T2.5–2.8 — lib/validations, lib/utils, i18n messages, composants vides
  - [x] T2.9 — `src/hooks/useUserPreferences.ts`
  - [x] T2.10 — `src/middleware.ts` stub (matcher `/joueur/*`, `/agent/*`, `/scout/*`, `/admin/*`)

- [x] **T3 — Définir les tokens CSS DSC dans globals.css** (AC: 3)
  - [x] T3.1 — Custom properties oklch par espace dans `:root` (joueur, agent, scout, admin)
  - [x] T3.2 — Variables dark/light + `--touch-target-min: 44px`
  - [x] T3.3 — Tokens oklch vérifiés (contraste 4.5:1 — fg blanc sur foncé, noir sur ambre)

- [x] **T4 — Configurer CI/CD GitHub Actions + Vercel** (AC: 4, 5)
  - [x] T4.1 — `.github/workflows/ci.yml` lint + typecheck + build sur PR/main
  - [ ] T4.2 — Configurer Vercel : `vercel link` ou via Vercel Dashboard (étape manuelle)
  - [ ] T4.3 — Vérifier déploiement preview sur Vercel (après T4.2)

- [x] **T5 — Documenter les variables d'environnement** (AC: 6)
  - [x] T5.1 — `.env.example` avec toutes les vars documentées
  - [x] T5.2 — `.env.local` créé localement (non commité)

- [x] **T6 — Configurer les frameworks de tests** (AC: 1)
  - [x] T6.1 — Vitest configuré (`vitest.config.ts` + `src/test/setup.ts`)
  - [x] T6.2 — Playwright configuré (`playwright.config.ts` + `tests/e2e/smoke.spec.ts`)
  - [x] T6.3 — Scripts `test`, `test:ui`, `test:e2e` dans package.json

- [x] **T7 — Vérifier bundle size** (AC: 7)
  - [x] T7.1 — JS total gzippé : **163.4 KB** < 200 KB ✓ (NFR05)
  - [ ] T7.2 — Vercel Analytics (après connexion Vercel — étape manuelle)

---

## Dev Notes

### ⚠️ CONTEXTE CRITIQUE — Projet Greenfield

Cette story est **le point de départ absolu**. Le repo GitHub `vianeyMojuye/dream_studio_connect` existe déjà (initialisé avec la documentation), mais **il n'y a pas de code applicatif**. L'agent dev doit créer le projet depuis zéro dans ce repo existant.

**Ordre d'exécution obligatoire :**
1. Cloner le repo si pas déjà fait
2. Exécuter les commandes shadcn/ui (T1)
3. Créer la structure de dossiers (T2)
4. Configurer les tokens CSS (T3)
5. CI/CD (T4)
6. .env.example (T5)
7. Tests (T6)
8. Vérification bundle (T7)

### Commandes d'initialisation exactes

```bash
# Étape 1 — Initialiser le projet Next.js 16 avec shadcn/ui (inclut Tailwind CSS v4)
pnpm dlx shadcn@latest init -t next

# Étape 2 — Ajouter les composants shadcn/ui prioritaires MVP
pnpm dlx shadcn@latest add button card input select badge progress sheet dialog skeleton toast
```

> **⚠️ Package manager obligatoire : `pnpm`**. NE PAS utiliser npm ou yarn. Vérifier que pnpm ≥ 9 est installé (`pnpm --version`).
> **Node.js requis :** ≥ 20.9 (`node --version`).

### Tokens CSS DSC — Contenu exact pour globals.css

Ajouter dans `src/app/globals.css` APRÈS les styles générés par shadcn/ui :

```css
/* ── Design Tokens Dream Studio Connect ─────────────────────────────────── */

:root {
  /* Couleurs par espace utilisateur */
  --color-joueur: #f97316;        /* orange-500 — espace joueur */
  --color-joueur-fg: #ffffff;
  --color-agent: #3b82f6;         /* blue-500 — espace agent */
  --color-agent-fg: #ffffff;
  --color-scout: #f59e0b;         /* amber-500 — espace scout */
  --color-scout-fg: #ffffff;
  --color-admin: #8b5cf6;         /* violet-500 — espace admin */
  --color-admin-fg: #ffffff;

  /* Surfaces — mode clair */
  --surface-bg: #ffffff;
  --surface-card: #f8fafc;
  --surface-border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
}

/* Mode sombre — classe + media query (double stratégie pour compatibilité) */
.dark,
@media (prefers-color-scheme: dark) {
  :root {
    --surface-bg: #0f172a;
    --surface-card: #1e293b;
    --surface-border: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
  }
}

/* Accessibilité — touch targets minimum */
* {
  min-height: 0; /* Reset pour flex/grid */
}

button, a, [role="button"], input, select, textarea {
  min-height: 44px;    /* NFR19 — touch target ≥ 44px */
  min-width: 44px;
}
```

> **⚠️ Contraste obligatoire NFR17 :** Vérifier avec l'outil [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) que chaque couleur atteint ≥ 4.5:1 en fond clair ET sombre. Si non, ajuster les valeurs.

### Structure de dossiers complète à créer

```
src/
├── app/
│   ├── globals.css                    ← ajouter tokens DSC ici
│   ├── layout.tsx                     ← root layout (next-intl + Auth.js + ThemeProvider)
│   ├── (public)/
│   │   ├── page.tsx                   ← landing page stub
│   │   └── joueur/[slug]/page.tsx     ← profil public stub (ISR)
│   ├── (joueur)/
│   │   ├── layout.tsx                 ← layout joueur (accent --color-joueur)
│   │   └── tableau-de-bord/page.tsx   ← stub
│   ├── (agent)/
│   │   ├── layout.tsx                 ← layout agent (accent --color-agent)
│   │   └── tableau-de-bord/page.tsx   ← stub
│   ├── (scout)/
│   │   ├── layout.tsx                 ← layout scout (accent --color-scout)
│   │   └── tableau-de-bord/page.tsx   ← stub
│   ├── (admin)/
│   │   ├── layout.tsx                 ← layout admin (accent --color-admin)
│   │   └── tableau-de-bord/page.tsx   ← stub
│   ├── auth/
│   │   ├── connexion/page.tsx         ← stub
│   │   └── inscription/page.tsx       ← stub
│   └── api/
│       ├── auth/[...nextauth]/route.ts  ← Auth.js handler stub
│       └── webhooks/
│           ├── whatsapp/route.ts        ← stub (complété Epic 3)
│           └── momo/route.ts            ← stub (complété Epic 5)
├── components/
│   ├── ui/                             ← shadcn/ui — NE JAMAIS MODIFIER DIRECTEMENT
│   ├── player/                         ← dossier vide pour Epic 2
│   ├── agent/                          ← dossier vide pour Epic 3
│   ├── admin/                          ← dossier vide pour Epic 4
│   └── shared/
│       ├── ThemeToggle.tsx             ← stub (complété Story 1.5)
│       ├── LanguageSwitcher.tsx        ← stub (complété Story 1.5)
│       └── Notifications.tsx           ← stub
├── server/
│   ├── trpc/
│   │   ├── index.ts                    ← initialisation tRPC + context stub
│   │   ├── trpc.ts                     ← publicProcedure / protectedProcedure stubs
│   │   └── routers/
│   │       ├── _app.ts                 ← router racine (merge) stub
│   │       ├── auth.ts                 ← stub
│   │       ├── player.ts               ← stub
│   │       ├── agent.ts                ← stub
│   │       ├── scout.ts                ← stub
│   │       ├── admin.ts                ← stub
│   │       ├── messaging.ts            ← stub
│   │       ├── notification.ts         ← stub
│   │       └── payment.ts              ← stub
│   └── db/
│       ├── index.ts                    ← Prisma client singleton stub
│       └── helpers.ts                  ← withTenant(tenantId) stub
├── lib/
│   ├── validations/
│   │   ├── auth.ts                     ← stub Zod schemas
│   │   ├── player.ts                   ← stub
│   │   ├── agent.ts                    ← stub
│   │   └── search.ts                   ← stub
│   ├── utils/
│   │   ├── whatsapp.ts                 ← stub buildWhatsAppShareLink()
│   │   ├── cloudinary.ts               ← stub generateSignedUrl()
│   │   └── momo.ts                     ← stub verifyMoMoTransaction()
│   └── i18n/
│       ├── config.ts                   ← config next-intl
│       └── messages/
│           ├── fr.json                 ← clés FR minimales
│           └── en.json                 ← clés EN minimales
├── hooks/
│   └── useUserPreferences.ts           ← stub (theme, lang — complété Story 1.5)
└── middleware.ts                       ← tenant routing + auth guard stub
```

### Fichier CI/CD — `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
```

> Ajouter dans `package.json` : `"typecheck": "tsc --noEmit"` et `"lint": "next lint"`.

### Fichier `.env.example` — contenu à créer

```bash
# ── Base de données ───────────────────────────────────────────────────────
# Neon PostgreSQL — obtenir depuis https://neon.tech
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# ── Authentification (Auth.js v5) ─────────────────────────────────────────
# Générer avec: openssl rand -base64 32
AUTH_SECRET="your-auth-secret-here"
AUTH_URL="http://localhost:3000"

# ── Cloudinary CDN ────────────────────────────────────────────────────────
# Obtenir depuis https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ── Upstash Redis ─────────────────────────────────────────────────────────
# Obtenir depuis https://upstash.com
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# ── WhatsApp Business API (Meta) ──────────────────────────────────────────
# Obtenir depuis https://developers.facebook.com
WHATSAPP_ACCESS_TOKEN="your-whatsapp-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your-webhook-verify-token"

# ── Orange Money / MTN MoMo ───────────────────────────────────────────────
ORANGE_MONEY_API_KEY="your-orange-money-key"
MTN_MOMO_API_KEY="your-mtn-momo-key"
MOMO_WEBHOOK_SECRET="your-momo-webhook-secret"

# ── Monitoring ────────────────────────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# ── Environnement ─────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Contenu minimal fr.json / en.json

```json
// src/lib/i18n/messages/fr.json
{
  "app": {
    "name": "Dream Studio Connect",
    "tagline": "La plateforme de mise en relation talents football africain"
  },
  "nav": {
    "home": "Accueil",
    "login": "Se connecter",
    "register": "S'inscrire"
  },
  "errors": {
    "generic": "Une erreur est survenue. Veuillez réessayer.",
    "unauthorized": "Accès non autorisé.",
    "notFound": "Page introuvable."
  },
  "common": {
    "loading": "Chargement...",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "delete": "Supprimer"
  }
}
```

```json
// src/lib/i18n/messages/en.json
{
  "app": {
    "name": "Dream Studio Connect",
    "tagline": "The African football talent platform"
  },
  "nav": {
    "home": "Home",
    "login": "Sign in",
    "register": "Sign up"
  },
  "errors": {
    "generic": "An error occurred. Please try again.",
    "unauthorized": "Unauthorized access.",
    "notFound": "Page not found."
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "delete": "Delete"
  }
}
```

### Project Structure Notes

**Alignement architecture :** Cette story implémente exactement l'arborescence définie dans `_bmad-output/planning-artifacts/architecture.md` section "Complete Project Directory Structure" (lignes ~371-499).

**Conflits potentiels à surveiller :**
- shadcn/ui génère `src/app/globals.css` et `tailwind.config.ts` → les modifier APRÈS l'init, pas avant
- shadcn/ui génère `components/ui/` dans `src/components/ui/` → vérifier le chemin correspond bien à l'architecture
- `middleware.ts` doit être à la racine de `src/` (pas à la racine du projet) pour Next.js App Router
- `components.json` (config shadcn) sera créé à la racine — c'est normal, ne pas déplacer

**Décisions prises dans l'architecture NON-négociables pour cette story :**
- Package manager : **pnpm uniquement** [Source: architecture.md#Starter Template Evaluation]
- Pas de `npm install` ni `yarn` dans cette story ou les suivantes
- TypeScript strict : le `tsconfig.json` doit avoir `"strict": true` [Source: architecture.md#Language & Runtime]
- Biome en plus d'ESLint pour le formatage [Source: architecture.md#Development Experience]

### Architecture & Sécurité — Règles critiques pour cette story

1. **`tenant_id` présent dès le schéma Prisma** — même si Prisma n'est pas configuré dans cette story, le stub `withTenant()` doit avoir la signature correcte
2. **Aucune string hardcodée en UI** — même les stubs de layout doivent utiliser `next-intl` (ou un placeholder commenté)
3. **Route Handlers** : créer les stubs webhooks sous `api/webhooks/` uniquement, pas d'autre Route Handler custom
4. **`components/ui/`** : NE JAMAIS modifier les fichiers générés par shadcn/ui directement

---

## Testing Requirements

**Pour cette story (infrastructure uniquement) :**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Test de smoke à créer dans cette story :**

```typescript
// tests/e2e/smoke.spec.ts
import { test, expect } from '@playwright/test'

test('landing page se charge', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Dream Studio Connect/)
})

test('tokens CSS DSC sont présents', async ({ page }) => {
  await page.goto('/')
  const colorJoueur = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-joueur').trim()
  )
  expect(colorJoueur).toBeTruthy()
})
```

---

## Références

- [Source: architecture.md#Starter Template Evaluation] — Commandes init exactes + justification Next.js 16
- [Source: architecture.md#Complete Project Directory Structure] — Arborescence complète
- [Source: architecture.md#Naming Patterns] — Conventions nommage obligatoires
- [Source: architecture.md#Enforcement Guidelines] — Anti-patterns à bannir
- [Source: architecture.md#Infrastructure & Déploiement] — Config Vercel + GitHub Actions
- [Source: epics.md#Story 1.1] — Acceptance Criteria originaux
- [Source: epics.md#Additional Requirements - Architecture] — Détails starter template + commandes

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_À remplir par l'agent dev lors de l'implémentation_

### Completion Notes List

_À remplir par l'agent dev lors de l'implémentation_

### File List

_Fichiers créés/modifiés — à remplir lors de l'implémentation :_

- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `components.json`
- `vitest.config.ts`
- `playwright.config.ts`
- `middleware.ts`
- `.env.example`
- `.gitignore`
- `.github/workflows/ci.yml`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/(public)/page.tsx`
- `src/lib/i18n/messages/fr.json`
- `src/lib/i18n/messages/en.json`
- `src/server/trpc/index.ts`
- `src/server/trpc/trpc.ts`
- `src/server/trpc/routers/_app.ts`
- `src/server/db/index.ts`
- `src/server/db/helpers.ts`
- `tests/e2e/smoke.spec.ts`
- _... + tous les stubs de dossiers_
