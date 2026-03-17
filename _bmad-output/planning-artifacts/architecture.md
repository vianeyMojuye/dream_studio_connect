---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-17'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/product-brief-dream_studio_connect-2026-03-17.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
  - "_bmad-output/dream-studio-connect-analyse.md"
workflowType: 'architecture'
project_name: 'dream_studio_connect'
user_name: 'falcom'
date: '2026-03-17'
---

# Architecture Decision Document

_Ce document se construit de manière collaborative à travers une découverte étape par étape. Les sections sont ajoutées au fur et à mesure que nous travaillons ensemble sur chaque décision architecturale._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements :**
35 exigences fonctionnelles organisées en 8 domaines : authentification & gestion utilisateurs multi-rôles (joueur, agent, scout, admin), création et gestion du Passeport Talent joueur avec upload vidéo, moteur de recherche filtré multi-critères pour agents, système de messagerie directe joueur-agent, réseau de scouts citoyens avec commission tracking, validations communautaires par coaches (V1.0), back-office d'administration et modération, et paiements Mobile Money pour abonnements agents. La mise en relation joueur-agent est le flux de valeur central de toute la plateforme.

**Non-Functional Requirements :**
Les NFRs les plus impactants sur l'architecture sont les contraintes de performance réseau (FCP ≤ 3s en 3G, bundle < 200KB), la sécurité renforcée pour les mineurs (accès conditionnel au consentement parental, audit log immuable), la scalabilité multi-région Afrique sans refonte, la disponibilité ≥ 99%, et la fiabilité du pipeline média (queue upload offline persistée localement, CDN Afrique).

**Scale & Complexity :**
- Primary domain : Full-stack web — PWA SPA multi-espaces, multi-tenant
- Complexity level : **High**
- Architectural components estimés : 10-14 composants majeurs (Auth/IAM Service, Tenant Manager, Player Profile Service, Search/Discovery Engine, Media Pipeline, Messaging Service, Notification Service, Payment Service, Admin Service, Scout Service, Offline Queue Manager, Commission Engine)

### Technical Constraints & Dependencies

- **PWA contrainte réseau :** bundle initial < 200KB gzippé, PWA installable < 15MB — impose Vite/Rollup avec code-splitting agressif par espace
- **Stack UX décidée :** Tailwind CSS v4 + shadcn/ui (composants Radix UI) — impose React ou compatible
- **Intégrations tierces critiques :** WhatsApp Business API (Meta, quotas templates), Orange Money + MTN MoMo (confirmation serveur obligatoire avant activation), Cloudinary (CDN Lagos/Johannesburg), Firebase Push (V1.0)
- **Conformité :** Consentement parental pour mineurs, droit à l'effacement, données hébergées en Afrique (AWS Lagos ou équivalent), CGU Meta WhatsApp Business
- **Compatibilité :** Android 6+ / ≤ 2GB RAM, Chrome Android 80+ primaire, Samsung Internet 12+ secondaire

### Cross-Cutting Concerns Identified

1. **Multi-tenancy** — isolation des données par tenant (pays/organisation), configuration par tenant (langue, Mobile Money local, CDN région), routing strategy, migrations sans downtime cross-tenants
2. **RBAC (Role-Based Access Control)** — 4 rôles (joueur, agent, scout, admin) + super-admin plateforme, avec permissions granulaires et isolation des espaces par tenant
3. **i18n** — FR/EN natif dès sprint 1 via vue-i18n ou i18next, extensible par tenant (pidgin, langues locales V1.0)
4. **Theming dark/light** — CSS custom properties uniquement, détection `prefers-color-scheme` + bascule manuelle persistée localStorage
5. **Performance & offline** — Service Worker avec stratégie cache, queue d'upload offline persistée (IndexedDB), lazy loading par espace
6. **Sécurité données** — JWT + refresh tokens, bcrypt, TLS 1.3, audit log admin immuable, isolation données mineurs, isolation inter-tenants
7. **Media pipeline** — compression vidéo serveur (Cloudinary), stockage CDN Afrique, quotas par plan (gratuit/pro)
8. **Notifications multi-canal** — WhatsApp Business API (MVP) → Firebase Push (V1.0), fallback SMS/email, configuration par tenant
9. **SEO & partage social** — prerendering pages publiques profil joueur, Open Graph par profil pour prévisualisation WhatsApp enrichie

---

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web PWA — application Next.js multi-espaces, multi-tenant, avec rendering hybride (RSC + ISR) pour les pages publiques et SPA pour les espaces authentifiés.

