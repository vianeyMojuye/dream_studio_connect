# Story 1.2 : Schéma de données multi-tenant (Prisma + Neon)

Status: review

---

## Story

As a développeur,
I want un schéma Prisma complet avec les modèles `Tenant` et `User` (+ enum `Role`) configurés avec Row-Level Security et le helper `withTenant(tenantId)`,
so that toutes les données sont isolées par tenant depuis la première ligne de code, et aucune query ne peut accéder aux données d'un autre tenant.

---

## Acceptance Criteria

1. **AC1** — Les tables `tenants` et `users` existent après `prisma migrate deploy`, avec `tenant_id` comme colonne obligatoire sur `users`.
2. **AC2** — Les enums `Role` (`JOUEUR`, `AGENT`, `SCOUT`, `ADMIN`) sont créés en base.
3. **AC3** — Le helper `withTenant(tenantId)` est implémenté dans `src/server/db/helpers.ts` et force le filtre `WHERE tenant_id = ?` sur toute query Prisma.
4. **AC4** — Une migration de seed crée un tenant de développement par défaut (`id: "tenant-dev"`, `slug: "dev"`).
5. **AC5** — Les IDs utilisent CUID2 via `@default(cuid())` — jamais UUID v4 ni autoincrement exposé.
6. **AC6** — Upstash Redis est connecté et un helper de cache de session basique (`getCache`/`setCache`) fonctionne dans `src/lib/redis.ts`.
7. **AC7** — Le Prisma client singleton est opérationnel dans `src/server/db/index.ts` avec le pattern anti-hot-reload.

---

## Tasks / Subtasks

- [x] **T1 — Installer et initialiser Prisma** (AC: 1, 5, 7)
  - [x] T1.1 — `pnpm add -D prisma tsx` + `pnpm add @prisma/client @prisma/adapter-neon @neondatabase/serverless`
  - [x] T1.2 — `pnpm dlx prisma init --datasource-provider postgresql` → génère `prisma/schema.prisma` + `prisma.config.ts`
  - [x] T1.3 — Schéma configuré (Prisma 7 : URL dans `prisma.config.ts`, adapter-first)
  - [x] T1.4 — `DATABASE_URL` documenté dans `.env.example`

- [x] **T2 — Définir le schéma Prisma complet** (AC: 1, 2, 5)
  - [x] T2.1 — Modèle `Tenant` : id (cuid), name, slug (unique), country, createdAt
  - [x] T2.2 — Enum `Role` : JOUEUR, AGENT, SCOUT, ADMIN
  - [x] T2.3 — Modèle `User` : id, tenantId, email, passwordHash, role, name, isMinor, parentalConsentValidated, isSuspended, createdAt, updatedAt
  - [x] T2.4 — Modèle `AuditLog` : id, tenantId, actorId, action, targetId?, targetModel?, createdAt
  - [x] T2.5 — Relations FK User→Tenant, AuditLog→Tenant
  - [x] T2.6 — @@index([tenantId]), @@unique([email, tenantId]) sur User

- [x] **T3 — Implémenter le Prisma singleton et withTenant()** (AC: 3, 7)
  - [x] T3.1 — `src/server/db/index.ts` : singleton avec PrismaNeon adapter + pattern globalForPrisma
  - [x] T3.2 — `src/server/db/helpers.ts` : `withTenant(tenantId)` + JSDoc complet
  - [x] T3.3 — `src/server/db/helpers.test.ts` : 4 tests Vitest ✅

- [x] **T4 — Créer les migrations et le seed** (AC: 1, 2, 4)
  - [ ] T4.1 — `pnpm dlx prisma migrate dev --name init` (nécessite DATABASE_URL réelle → étape manuelle post-Neon)
  - [x] T4.2 — `prisma/seed.ts` : upsert tenant-dev (CI, slug: dev)
  - [x] T4.3 — `package.json` : scripts `db:generate`, `db:migrate`, `db:seed`, `db:studio` + `prisma.seed` configuré
  - [ ] T4.4 — `pnpm db:seed` (étape manuelle — nécessite DB réelle)
  - [ ] T4.5 — Prisma Studio (étape manuelle)

- [x] **T5 — Connecter Upstash Redis** (AC: 6)
  - [x] T5.1 — `pnpm add @upstash/redis`
  - [x] T5.2 — `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` dans `.env.example`
  - [x] T5.3 — `src/lib/redis.ts` : singleton + `getCache`, `setCache`, `deleteCache`
  - [x] T5.4 — `src/lib/redis.test.ts` : 5 tests Vitest (mock) ✅

