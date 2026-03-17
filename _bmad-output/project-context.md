---
project_name: 'dream_studio_connect'
user_name: 'falcom'
date: '2026-03-17'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
optimized_for_llm: true
---

# Project Context for AI Agents — Dream Studio Connect

_Ce fichier contient les règles critiques et les patterns que les agents IA doivent suivre lors de l'implémentation du code de ce projet. Focus sur les détails non-évidents que les agents pourraient manquer._

---

## Technology Stack & Versions

### Runtime & Framework
- **Next.js 16** — App Router, RSC + ISR pour pages publiques, SPA pour espaces authentifiés
- **React 19** — Server Components natifs, strict mode
- **TypeScript** — `strict: true` obligatoire, zéro `any` toléré
- **Node.js ≥ 20.9** — version minimale requise

### Styling & UI
- **Tailwind CSS v4** — CSS custom properties pour tokens DSC, zéro runtime JS
- **shadcn/ui** (Radix UI primitives) — composants dans `components/ui/`, jamais modifiés directement
- Init : `pnpm dlx shadcn@latest init -t next`

### Data Layer
- **Prisma** (latest) — ORM, source de vérité DB, migrations versionées
- **PostgreSQL via Neon** (serverless) — Row-Level Security multi-tenant
- **Upstash Redis** (latest) — rate limiting, cache sessions, cache recherche (Edge Runtime compatible)

### Auth & Sécurité
- **Auth.js v5** (`next-auth@5`) — JWT + sessions, App Router natif
- **bcryptjs** (latest) — hachage mots de passe, coût ≥ 12

### API & Validation
- **tRPC** (`@trpc/server@latest` + `@trpc/client@latest`) — end-to-end typesafe
- **Zod** (latest) — schémas partagés tRPC + React Hook Form
- **TanStack Query v5** (`@tanstack/react-query@5`) — server state
- **Zustand** (latest) — client state uniquement (UI, préférences locales)

### Frontend Utils
- **React Hook Form** (latest) + Zod — formulaires avec validation typesafe
- **next-intl** (latest) — i18n App Router, locales `fr` + `en`
- **idb** (latest) — IndexedDB pour queue uploads offline

### Tests
- **Vitest** — tests unitaires et intégration (co-localisés avec les composants)
- **Playwright** — tests E2E dans `tests/e2e/`

### Intégrations Tierces
- **Cloudinary** (`cloudinary@latest`) — CDN Lagos + Johannesburg, compression vidéo serveur
- **WhatsApp Business API** (Meta) — notifications transactionnelles MVP
- **Firebase Cloud Messaging** (`firebase@latest`) — notifications V1.0
- **Orange Money + MTN MoMo API** — paiements, confirmation serveur obligatoire

### Infrastructure
- **Vercel** — hosting frontend/API, Edge Network global
- **GitHub Actions** — CI/CD, tests + lint sur PR
- **Sentry** — monitoring erreurs runtime
- **Vercel Analytics** — Core Web Vitals

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

#### Configuration stricte
- `strict: true` dans `tsconfig.json` — aucune exception
- Zéro `any` — utiliser `unknown` si le type est incertain, puis narrower
- Imports absolus obligatoires via alias `@/*` → `src/*` — jamais de `../../..`
- `"moduleResolution": "bundler"` requis pour Next.js 16

#### Typage Auth.js — Augmentation obligatoire
- `src/types/next-auth.d.ts` DOIT augmenter `Session` et `JWT` avec `role` et `tenantId` :
  ```ts
  declare module "next-auth" {
    interface Session { user: { role: Role; tenantId: string } & DefaultSession["user"] }
  }
  ```
- Ne jamais caster `session.user as any` pour accéder à `role` ou `tenantId`

#### Async/Await
- Toujours `async/await` — jamais `.then().catch()` dans les Server Components ou routers tRPC
- `await` obligatoire sur toutes les queries Prisma — jamais de Promise non-awaited

#### Exports
- Pages et layouts Next.js : `export default` obligatoire
- Utilitaires, hooks, types, schemas Zod : `export const` / `export type` nommés
- Schemas Zod exportés **uniquement** depuis `lib/validations/` — jamais inline dans un composant ou router

