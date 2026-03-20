# Story 1.4 — Inscription multi-rôle & consentement parental

## Status: in-progress

---

## Story

**En tant que** visiteur non authentifié,
**je veux** pouvoir créer un compte avec le rôle JOUEUR ou AGENT,
**afin de** accéder à la plateforme Dream Studio Connect selon mon profil.

---

## Acceptance Criteria

- [x] AC1 — Formulaire d'inscription avec rôle sélectionnable (JOUEUR / AGENT)
- [x] AC2 — Compte créé avec le rôle sélectionné, rattaché au tenant courant ; mot de passe haché bcrypt coût 12
- [x] AC3 — Email de confirmation envoyé (mock console.log — pas de vrai service email)
- [x] AC4 — Erreurs de saisie affichées (email invalide, email déjà utilisé, mot de passe trop court < 8 chars) en Français
- [x] AC5 — Si l'utilisateur déclare être mineur (checkbox "< 18 ans"), section consentement parental affichée avec lien PDF `/api/consentement-parental` + checkbox de confirmation
- [x] AC6 — Profil mineur : `isMinor=true`, `parentalConsentValidated=false` à la création
- [x] AC7 — Labels ARIA explicites sur tous les champs (aria-label ou htmlFor + id)
- [x] AC8 — Navigation clavier possible (tabIndex, pas de piège focus)
- [x] AC9 — Lien d'invitation WhatsApp : la page `/auth/inscription?role=JOUEUR&tenantSlug=dev` pré-remplit le rôle et le tenant

---

## Tasks

- [x] T1 — Créer `src/lib/register-schema.ts` (Zod schema + types, sans `'use server'`)
- [x] T2 — Créer `src/lib/register.ts` (Server Action `registerUser` uniquement)
- [x] T3 — Créer `src/app/api/consentement-parental/route.ts` (mock PDF HTML)
- [x] T4 — Créer `src/components/auth/RegisterForm.tsx` (formulaire client complet)
- [x] T5 — Créer `src/app/auth/inscription/page.tsx` (page avec searchParams role/tenantSlug)
- [x] T6 — Mettre à jour `src/app/auth/connexion/page.tsx` (lien "Créer un compte")
- [x] T7 — Créer `src/lib/register.test.ts` (8 tests Vitest T1-T8)
- [x] T8 — Mettre à jour `_bmad-output/implementation-artifacts/sprint-status.yaml`
- [x] T9 — Créer ce fichier `_bmad-output/implementation-artifacts/1-4-inscription-multi-role-consentement.md`

---

## Dev Notes

### Architecture `'use server'`

Les fichiers `'use server'` Next.js ne peuvent exporter **que des fonctions async** — pas d'objets ni de types.
Le schéma Zod et les types sont donc séparés dans `register-schema.ts` (sans directive), importés par `register.ts`.

- `src/lib/register-schema.ts` — Zod schema + types (importable côté client et serveur)
- `src/lib/register.ts` — `'use server'` + `registerUser` uniquement

### Autres points

- Le hachage bcrypt se fait avec un coût de 12 (conforme NFR08)
- L'import Prisma se fait via `@/server/db` (singleton PrismaNeon)
- `RegisterForm` : `suppressHydrationWarning` sur les `<input>` pour les extensions navigateur
- La page d'inscription lit les `searchParams` en async (Next.js 15+)
- Le lien WhatsApp fonctionne via query params : `/auth/inscription?role=JOUEUR&tenantSlug=dev`
- `parentalConsentValidated` est toujours `false` à la création (validation manuelle par l'équipe)

---

## File List

| Fichier | Action |
|---------|--------|
| `src/lib/register-schema.ts` | Créé — Zod schema + types (Edge-safe) |
| `src/lib/register.ts` | Créé — Server Action `registerUser` |
| `src/lib/register.test.ts` | Créé |
| `src/app/auth/inscription/page.tsx` | Modifié (stub → implémentation complète) |
| `src/app/api/consentement-parental/route.ts` | Créé |
| `src/components/auth/RegisterForm.tsx` | Créé |
| `src/app/auth/connexion/page.tsx` | Modifié (ajout lien "Créer un compte") |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | Modifié |
| `_bmad-output/implementation-artifacts/1-4-inscription-multi-role-consentement.md` | Créé |

---

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-03-20 | 0.1.0 | Implémentation initiale Story 1.4 | Dev Agent |