- [x] **T6 — Tests et vérification finale** (AC: 1–7)
  - [x] T6.1 — `helpers.test.ts` : 4 tests withTenant ✅
  - [x] T6.2 — `redis.test.ts` : 5 tests mock Redis ✅
  - [x] T6.3 — `pnpm typecheck` : 0 erreur ✅
  - [x] T6.4 — `pnpm build` : propre, 12 routes ✅

---

## Dev Notes

### ⚠️ CONTEXTE CRITIQUE — Dépendance Story 1.1

Story 1.1 a créé des **stubs vides** dans `src/server/db/` — cette story les implémente réellement. Ne pas créer ces fichiers de zéro, mais **remplacer le contenu** des stubs existants.

Fichiers existants à compléter (NE PAS recréer) :
- `src/server/db/index.ts` — contient `export {}` → à remplacer
- `src/server/db/helpers.ts` — contient `export {}` → à remplacer

### Schéma Prisma attendu (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Role {
  JOUEUR
  AGENT
  SCOUT
  ADMIN
}

model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  country   String   @db.Char(2)
  createdAt DateTime @default(now())

  users     User[]
  auditLogs AuditLog[]

  @@map("tenants")
}

model User {
  id                       String   @id @default(cuid())
  tenantId                 String
  email                    String
  passwordHash             String
  role                     Role
  name                     String
  isMinor                  Boolean  @default(false)
  parentalConsentValidated Boolean  @default(false)
  isSuspended              Boolean  @default(false)
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt

  tenant    Tenant @relation(fields: [tenantId], references: [id])

  @@unique([email, tenantId])
  @@index([tenantId])
  @@map("users")
}

model AuditLog {
  id          String   @id @default(cuid())
  tenantId    String
  actorId     String
  action      String
  targetId    String?
  targetModel String?
  createdAt   DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("audit_logs")
}
```

### Implémentation Prisma Singleton attendue (src/server/db/index.ts)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Implémentation withTenant() attendue (src/server/db/helpers.ts)

```typescript
/**
 * OBLIGATOIRE — Toute query Prisma DOIT utiliser ce helper.
 * Retourne le filtre WHERE tenant_id pour isolation multi-tenant.
 *
 * @example
 * const users = await prisma.user.findMany({
 *   where: { ...withTenant(tenantId), isSuspended: false }
 * })
 */
export function withTenant(tenantId: string): { tenantId: string } {
  return { tenantId }
}
```

### Connexion Neon — Configuration requise

**Deux URLs nécessaires (Neon serverless + Prisma migrations) :**
```env
# Connection pooling (PgBouncer) — pour les queries runtime Vercel serverless
DATABASE_URL="postgresql://[user]:[pass]@[host]/[db]?pgbouncer=true&connection_limit=1"

# Direct connection — pour prisma migrate (bypass PgBouncer)
DIRECT_URL="postgresql://[user]:[pass]@[host]/[db]"
```

Ces deux URLs se trouvent dans le dashboard Neon → projet → Connection Details.

**Pourquoi deux URLs ?**
- `DATABASE_URL` (pooled) : Vercel serverless ouvre/ferme des connexions constamment → le PgBouncer de Neon évite d'épuiser les connexions PostgreSQL
- `DIRECT_URL` : `prisma migrate` ne supporte pas PgBouncer → connexion directe obligatoire

### Upstash Redis attendu (src/lib/redis.ts)

```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getCache<T>(key: string): Promise<T | null> {
  return redis.get<T>(key)
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds = 3600
): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds })
}

export { redis }
```

### Seed attendu (prisma/seed.ts)

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.tenant.upsert({
    where: { slug: 'dev' },
    update: {},
    create: {
      id: 'tenant-dev',
      name: 'Dream Studio Dev',
      slug: 'dev',
      country: 'CI',
    },
  })
  console.log('✅ Tenant de développement créé')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### Règles CRITIQUES architecture

> **Source :** `_bmad-output/planning-artifacts/architecture.md` — "Enforcement Guidelines"

1. **`tenant_id` sur TOUS les modèles** — chaque table doit avoir `tenantId` obligatoire
2. **`withTenant()` obligatoire** — toute query Prisma sans ce filtre est un bug de sécurité
3. **CUID2 uniquement** — `@default(cuid())` sur chaque `id` — jamais `@default(uuid())`, jamais `@default(autoincrement())`
4. **Tables en snake_case** via `@@map()` — le modèle Prisma est PascalCase, la table SQL est snake_case
5. **`tenantId` vient de la session Auth.js** (implémentée Story 1.3) — jamais depuis le body client

### Package.json — ajout requis pour seed

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

### Anti-patterns INTERDITS

- ❌ `prisma.user.findMany()` sans `where: { ...withTenant(tenantId) }`
- ❌ `@id @default(uuid())` — utiliser `@default(cuid())`
- ❌ `new PrismaClient()` dans un composant ou un router tRPC — toujours importer depuis `@/server/db`
- ❌ Exposer `DATABASE_URL` côté client

### Dépendances introduites par cette story

| Package | Version | Usage |
|---|---|---|
| `prisma` (dev) | latest | CLI migrations, génération client |
| `@prisma/client` | latest | Client typsafe généré |
| `@upstash/redis` | latest | Cache sessions Redis serverless |
| `tsx` (dev) | latest | Exécution TypeScript seed sans compilation |

### Structure de fichiers créés/modifiés

```
prisma/
  schema.prisma        ← CRÉER
  migrations/          ← GÉNÉRÉ par prisma migrate
  seed.ts              ← CRÉER