#### Dates & Primitives
- Toujours **ISO 8601 strings** : `"2026-03-17T10:00:00Z"` — jamais de timestamp Unix
- `null` = valeur absente connue (champ optionnel non renseigné en DB)
- `undefined` = champ non envoyé dans la payload
- Booléens : `true`/`false` — jamais `1`/`0`

---

### Framework-Specific Rules (Next.js + React + tRPC)

#### Next.js — App Router
- Route groups par espace : `(public)`, `(joueur)`, `(agent)`, `(scout)`, `(admin)` — code-splitting automatique par espace
- **Webhooks externes UNIQUEMENT** en Route Handlers (`/api/webhooks/*`) — tout CRUD métier passe par tRPC, jamais de Route Handler custom
- Pages publiques joueur (`/joueur/[slug]`) : ISR (`revalidate`) obligatoire pour SEO + OpenGraph WhatsApp
- `middleware.ts` tourne en **Edge Runtime** : pas d'accès Prisma — lire uniquement les JWT claims (`role`, `tenantId`)
- Secrets : `.env.local` en dev, Vercel Environment Variables en prod — jamais en dur dans le code source

#### React — Composants
- `components/ui/` (shadcn/ui) : **jamais modifier directement** — créer un wrapper dans `components/[feature]/`
- Composants métier organisés par espace : `components/player/`, `components/agent/`, `components/admin/`, `components/shared/`
- Loading states : `<Skeleton>` shadcn/ui — jamais de spinner CSS custom
- Upload vidéo : `<Progress>` shadcn/ui avec pourcentage réel Cloudinary — jamais de loader générique
- Erreurs formulaires : via `fieldState.error` (React Hook Form) — jamais `alert()`

#### tRPC — Routers & Procédures
- **1 fichier router par domaine métier** : `auth.ts`, `player.ts`, `agent.ts`, `scout.ts`, `admin.ts`, `messaging.ts`, `notification.ts`, `payment.ts`
- Namespacing obligatoire : `trpc.player.getProfile` — jamais de router plat
- Nommage procédures : `verb + Noun` camelCase → `getProfile`, `createPlayer`, `searchPlayers`, `validateAccount`
- Erreurs : `TRPCError` avec code standard (`UNAUTHORIZED`, `NOT_FOUND`, `BAD_REQUEST`, `FORBIDDEN`) — jamais `throw new Error()` brut dans un router
- Pagination : cursor-based uniquement → `{ items: [], nextCursor: string | null }` — optimal 3G/mobile
- Pas de wrapper custom `{data, error}` — tRPC gère l'enveloppe automatiquement
- Transformation snake_case (Prisma) → camelCase (client) : automatique via tRPC, ne pas la réimplémenter

#### TanStack Query v5
- `retry: 2` par défaut sur les queries, puis afficher l'état d'erreur
- `isPending` pour les mutations, `isLoading` pour les queries initiales
- Invalider le cache après mutation : `queryClient.invalidateQueries({ queryKey: [...] })`

#### Zustand
- **Client state uniquement** : UI state, préférences thème/langue, favoris non-persistés, panier upload offline
- Jamais pour du server state (données distantes) — c'est le rôle de TanStack Query
- Jamais Redux, jamais Context API pour du server state

#### Cloudinary
- URLs signées générées **côté serveur uniquement** via `lib/utils/cloudinary.ts` — jamais exposées côté client
- Clé API Cloudinary : jamais dans un composant React, jamais envoyée au client
- Queue offline : IndexedDB via `idb`, structure `{ id, file, metadata, status, tenantId }`

#### next-intl
- **Zéro string hardcodée** dans les composants — toujours `t('clé.traduction')`
- Messages dans `lib/i18n/messages/fr.json` et `en.json`
- Clés de traduction : `domaine.contexte.message` → `errors.upload.failed`, `player.profile.title`

---

### Testing Rules

#### Organisation des fichiers
- Tests unitaires/intégration **co-localisés** avec le composant : `PlayerCard.test.tsx` à côté de `PlayerCard.tsx`
- Tests E2E **centralisés** dans `tests/e2e/` à la racine — un fichier par parcours utilisateur :
  - `joueur.spec.ts` — création profil Passeport Talent
  - `agent.spec.ts` — recherche filtrée + contact joueur
  - `admin.spec.ts` — validation compte + modération

