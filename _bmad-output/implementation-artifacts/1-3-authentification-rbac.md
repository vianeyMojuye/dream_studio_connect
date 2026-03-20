# Story 1.3 : Authentification & RBAC (Auth.js v5, 4 rôles)

Status: in-progress

---

## Story

As a utilisateur inscrit,
I want pouvoir me connecter avec mon email et mon mot de passe et être redirigé vers mon espace selon mon rôle,
So that chaque utilisateur accède uniquement aux fonctionnalités de son rôle, de façon sécurisée.

---

## Acceptance Criteria

1. **AC1** — L'utilisateur peut se connecter via `/auth/connexion` avec email + mot de passe → JWT contenant `role` + `tenantId`.
2. **AC2** — Redirection post-login vers l'espace du rôle : `/joueur/tableau-de-bord`, `/agent/tableau-de-bord`, `/scout/tableau-de-bord`, `/admin/tableau-de-bord`.
3. **AC3** — Le middleware Next.js bloque l'accès aux routes d'un autre rôle (RBAC).
4. **AC4** — Mots de passe hachés avec bcrypt coût ≥ 12 (NFR08).
5. **AC5** — Tokens JWT expirent en ≤ 24h (NFR09).
6. **AC6** — Erreur sans révéler si l'email existe (message générique) ; compte suspendu → message clair.
7. **AC7** — `AUTH_SECRET` configuré, types session augmentés avec `role` + `tenantId`.

---

## Tasks / Subtasks

- [x] **T1 — Installer les dépendances Auth.js v5** (AC: 1, 4, 7)
  - [x] T1.1 — `pnpm add next-auth@beta`
  - [x] T1.2 — `pnpm add bcryptjs zod` + `pnpm add -D @types/bcryptjs`
  - [x] T1.3 — `AUTH_SECRET` documenté dans `.env.example`

- [x] **T2 — Configurer Auth.js v5** (AC: 1, 4, 5, 6)
  - [x] T2.1 — `src/lib/auth.ts` : config NextAuth avec Credentials provider, bcrypt verify, JWT strategy 24h
  - [x] T2.2 — `src/app/api/auth/[...nextauth]/route.ts` : handlers GET + POST
  - [x] T2.3 — Callbacks JWT + session pour propager `role` + `tenantId`

- [x] **T3 — Augmenter les types session** (AC: 7)
  - [x] T3.1 — `src/types/next-auth.d.ts` : `User`, `Session`, `JWT` augmentés avec `role: Role` + `tenantId: string`

- [x] **T4 — Middleware RBAC** (AC: 2, 3)
  - [x] T4.1 — `src/middleware.ts` : wrapper `auth()` Auth.js v5 + RBAC par rôle
  - [x] T4.2 — Redirection non-authentifié → `/auth/connexion`
  - [x] T4.3 — Redirection mauvais rôle → tableau-de-bord du rôle correct

- [x] **T5 — Page de connexion** (AC: 1, 2, 6)
  - [x] T5.1 — `src/app/auth/connexion/page.tsx` : page Auth avec formulaire
  - [x] T5.2 — `src/components/auth/LoginForm.tsx` : formulaire React avec validation Zod
  - [x] T5.3 — Gestion erreurs : identifiants invalides, compte suspendu

- [x] **T6 — Tests et vérification** (AC: 1–7)
  - [x] T6.1 — `src/lib/auth.test.ts` : 7 tests Vitest ✅ (authorize, RBAC, cas d'erreur)
  - [x] T6.2 — `pnpm typecheck` : 0 erreur ✅
  - [x] T6.3 — `pnpm build` : propre, 12 routes ✅

---

## Dev Notes

### ⚠️ CONTEXTE CRITIQUE — Dépendances Stories 1.1 + 1.2

- Story 1.1 a créé le stub `src/middleware.ts` → **remplacer le contenu**
- Story 1.2 a créé `src/server/db/index.ts` (singleton Prisma) + `withTenant()` → **importer et utiliser**
- Le modèle `User` avec `passwordHash`, `role`, `tenantId`, `isSuspended` est disponible

### Configuration Auth.js v5 attendue (src/lib/auth.ts)

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/server/db'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  tenantSlug: z.string().min(1),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
        tenantSlug: { label: 'Tenant', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password, tenantSlug } = parsed.data

        const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
        if (!tenant) return null

        const user = await prisma.user.findUnique({
          where: { email_tenantId: { email, tenantId: tenant.id } },
        })
        if (!user) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        if (user.isSuspended) throw new Error('ACCOUNT_SUSPENDED')

        return { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.tenantId = (user as any).tenantId
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as any
      session.user.tenantId = token.tenantId as string
      return session
    },
  },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  pages: { signIn: '/auth/connexion' },
})
```

### Types augmentés attendus (src/types/next-auth.d.ts)

```typescript
import type { Role } from '@/generated/prisma/client'

declare module 'next-auth' {
  interface User {
    role: Role
    tenantId: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      tenantId: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    tenantId: string
  }
}
```

### Middleware RBAC attendu (src/middleware.ts)

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const ROLE_REDIRECT: Record<string, string> = {
  JOUEUR: '/joueur/tableau-de-bord',
  AGENT: '/agent/tableau-de-bord',
  SCOUT: '/scout/tableau-de-bord',
  ADMIN: '/admin/tableau-de-bord',
}

const ROLE_PREFIX: Record<string, string> = {
  JOUEUR: '/joueur',
  AGENT: '/agent',
  SCOUT: '/scout',
  ADMIN: '/admin',
}

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const path = nextUrl.pathname

  if (!session) {
    return NextResponse.redirect(new URL('/auth/connexion', req.url))
  }

  const role = session.user.role
  const allowedPrefix = ROLE_PREFIX[role]

  if (allowedPrefix && !path.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(ROLE_REDIRECT[role], req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/joueur/:path*', '/agent/:path*', '/scout/:path*', '/admin/:path*'],
}
```

### Route handler (src/app/api/auth/[...nextauth]/route.ts)

```typescript
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

### Variables d'environnement requises

```env
AUTH_SECRET="your-auth-secret-here"  # openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

### Règles CRITIQUES architecture

1. **`tenantId` vient du JWT** — jamais depuis le body client
2. **bcrypt coût ≥ 12** — obligatoire (NFR08)
3. **JWT maxAge ≤ 24h** — obligatoire (NFR09)
4. **Message d'erreur générique** — ne pas révéler si l'email existe
5. **Middleware Edge Runtime** — Auth.js v5 `auth()` est compatible Edge

### Learnings Stories 1.1 + 1.2 applicables

- **pnpm obligatoire** — `pnpm add`, jamais `npm install`
- **Prisma 7 adapter-first** — importer depuis `@/server/db` (singleton PrismaNeon)
- **pnpm build doit rester propre** après chaque tâche
- **`src/generated/prisma/client`** — chemin d'import du client Prisma généré

### Dépendances introduites

| Package | Usage |
|---|---|
| `next-auth@beta` | Auth.js v5 — authentification JWT |
| `bcryptjs` | Hachage mots de passe (coût ≥ 12) |
| `zod` | Validation schéma credentials |

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List

- `_bmad-output/implementation-artifacts/1-3-authentification-rbac.md` — créé
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — modifié (in-progress)

### Change Log

- 2026-03-19 : Story créée, implémentation démarrée