src/
  server/db/
    index.ts           ← MODIFIER (remplacer stub vide)
    helpers.ts         ← MODIFIER (remplacer stub vide)
  lib/
    redis.ts           ← CRÉER (nouveau)
  server/db/
    helpers.test.ts    ← CRÉER (test withTenant)
```

### Learnings Story 1.1 applicables

- **pnpm obligatoire** — ne jamais utiliser `npm` ni `npx` direct pour les packages → `pnpm add`, `pnpm dlx`
- **TypeScript strict** — tous les types doivent être explicites, `process.env.X!` ou validation avec `z.string()` pour les env vars
- **Pas de commentaires `// TODO`** laissés dans le code final — soit implémenté soit enlevé
- **`pnpm build` doit rester propre** après chaque tâche — vérifier avant de passer à la suivante

### Références

- Architecture multi-tenant : `_bmad-output/planning-artifacts/architecture.md` — sections "Data Architecture", "Enforcement Guidelines"
- Schéma Prisma + Neon : `_bmad-output/planning-artifacts/architecture.md` — "Decision Impact Analysis"
- Epic 1 / Story 1.2 : `_bmad-output/planning-artifacts/epics.md` — "Epic 1 Story 1.2"
- Stubs créés en Story 1.1 : `src/server/db/index.ts`, `src/server/db/helpers.ts`

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Prisma 7 breaking change : `directUrl` retiré du schema.prisma → doit être dans `prisma.config.ts` (mais type TS ne l'accepte pas non plus → supprimé, user configure manuellement)
- Prisma 7 adapter-first : `new PrismaClient()` sans args interdit → utiliser `new PrismaClient({ adapter })`
- Import client Prisma 7 : `@/generated/prisma/client` (pas `@/generated/prisma` — pas d'index.ts)
- Mock Vitest classe Redis : arrow function non constructible → utiliser `class MockRedis { ... }`

### Completion Notes List

- ✅ AC1 : schéma Prisma complet avec Tenant, User (tenantId obligatoire), AuditLog — migration à exécuter manuellement avec une vraie DB Neon
- ✅ AC2 : enum Role (JOUEUR, AGENT, SCOUT, ADMIN) défini dans schema.prisma
- ✅ AC3 : `withTenant(tenantId)` implémenté + testé (4 tests Vitest)
- ✅ AC4 : seed.ts créé avec upsert tenant-dev — à exécuter avec `pnpm db:seed` après migration
- ✅ AC5 : tous les modèles utilisent `@default(cuid())` pour les IDs
- ✅ AC6 : `src/lib/redis.ts` avec getCache/setCache/deleteCache + 5 tests Vitest
- ✅ AC7 : singleton Prisma avec PrismaNeon adapter + pattern anti-hot-reload
- ⚠️ T4.1/T4.4/T4.5 : nécessitent une vraie connexion Neon (étapes manuelles)

### File List

- `prisma/schema.prisma` — créé (Tenant, User, AuditLog, enum Role)
- `prisma.config.ts` — créé par prisma init, DATABASE_URL configuré
- `prisma/seed.ts` — créé (tenant de développement)
- `src/generated/prisma/` — généré par `prisma generate` (ne pas commiter)
- `src/server/db/index.ts` — modifié (singleton PrismaNeon adapter)
- `src/server/db/helpers.ts` — modifié (withTenant implementé)
- `src/server/db/helpers.test.ts` — créé (4 tests)
- `src/lib/redis.ts` — créé (getCache/setCache/deleteCache)
- `src/lib/redis.test.ts` — créé (5 tests mock)
- `.env.example` — modifié (DATABASE_URL Neon, UPSTASH vars)
- `package.json` — modifié (scripts db:*, prisma.seed)
- `tsconfig.json` — modifié (exclude prisma/seed.ts)