#### Vitest — Tests unitaires & intégration
- Fichiers de test : `*.test.tsx` (composants) ou `*.test.ts` (utils, hooks, routers)
- Toujours tester le comportement visible — jamais les détails d'implémentation interne
- Mocks : mocker Prisma et les appels tRPC côté test — jamais de vraie requête DB en test unitaire
- Router tRPC : tester via `createCaller()` (helper tRPC pour tests serveur)

#### Playwright — Tests E2E
- Tester les parcours utilisateur complets (happy path) par rôle
- Environnement : base de données de test dédiée (Neon branching)
- Assertions : préférer `getByRole`, `getByText` — jamais de sélecteurs CSS fragiles

#### Ce qu'on ne teste PAS
- Les composants shadcn/ui (`components/ui/`) — testés upstream par la librairie
- Les types TypeScript — `tsc --noEmit` dans le CI suffit

---

### Code Quality & Style Rules

#### Nommage — Base de données (Prisma)
- Tables : `snake_case` pluriel → `players`, `agents`, `tenants`, `audit_logs`
- Colonnes : `snake_case` → `tenant_id`, `created_at`, `parental_consent`
- Clés étrangères : `{model}_id` → `player_id`, `agent_id`
- Enums Prisma : `PascalCase` → `Role`, `PlayerPosition`, `SubscriptionStatus`
- IDs : **CUID2** via `@default(cuid())` — jamais UUID v4, jamais autoincrement exposé

#### Nommage — API (tRPC routers)
- Routers : `camelCase` singulier → `player`, `agent`, `auth`, `admin`, `scout`
- Procédures : `verb + Noun` camelCase → `getProfile`, `createPlayer`, `searchPlayers`, `validateAccount`

#### Nommage — Code React/TypeScript
- Composants : `PascalCase` → `PlayerCard`, `AgentSearchFilter`, `TalentPassport`
- Fichiers composants : `PascalCase.tsx` → `PlayerCard.tsx`, `VideoUploader.tsx`
- Hooks custom : préfixe `use` + PascalCase → `usePlayerProfile`, `useTenantConfig`, `useOfflineQueue`
- Utilitaires/helpers : `camelCase` → `formatPlayerAge`, `buildWhatsAppShareLink`, `verifyMoMoTransaction`

#### Nommage — Routes Next.js
- Slugs en français : `/joueur/[slug]`, `/agent/recherche`, `/tableau-de-bord`
- Route groups sans impact URL : `(public)`, `(joueur)`, `(agent)`, `(scout)`, `(admin)`

#### Organisation du code
- Schémas Zod **uniquement** dans `lib/validations/` — jamais inline dans un composant ou router
- Helpers purs (sans side-effects) dans `lib/utils/` — helpers avec side-effects dans les Server Actions
- Prisma client : singleton dans `server/db/index.ts` — jamais instancié ailleurs
- `components/ui/` : répertoire géré par shadcn/ui CLI — ne pas modifier manuellement

#### Theming
- Couleurs par espace via CSS custom properties : `--color-joueur` (orange), `--color-agent` (bleu), `--color-scout` (ambre), `--color-admin` (violet)
- Dark/light : CSS `prefers-color-scheme` + bascule manuelle persistée `localStorage` via `useUserPreferences`
- Zéro valeur couleur hardcodée dans les composants — toujours via classes Tailwind ou tokens CSS DSC

---

### Development Workflow Rules

#### Multi-tenancy — Règle absolue
- `tenant_id` présent dans **tous** les modèles Prisma sans exception
- Toute query Prisma DOIT filtrer par `tenantId` via le helper `withTenant(tenantId)` dans `server/db/helpers.ts`
- `tenantId` extrait **côté serveur** depuis la session Auth.js — jamais depuis le body de la requête client
- Aucun composant React n'importe directement Prisma — tout passe par tRPC

#### Authentification & RBAC
- Session Auth.js contient `role` + `tenantId` dans le JWT — le middleware les lit sans appel DB
- 3 types de procédures tRPC : `publicProcedure`, `protectedProcedure`, `adminProcedure` — choisir le bon
- Profils joueurs mineurs : `parental_consent_validated = false` → profil non-public (vérifié en middleware)
- `audit_logs` : table immuable en PostgreSQL — jamais d'UPDATE ou DELETE sur cette table

#### Validation — Double couche obligatoire
- Schéma Zod **d'abord** dans `lib/validations/` → réutilisé côté tRPC input ET React Hook Form
- Validation côté client (UX) + côté serveur (sécurité) — toujours les deux, jamais l'un sans l'autre