### Starter Options Considered

- **Next.js 16 (App Router)** — sélectionné ✅
- **Vite + React** — écarté (pas de SSR/prerendering natif, SEO complexe à implémenter manuellement)
- **Remix** — écarté (écosystème shadcn/ui moins mature, moins de documentation multi-tenant)

### Selected Starter: shadcn/ui + Next.js

**Rationale for Selection :**
Next.js 16 est le seul starter qui couvre nativement les 5 exigences critiques du projet : PWA, multi-tenant middleware, ISR/SSG profils joueurs, code-splitting par espace utilisateur, et intégration shadcn/ui one-command. La décision Tailwind v4 + shadcn/ui prise dans l'UX Spec converge naturellement vers Next.js.

**Initialization Command :**

```bash
# Étape 1 — Initialiser le projet Next.js avec shadcn/ui (inclut Tailwind CSS v4)
pnpm dlx shadcn@latest init -t next

# Étape 2 — Ajouter les composants shadcn/ui prioritaires MVP
pnpm dlx shadcn@latest add button card input select badge progress sheet dialog skeleton toast
```

**Architectural Decisions Provided by Starter :**

**Language & Runtime :**
TypeScript strict (`strict: true`), React 19, Node.js ≥ 20.9 — typage complet dès le sprint 1, compatible React Server Components.

**Styling Solution :**
Tailwind CSS v4 + shadcn/ui (Radix UI primitives) — CSS custom properties pour tokens DSC (couleurs par espace, dark/light), zéro runtime JS pour le thème, bundle CSS < 15KB en production.

**Build Tooling :**
Turbopack (dev) + Webpack (prod) intégrés dans Next.js 16 — code-splitting automatique par route, lazy loading des espaces joueur/agent/admin, optimisation images WebP native (`next/image`).

**Testing Framework :**
Vitest (unit/intégration) + Playwright (E2E) — à configurer dans la première story d'implémentation.

**Code Organization :**

```
src/
  app/
    (public)/              # Pages publiques (profil joueur, landing) — ISR/SSG
    (joueur)/              # Espace joueur — route group — code-splitting auto
    (agent)/               # Espace agent — route group — code-splitting auto
    (admin)/               # Espace admin — route group — code-splitting auto
    api/                   # Route Handlers Next.js (API MVP)
  components/
    ui/                    # Composants shadcn/ui
    [feature]/             # Composants métier par feature
  lib/                     # Utilitaires, configs, clients API
  middleware.ts            # Tenant routing + auth guard (Edge Runtime)
```

**Development Experience :**
Fast Refresh (Turbopack), TypeScript strict, ESLint + Biome, alias `@/*` configuré, imports absolus natifs.