#### Paiements Mobile Money
- Confirmation côté **serveur** obligatoire avant toute activation d'abonnement
- Flux : webhook MoMo → `/api/webhooks/momo/route.ts` → vérification HMAC → `trpc.payment.activate`
- Jamais activer un abonnement sans confirmation serveur reçue du webhook

#### CI/CD (GitHub Actions)
- Lint + `tsc --noEmit` + tests Vitest sur chaque PR — le CI doit passer avant merge
- Déploiement preview Vercel automatique sur chaque PR
- Variables d'environnement : configurées dans Vercel par environnement (preview / production)

---

### Critical Don't-Miss Rules

#### ❌ Anti-patterns absolus — Ne jamais faire

| Anti-pattern | À faire à la place |
|---|---|
| Query Prisma sans `WHERE tenant_id = ?` | Toujours via `withTenant(tenantId)` dans `server/db/helpers.ts` |
| `tenant_id` envoyé depuis le client dans le body | L'extraire de la session Auth.js côté serveur |
| Route Handler custom pour du CRUD métier | Utiliser tRPC |
| Modifier un composant dans `components/ui/` | Créer un wrapper dans `components/[feature]/` |
| `throw new Error()` brut dans un router tRPC | `throw new TRPCError({ code: 'NOT_FOUND', ... })` |
| String hardcodée dans un composant UI | `t('cle.traduction')` via next-intl |
| Clé API Cloudinary côté client | URL signée générée via Server Action dans `lib/utils/cloudinary.ts` |
| `UPDATE` ou `DELETE` sur `audit_logs` | Table immuable — insert only |
| Dupliquer un schéma Zod | Toujours importer depuis `lib/validations/` |
| Instancier Prisma hors de `server/db/index.ts` | Utiliser le singleton Prisma |
| Redux ou Context API pour du server state | TanStack Query v5 |
| Timestamp Unix pour les dates | ISO 8601 string `"2026-03-17T10:00:00Z"` |
| Activer un abonnement sans webhook MoMo confirmé | Attendre la confirmation serveur HMAC |
| `any` en TypeScript | `unknown` + type narrowing |

#### ⚠️ Edge cases à toujours gérer

- **Mineurs** : vérifier `parental_consent_validated` en middleware avant d'exposer un profil public
- **Offline uploads** : la queue IndexedDB doit persister le `tenantId` avec chaque entrée `{ id, file, metadata, status, tenantId }`
- **Pagination** : toujours cursor-based `{ items: [], nextCursor: string | null }` — jamais offset
- **Erreurs tRPC** : les codes (`NOT_FOUND`, `UNAUTHORIZED`) sont traduits côté client via next-intl — jamais afficher le message brut serveur
- **Dark/light** : préférences persistées via `useUserPreferences` dans `localStorage` — lire au montage, pas en SSR

#### 🔒 Règles de sécurité impératives

- JWT : expiration ≤ 24h (access token) + rotation refresh token
- bcrypt : coût ≥ 12 pour tout hachage de mot de passe
- TLS 1.3 + CSRF tokens + validation Zod sur toutes les API publiques
- Erreurs serveur : loggées via Sentry en prod — **jamais exposées en clair au client**
- Webhooks externes (`/api/webhooks/*`) : toujours vérifier la signature HMAC avant traitement

#### 🚀 Règles de performance PWA

- Bundle initial < 200KB gzippé — surveiller avec `next build` + `@next/bundle-analyzer`
- Lazy loading par espace utilisateur via route groups — automatique Next.js, ne pas contourner
- Images : toujours via `next/image` — jamais `<img>` natif
- Service Worker activé : cache offline, FCP ≤ 3s en 3G

---

## Usage Guidelines

**Pour les agents IA :**
- Lire ce fichier avant d'implémenter tout code
- Suivre toutes les règles exactement telles que documentées
- En cas de doute, préférer l'option la plus restrictive
- Mettre à jour ce fichier si de nouveaux patterns émergent

**Pour falcom :**
- Garder ce fichier lean et focalisé sur les besoins des agents
- Mettre à jour lors des changements de stack technologique
- Supprimer les règles qui deviennent évidentes au fil du temps

_Dernière mise à jour : 2026-03-17_