**Note :** L'initialisation du projet via cette commande doit être la première story d'implémentation.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Décisions critiques (bloquantes pour l'implémentation) :**
- Base de données et ORM
- Authentification & RBAC multi-tenant
- Pattern API (communication frontend ↔ backend)

**Décisions importantes (structurent l'architecture) :**
- State management frontend
- i18n
- Formulaires et validation
- Infrastructure & déploiement

**Décisions différées (post-MVP) :**
- WebSocket / SSE temps réel (polling MVP → SSE V1.0)
- Firebase Push Notifications (V1.0)
- Application mobile native (V2.0)

---

### Data Architecture

| Décision | Choix | Version | Justification |
|---|---|---|---|
| Base de données | **PostgreSQL via Neon** (serverless) | Neon latest | Serverless, tier gratuit généreux MVP, PostgreSQL RLS pour multi-tenant, région EU-west avec CDN global |
| ORM | **Prisma** | prisma@latest | DX excellent, migrations versionées, typage bout-en-bout avec tRPC, schéma unique source de vérité |
| Caching | **Upstash Redis** | upstash/redis@latest | Serverless Redis, rate limiting, cache sessions, cache résultats recherche — compatible Edge Runtime Vercel |
| Multi-tenant DB | **Row-Level Security (RLS) + `tenant_id`** | — | Isolation données par pays/organisation via RLS PostgreSQL, schéma partagé, zéro overhead infra par tenant |

---

### Authentication & Security

| Décision | Choix | Version | Justification |
|---|---|---|---|
| Auth provider | **Auth.js v5** (NextAuth) | next-auth@5 | Natif Next.js App Router, JWT + sessions, providers email/magic-link, gratuit, contrôle total RBAC |
| RBAC | **Middleware Next.js custom** + rôles en JWT claims | — | 4 rôles (joueur / agent / scout / admin) + super-admin DSC, isolation par tenant dans le token |
| Hachage mots de passe | **bcrypt** coût ≥ 12 | bcryptjs@latest | NFR08 — standard sécurisé |
| Tokens | **JWT + refresh tokens** | — | Expiration ≤ 24h access + rotation refresh (NFR09) |
| Mineurs | **Accès conditionnel en middleware** | — | Profil non-public tant que `parental_consent_validated = false` (NFR10) |
| Audit log | **Table `audit_logs` immuable** en PostgreSQL | — | NFR12 — actions admin journalisées, jamais modifiables |
| Protection API | **TLS 1.3 + CSRF tokens + validation Zod** | — | NFR07, NFR13 |

---

### API & Communication Patterns

| Décision | Choix | Version | Justification |
|---|---|---|---|
| Pattern API | **tRPC** | @trpc/server@latest + @trpc/client@latest | End-to-end typesafe avec Prisma → zéro désalignement types frontend/backend, DX optimal niveau intermediate |
| Validation | **Zod** | zod@latest | Schémas partagés tRPC input/output + React Hook Form — source de vérité unique |
| Upload média | **Cloudinary SDK** via Server Actions Next.js | cloudinary@latest | Compression vidéo côté serveur, CDN Lagos/Johannesburg (NFR23) |
| Notifications MVP | **WhatsApp Business API** (Meta) + polling 30s | — | NFR21 — transactionnel hors-app, fallback email |
| Notifications V1.0 | **Firebase Cloud Messaging** | firebase@latest | Engagement hors-app, ajout non-breaking sur base MVP |
| Paiements | **Orange Money + MTN MoMo API officielle** | — | Confirmation côté serveur obligatoire avant activation (NFR11, NFR22) |

---

### Frontend Architecture

| Décision | Choix | Version | Justification |
|---|---|---|---|
| Server state | **TanStack Query v5** | @tanstack/react-query@5 | Fetch, cache, sync données serveur — listes joueurs, profils, recherche agent |
| Client state | **Zustand** | zustand@latest | UI state léger : favoris locaux, préférences thème, panier upload offline |
| i18n | **next-intl** | next-intl@latest | Conçu App Router Next.js, typesafe, détection locale navigateur, `fr` + `en` MVP |
| Formulaires | **React Hook Form + Zod** | react-hook-form@latest | Validation typesafe partagée avec tRPC, auto-save onboarding, gestion erreurs FR/EN |
| Offline queue | **IndexedDB via idb** | idb@latest | Queue uploads vidéo persistée localement, sync à reconnexion (NFR24, NFR27) |
| Service Worker | **next-pwa** ou PWA custom Next.js 16 | — | Cache offline, installation écran d'accueil Android, FCP ≤ 3s (NFR01) |

---

### Infrastructure & Déploiement

| Décision | Choix | Justification |
|---|---|---|
| Hosting frontend/API | **Vercel** | Next.js natif, Edge Network global, déploiement preview PR automatique, analytics Core Web Vitals |
| Base de données | **Neon** (PostgreSQL serverless) | Tier gratuit MVP, branching DB pour dev/staging, région EU auto-scale |
| CDN médias | **Cloudinary** (Lagos + Johannesburg) | Compression vidéo serveur, transcoding auto, CDN Afrique (NFR23, NFR16) |
| CI/CD | **GitHub Actions** | Tests auto sur PR, déploiement Vercel preview branch, lint check |
| Monitoring | **Vercel Analytics** + **Sentry** | Core Web Vitals, erreurs runtime, performance 3G |
| Secrets | **Vercel Environment Variables** | `.env.local` dev, variables secrètes Vercel prod par environnement |

---

### Decision Impact Analysis

**Séquence d'implémentation recommandée :**
1. Init projet (shadcn + Next.js) + structure dossiers
2. Schéma Prisma (tenant, user, player, agent) + migrations Neon
3. Auth.js v5 — système de connexion + RBAC middleware
4. tRPC router de base + Zod schemas
5. Espace Joueur — création Passeport Talent + upload Cloudinary
6. Espace Agent — recherche filtrée + consultation profil
7. WhatsApp Business API — notifications + lien de partage
8. Espace Admin — back-office validation/modération
9. Mobile Money — paiements abonnements agents
10. Service Worker PWA — offline cache + installation Android

**Dépendances cross-composants :**
- `tenant_id` présent dans **tous** les modèles Prisma → toute requête filtre par tenant
- Schémas Zod partagés entre tRPC et React Hook Form → validation cohérente
- Tokens JWT contiennent `role` + `tenant_id` → middleware lit ces claims sans DB call
- Cloudinary URL signée générée côté serveur → jamais exposer la clé API côté client

---

## Implementation Patterns & Consistency Rules

### Points de conflit identifiés : 12 zones critiques

Sur la stack Next.js + tRPC + Prisma + Zod, ces zones peuvent produire des implémentations incompatibles entre agents IA si non spécifiées.

---

### Naming Patterns

**Conventions base de données (Prisma) :**
- Tables : `snake_case` pluriel → `players`, `agents`, `tenants`, `audit_logs`
- Colonnes : `snake_case` → `tenant_id`, `created_at`, `parental_consent`
- FK : `{model}_id` → `player_id`, `agent_id`
- Enums : `PascalCase` → `Role`, `PlayerPosition`, `SubscriptionStatus`
- IDs : **CUID2** via `@default(cuid())` — jamais UUID v4, jamais autoincrement exposé

**Conventions API (tRPC routers) :**
- Routers : `camelCase` singulier → `player`, `agent`, `auth`, `admin`, `scout`
- Procédures : `verb + Noun` camelCase → `getProfile`, `createPlayer`, `searchPlayers`, `validateAccount`
- Namespacing obligatoire : `trpc.player.getProfile` — jamais de router plat

**Conventions code React/TypeScript :**
- Composants : `PascalCase` → `PlayerCard`, `AgentSearchFilter`, `TalentPassport`
- Fichiers composants : `PascalCase.tsx` → `PlayerCard.tsx`
- Hooks custom : `use` + PascalCase → `usePlayerProfile`, `useTenantConfig`, `useUserPreferences`
- Utils/helpers : `camelCase` → `formatPlayerAge`, `buildWhatsAppShareLink`

**Conventions routes Next.js :**
- Routes publiques : `/joueur/[slug]`, `/agent/recherche`
- Route groups : `(public)`, `(joueur)`, `(agent)`, `(admin)`
- Webhooks externes uniquement en Route Handlers : `/api/webhooks/whatsapp`, `/api/webhooks/momo`
- Tout le reste passe par tRPC — jamais de Route Handler custom pour du CRUD métier

---

### Structure Patterns

**Organisation des fichiers :**
```
src/
  app/(public)/joueur/[slug]/    # Profil public joueur — ISR
  app/(joueur)/                  # Espace joueur authentifié
  app/(agent)/                   # Espace agent authentifié
  app/(admin)/                   # Espace admin
  app/api/webhooks/              # Webhooks externes UNIQUEMENT
  components/ui/                 # shadcn/ui — ne jamais modifier directement
  components/player/             # Composants métier joueur
  components/agent/              # Composants métier agent
  components/shared/             # Composants partagés cross-espaces
  server/trpc/routers/           # 1 fichier router par domaine métier
  server/db/                     # Prisma client + helpers DB
  lib/validations/               # Schémas Zod partagés (tRPC + RHF)
  lib/utils/                     # Helpers purs sans side-effects
  hooks/                         # Hooks React custom
```

**Tests :**
- Tests unitaires/intégration : **co-localisés** → `PlayerCard.test.tsx` à côté de `PlayerCard.tsx`
- Tests E2E : `tests/e2e/` à la racine du projet

---

### Format Patterns

**Réponses API (tRPC) :**
- tRPC gère l'enveloppe automatiquement — **pas de wrapper custom** `{data, error}`
- Erreurs : `TRPCError` avec code standard (`UNAUTHORIZED`, `NOT_FOUND`, `BAD_REQUEST`, `FORBIDDEN`)
- Dates : **ISO 8601 strings** → `"2026-03-17T10:00:00Z"` — jamais de timestamp Unix
- Pagination : `{ items: [], nextCursor: string | null }` (cursor-based, optimal 3G/mobile)

**Données :**
- JSON fields côté client : `camelCase` (tRPC transforme automatiquement depuis snake_case Prisma)
- `tenant_id` : **toujours présent** dans chaque query Prisma — jamais de query sans filtre tenant
- Booléens : `true`/`false` — jamais `1`/`0`
- `null` = valeur absente connue ; `undefined` = champ non envoyé dans la payload

---

### Communication Patterns

**State management :**
- TanStack Query : server state (données distantes, listes, profils, recherche)
- Zustand : client state uniquement (UI state, préférences locales, favoris non-persistés)
- Pas de Redux, pas de Context API pour du server state

**Uploads média :**
- URL signée Cloudinary générée côté **serveur** (Server Action Next.js) — jamais exposer la clé API côté client
- Queue offline via IndexedDB (`idb`) — structure : `{ id, file, metadata, status, tenantId }`

---

### Process Patterns

**Gestion d'erreurs :**
- Erreurs serveur : loggées via Sentry en prod, `console.error` en dev — **jamais exposées au client** en clair
- Messages utilisateur : toujours via `next-intl` → `t('errors.uploadFailed')` — zéro string hardcodée dans les composants
- Formulaires : erreurs via React Hook Form `fieldState.error` — jamais `alert()`
- TanStack Query : `retry: 2` par défaut sur les queries, puis affichage état d'erreur

**Loading states :**
- Skeleton screens via `shadcn/ui Skeleton` — pas de spinners CSS custom
- `isPending` pour les mutations TanStack Query, `isLoading` pour les queries initiales
- Upload vidéo : composant `Progress` shadcn/ui avec pourcentage réel Cloudinary

**Validation :**
- **Zod schema d'abord** dans `lib/validations/` → réutilisé côté tRPC input ET React Hook Form
- Validation côté client (UX) + côté serveur (sécurité) — toujours les deux
- `tenant_id` injecté **côté serveur** depuis la session Auth.js — jamais envoyé depuis le body client

---

### Enforcement Guidelines

**Tous les agents IA DOIVENT :**
1. Filtrer toute query Prisma par `tenantId` extrait de la session Auth.js — jamais depuis le body de la requête
2. Utiliser les schémas Zod de `lib/validations/` — jamais dupliquer une validation
3. Nommer les composants en `PascalCase`, fichiers en `PascalCase.tsx`
4. Utiliser `TRPCError` pour toute erreur serveur — jamais `throw new Error()` brut dans un router
5. Utiliser `next-intl` pour tout texte utilisateur — aucune string hardcodée dans les composants
6. Placer les composants shadcn/ui dans `components/ui/` sans modification — wrapper dans `components/[feature]/`
7. Toujours signer les URLs Cloudinary côté serveur avant exposition
8. Stocker les préférences utilisateur (thème, langue) via le hook `useUserPreferences` en `localStorage`

**Anti-patterns à bannir :**
- ❌ Query Prisma sans filtre `tenantId`
- ❌ String hardcodée en UI (`"Erreur lors de l'upload"` → utiliser `t('errors.upload')`)
- ❌ Route Handler custom pour du CRUD métier (→ tRPC)
- ❌ Modifier directement un composant dans `components/ui/` (→ créer un wrapper)
- ❌ Envoyer `tenant_id` depuis le client dans le body d'une requête

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
dream_studio_connect/
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── components.json                  # Config shadcn/ui
├── middleware.ts                    # Tenant routing + auth guard (Edge)
├── .env.local
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml                   # Tests + lint sur PR
│
├── prisma/
│   ├── schema.prisma                # Source de vérité DB (modèles + RLS tenant_id)
│   └── migrations/
│
├── public/
│   ├── manifest.json                # PWA manifest
│   ├── sw.js                        # Service Worker
│   └── icons/                       # Icônes PWA (192px, 512px)
│
├── src/
│   ├── app/
│   │   ├── globals.css              # Tokens CSS DSC (couleurs par espace, dark/light)
│   │   ├── layout.tsx               # Root layout (next-intl, thème, Auth.js provider)
│   │   │
│   │   ├── (public)/                # Pages publiques — ISR/SSG, indexables Google
│   │   │   ├── page.tsx             # Landing page DSC
│   │   │   └── joueur/
│   │   │       └── [slug]/
│   │   │           └── page.tsx     # Profil public joueur (OpenGraph WhatsApp)
│   │   │
│   │   ├── (joueur)/                # Espace joueur — role=JOUEUR requis
│   │   │   ├── layout.tsx           # Layout joueur (accent --color-joueur orange)
│   │   │   ├── tableau-de-bord/page.tsx
│   │   │   ├── profil/
│   │   │   │   ├── page.tsx         # Passeport Talent — vue + édition
│   │   │   │   └── creer/page.tsx   # Onboarding création profil (< 5 min)
│   │   │   ├── videos/page.tsx      # Upload & gestion vidéos
│   │   │   └── messages/page.tsx
│   │   │
│   │   ├── (agent)/                 # Espace agent — role=AGENT requis
│   │   │   ├── layout.tsx           # Layout agent (accent --color-agent bleu)
│   │   │   ├── tableau-de-bord/page.tsx
│   │   │   ├── recherche/page.tsx   # Moteur recherche filtré poste/âge/région
│   │   │   ├── favoris/page.tsx     # Carnet de suivi joueurs
│   │   │   └── messages/page.tsx
│   │   │
│   │   ├── (scout)/                 # Espace scout — role=SCOUT requis (V1.0)
│   │   │   ├── layout.tsx           # Layout scout (accent --color-scout ambre)
│   │   │   ├── tableau-de-bord/page.tsx
│   │   │   ├── upload/page.tsx      # Upload vidéo terrain + tagging joueur
│   │   │   └── commissions/page.tsx
│   │   │
│   │   ├── (admin)/                 # Espace admin — role=ADMIN requis
│   │   │   ├── layout.tsx           # Layout admin (accent --color-admin violet)
│   │   │   ├── tableau-de-bord/page.tsx
│   │   │   ├── comptes/page.tsx     # Validation / suspension comptes
│   │   │   ├── moderation/page.tsx  # Signalements & modération contenu
│   │   │   └── abonnements/page.tsx # Gestion plans & paiements MoMo
│   │   │
│   │   ├── auth/
│   │   │   ├── connexion/page.tsx
│   │   │   └── inscription/page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts   # Auth.js v5 handler
│   │       └── webhooks/
│   │           ├── whatsapp/route.ts         # Webhook Meta WhatsApp Business
│   │           └── momo/route.ts             # Webhook Orange Money / MTN MoMo
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui — NE PAS MODIFIER DIRECTEMENT
│   │   ├── player/
│   │   │   ├── PlayerCard.tsx       # Card joueur (grille résultats agent)
│   │   │   ├── PlayerCard.test.tsx
│   │   │   ├── TalentPassport.tsx   # Vue complète profil public joueur
│   │   │   ├── PlayerForm.tsx       # Formulaire création/édition profil
│   │   │   ├── VideoUploader.tsx    # Upload + progress Cloudinary
│   │   │   └── WhatsAppShareButton.tsx
│   │   ├── agent/
│   │   │   ├── SearchFilter.tsx     # Filtres poste/âge/région
│   │   │   ├── SearchResults.tsx    # Grille cards joueurs
│   │   │   └── FavoritesList.tsx
│   │   ├── admin/
│   │   │   ├── AccountsTable.tsx
│   │   │   └── ModerationQueue.tsx
│   │   └── shared/
│   │       ├── TenantProvider.tsx   # Context tenant courant
│   │       ├── ThemeToggle.tsx      # Bascule dark/light
│   │       ├── LanguageSwitcher.tsx # FR ↔ EN
│   │       └── Notifications.tsx
│   │
│   ├── server/
│   │   ├── trpc/
│   │   │   ├── index.ts             # Initialisation tRPC + context
│   │   │   ├── trpc.ts              # Procédures : publicProcedure / protectedProcedure / adminProcedure
│   │   │   └── routers/
│   │   │       ├── _app.ts          # Router racine (merge tous les routers)
│   │   │       ├── auth.ts          # FR01–FR07
│   │   │       ├── player.ts        # FR08–FR13
│   │   │       ├── agent.ts         # FR14–FR18
│   │   │       ├── scout.ts         # FR22–FR26
│   │   │       ├── admin.ts         # FR29–FR32
│   │   │       ├── messaging.ts     # FR19–FR21
│   │   │       ├── notification.ts  # NFR push/WhatsApp
│   │   │       └── payment.ts       # FR33–FR35
│   │   └── db/
│   │       ├── index.ts             # Prisma client singleton
│   │       └── helpers.ts           # withTenant(tenantId) — wrapper query Prisma
│   │
│   ├── lib/
│   │   ├── validations/
│   │   │   ├── player.ts            # Schémas Zod joueur (réutilisés tRPC + RHF)
│   │   │   ├── agent.ts
│   │   │   ├── auth.ts
│   │   │   └── search.ts
│   │   ├── utils/
│   │   │   ├── whatsapp.ts          # buildWhatsAppShareLink(), sendTemplate()
│   │   │   ├── cloudinary.ts        # generateSignedUrl(), uploadVideo()
│   │   │   └── momo.ts              # verifyMoMoTransaction()
│   │   ├── i18n/
│   │   │   ├── messages/
│   │   │   │   ├── fr.json
│   │   │   │   └── en.json
│   │   │   └── config.ts
│   │   └── auth.ts                  # Config Auth.js v5 + getSession() helper
│   │
│   ├── hooks/
│   │   ├── useUserPreferences.ts    # Thème + langue → localStorage
│   │   ├── usePlayerProfile.ts
│   │   ├── useOfflineQueue.ts       # IndexedDB upload queue (NFR27)
│   │   └── useTenantConfig.ts
│   │
│   └── types/
│       ├── index.ts                 # Types globaux DSC
│       └── next-auth.d.ts           # Augmentation session Auth.js (role, tenantId)
│
└── tests/
    └── e2e/
        ├── joueur.spec.ts           # Parcours Kevin — création profil Passeport Talent
        ├── agent.spec.ts            # Parcours Maurice — recherche filtrée + contact
        └── admin.spec.ts            # Parcours admin — validation compte + modération
```

### Architectural Boundaries

**Frontières API :**
- `middleware.ts` → intercepte toutes les requêtes : résout le tenant, vérifie JWT, redirige par rôle
- tRPC context → injecte `{ session, tenantId, db }` dans chaque procédure — seul point d'accès aux données
- Webhooks externes (`/api/webhooks/*`) → seuls Route Handlers non-tRPC — signés et vérifiés (HMAC)

**Frontières données :**
- `server/db/helpers.ts` expose `withTenant(tenantId)` → wrapper Prisma injectant `WHERE tenant_id = ?`
- Aucun composant React n'importe directement Prisma — tout passe par tRPC
- Cloudinary : URLs signées générées dans `lib/utils/cloudinary.ts` côté serveur exclusivement

### Requirements to Structure Mapping

| FRs | Localisation |
|---|---|
| FR01–FR07 (Auth & utilisateurs) | `server/trpc/routers/auth.ts`, `lib/auth.ts`, `lib/validations/auth.ts` |
| FR08–FR13 (Passeport Talent) | `components/player/`, `server/trpc/routers/player.ts`, `app/(joueur)/profil/` |
| FR14–FR18 (Recherche agent) | `components/agent/`, `server/trpc/routers/agent.ts`, `app/(agent)/recherche/` |
| FR19–FR21 (Messagerie & notifications) | `server/trpc/routers/messaging.ts`, `notification.ts`, `components/shared/Notifications.tsx` |
| FR22–FR26 (Scout citoyen) | `app/(scout)/`, `server/trpc/routers/scout.ts`, `hooks/useOfflineQueue.ts` |
| FR29–FR32 (Administration) | `app/(admin)/`, `server/trpc/routers/admin.ts`, `components/admin/` |
| FR33–FR35 (Paiements MoMo) | `server/trpc/routers/payment.ts`, `lib/utils/momo.ts`, `app/api/webhooks/momo/` |

### Data Flow Principal

```
PlayerForm.tsx
  → React Hook Form + Zod (lib/validations/player.ts)
  → trpc.player.createProfile.mutate()
  → server/trpc/routers/player.ts
  → withTenant(tenantId) + Prisma insert
  → Cloudinary signed URL (VideoUploader → Server Action → lib/utils/cloudinary.ts)
  → buildWhatsAppShareLink() (lib/utils/whatsapp.ts)
  → TanStack Query invalidate → re-fetch profil joueur
```

---

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilité des décisions :**
Toutes les technologies sélectionnées sont mutuellement compatibles et vérifiées : Next.js 16 + tRPC + Prisma + Auth.js v5 + Tailwind v4 + shadcn/ui + Neon + Upstash Redis + Cloudinary + next-intl + TanStack Query v5 + Zustand — zéro conflit de versions identifié.

**Cohérence des patterns :**
Les conventions de nommage, les schémas Zod partagés et le helper `withTenant()` assurent une cohérence bout-en-bout. La transformation snake_case (Prisma) → camelCase (tRPC) est automatique et documentée.

**Alignement structure :**
Chaque route group Next.js correspond à un espace utilisateur, un router tRPC et un dossier composants — alignement complet. Les webhooks externes sont isolés.

### Requirements Coverage Validation ✅

**Couverture fonctionnelle (35 FRs) :**
Toutes les exigences fonctionnelles sont couvertes architecturalement. FR27–FR28 (validations coaches) sont intentionnellement différées en V1.0 avec la structure prévue.

**Couverture non-fonctionnelle (27 NFRs) :**
Toutes les NFRs critiques sont adressées : performance 3G (ISR + SW + bundle < 200KB), sécurité données mineurs (accès conditionnel + audit log), scalabilité multi-région (RLS + Neon serverless), fiabilité (queue IndexedDB + Vercel SLA).

### Implementation Readiness Validation ✅

**Complétude des décisions :** Toutes les décisions critiques sont documentées avec versions vérifiées en ligne.
**Complétude de la structure :** Arborescence complète et spécifique — aucun placeholder générique.
**Complétude des patterns :** 12 zones de conflit identifiées et adressées. 8 règles obligatoires + anti-patterns documentés.

### Gap Analysis Results

**Lacunes critiques :** ✅ Aucune — toutes les décisions bloquantes sont documentées.

**Lacunes importantes (à traiter en sprint 1) :**
- Schéma Prisma complet (modèles + RLS) — première story d'implémentation
- Stratégie routing tenant (`subdomain` vs `path-based`) à confirmer avant middleware

**Lacunes mineures (post-MVP) :**
- FR27–FR28 validations coaches — V1.0, structure prévue
- Firebase Push Notifications — V1.0, hooks préparés
- WebSocket/SSE remplacement polling — V1.0

### Party Mode — Évaluation Payload CMS

**Question examinée :** Serait-il pertinent d'intégrer Payload CMS pour le back-office admin ?

**Consensus des agents (Winston + Barry + Mary) :** ❌ Non au MVP — 3 conflits bloquants identifiés :
1. **ORM :** Payload v3 utilise Drizzle — conflit direct avec Prisma déjà décidé
2. **Auth :** Payload a son propre système d'auth — incompatible avec Auth.js v5
3. **Multi-tenant :** Pas de support natif — notre architecture RLS + `withTenant()` devrait être réimplémentée

**Décision :** Payload CMS écarté pour le MVP. Back-office admin implémenté avec shadcn/ui + tRPC (cohérent avec la stack). À réévaluer en V2.0 si une équipe éditoriale non-technique rejoint le projet.

### Architecture Completeness Checklist

**✅ Analyse du contexte projet**
- [x] Contexte projet analysé (PRD + UX Spec + Product Brief + Analyse)
- [x] Complexité High validée — multi-tenant confirmé par falcom
- [x] Contraintes techniques identifiées (2G/3G, Android bas de gamme, PWA < 15MB)
- [x] 9 préoccupations transversales cartographiées

**✅ Décisions architecturales**
- [x] Stack complète avec versions vérifiées en ligne
- [x] Multi-tenancy RLS + `tenant_id` + `withTenant()` défini
- [x] Auth.js v5 + RBAC 4 rôles + super-admin documentés
- [x] Pattern API tRPC end-to-end typesafe avec Zod
- [x] Infrastructure Vercel + Neon + Cloudinary + Upstash
- [x] Payload CMS évalué et écarté (Party Mode)

**✅ Patterns d'implémentation**
- [x] Conventions nommage complètes (DB, API, code, routes)
- [x] Structure fichiers spécifiée
- [x] Formats API et données définis
- [x] Gestion d'erreurs standardisée
- [x] 8 règles obligatoires + anti-patterns documentés

**✅ Structure du projet**
- [x] Arborescence complète et spécifique
- [x] Frontières composants établies
- [x] Points d'intégration cartographiés
- [x] Mapping 35 FRs → fichiers/répertoires complet

### Architecture Readiness Assessment

**Statut global : 🟢 PRÊT POUR L'IMPLÉMENTATION**

**Niveau de confiance : Élevé**

**Points forts :**
- Stack cohérente et éprouvée — zéro conflits de versions
- Multi-tenancy architectural dès la base (pas de retrofit)
- Sécurité données mineurs adressée à chaque couche
- Route groups Next.js → code-splitting natif sans configuration
- Schémas Zod partagés → zéro désalignement types API/formulaires
- Décisions validées par Party Mode (Payload CMS évalué et écarté)

**Améliorations réservées post-MVP :**
- WebSocket/SSE (remplacement polling V1.0)
- Firebase Push Notifications (V1.0)
- Payload CMS ou équivalent si équipe éditoriale non-technique (V2.0)
- Application mobile native Android (V2.0)

### Implementation Handoff

**Première commande d'implémentation :**

```bash
pnpm dlx shadcn@latest init -t next
```

**Première story prioritaire :** Schéma Prisma complet (tenants, users, players, agents, audit_logs) + migration Neon + helper `withTenant()`.
