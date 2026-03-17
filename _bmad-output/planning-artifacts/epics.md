---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
workflowStatus: complete
completedAt: '2026-03-17'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
---

# dream_studio_connect - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for dream_studio_connect, decomposing the requirements from the PRD, UX Design et Architecture en stories implémentables et actionnables pour l'équipe de développement.

---

## Requirements Inventory

### Functional Requirements

FR01 : Un visiteur peut créer un compte (joueur, agent, scout) via formulaire ou lien WhatsApp
FR02 : Un utilisateur peut se connecter avec email/mot de passe
FR03 : Un utilisateur peut choisir la langue d'interface (FR/EN) et la conserver entre sessions
FR04 : Un utilisateur peut basculer entre thème dark et light avec persistance de préférence
FR05 : Un joueur mineur peut soumettre un formulaire de consentement parental téléchargeable
FR06 : L'administrateur peut valider, suspendre ou supprimer un compte utilisateur
FR07 : Un utilisateur peut supprimer son compte et ses données sur demande
FR08 : Un joueur peut créer un profil complet (nom, poste, âge, région, club, photo) en < 5 min
FR09 : Un joueur peut uploader au moins une vidéo de match (compression automatique côté serveur)
FR10 : Un joueur peut générer un lien de partage unique vers son profil
FR11 : Un joueur peut mettre à jour les informations de son profil à tout moment
FR12 : Un joueur peut consulter un score de complétude indiquant les informations manquantes
FR13 : Un visiteur peut consulter un profil joueur public via son lien de partage
FR14 : Un agent peut rechercher des joueurs par filtres combinés (poste, âge, région)
FR15 : Un agent peut filtrer les résultats par présence de vidéo ou de validation coach
FR16 : Un agent peut consulter le profil complet d'un joueur (photo, vidéos, stats, informations)
FR17 : Un agent peut ajouter un joueur à son carnet de suivi (favoris avec notes privées)
FR18 : Un agent peut recevoir des alertes sur les nouveaux profils correspondant à ses critères (V1.0)
FR19 : Un agent peut envoyer un message à un joueur via la messagerie de la plateforme
FR20 : Un joueur peut recevoir et répondre aux messages d'agents
FR21 : Un utilisateur peut recevoir des notifications (nouveau contact, nouveau clip, validation) dans un délai ≤ 60s après l'événement déclencheur
FR22 : Un scout citoyen peut uploader un clip vidéo et le lier au profil d'un joueur
FR23 : Un scout citoyen peut créer un profil joueur simplifié (proxy) depuis le terrain
FR24 : Le système peut mettre en queue un upload vidéo et le déclencher à la reconnexion réseau
FR25 : Un scout citoyen peut consulter le statut de ses commissions en attente et versées
FR26 : L'administrateur peut attribuer ou révoquer le badge Scout Citoyen Certifié
FR27 : Un coach enregistré peut valider la compétence d'un joueur sur son profil (V1.0)
FR28 : Un joueur peut afficher les badges de validation reçus sur son profil public (V1.0)
FR29 : L'administrateur peut consulter un tableau de bord de santé de la plateforme
FR30 : L'administrateur peut modérer et supprimer un contenu signalé (vidéo, profil)
FR31 : Un utilisateur peut signaler un contenu inapproprié ou un compte suspect
FR32 : L'administrateur peut configurer les plans tarifaires et valider les abonnements agents
FR33 : Un agent peut souscrire à un abonnement via Mobile Money (Orange Money / MTN MoMo)
FR34 : Un agent peut consulter l'historique et le statut de ses paiements
FR35 : Le système peut activer ou désactiver l'accès agent selon le statut d'abonnement

### NonFunctional Requirements

NFR01 : First Contentful Paint ≤ 3s sur connexion 3G (1.6 Mbps)
NFR02 : Time to Interactive ≤ 5s sur connexion 3G
NFR03 : Upload vidéo (clip 90s) complété en < 60s sur connexion 3G
NFR04 : Résultats de recherche affichés en < 2s pour une requête filtrée
NFR05 : Bundle PWA initial < 200KB gzippé (hors assets media)
NFR06 : Application installable et utilisable hors-ligne (lecture de profil en cache)
NFR07 : Toutes les communications chiffrées via HTTPS/TLS 1.3
NFR08 : Mots de passe stockés avec hachage bcrypt (coût ≥ 12)
NFR09 : Tokens d'authentification JWT avec expiration ≤ 24h et rotation par refresh token
NFR10 : Données personnelles des mineurs accessibles uniquement après validation consentement parental
NFR11 : Paiements traités uniquement via passerelle certifiée (Orange Money / MTN MoMo API officielle)
NFR12 : Journalisation des actions administrateur (audit log immuable)
NFR13 : Protection contre injections SQL, XSS et CSRF sur tous les endpoints
NFR14 : Architecture supportant 10 000 utilisateurs actifs simultanés sans dégradation > 10%
NFR15 : Infrastructure déployable dans de nouvelles régions géographiques sans refonte
NFR16 : Stockage vidéo scalable sans limite définie en avance (Cloudinary ou équivalent CDN)
NFR17 : Ratio de contraste ≥ 4.5:1 pour tout le texte (modes dark et light)
NFR18 : Tous les formulaires avec labels ARIA et messages d'erreur explicites
NFR19 : Navigation entièrement possible sans souris (clavier + touch)
NFR20 : Taille de texte minimale 16px sur mobile, scalable via paramètres système
NFR21 : WhatsApp Business API : respect des quotas Meta (opt-in explicite, templates approuvés)
NFR22 : Mobile Money API : confirmation de transaction côté serveur avant toute activation d'abonnement
NFR23 : Cloudinary CDN : vidéos servies depuis un nœud Afrique (Lagos ou Johannesburg)
NFR24 : Disponibilité des intégrations tierces : fallback gracieux si WhatsApp API indisponible
NFR25 : Uptime ≥ 99% hors maintenances planifiées (annoncées 48h à l'avance)
NFR26 : Sauvegarde automatique du brouillon de profil joueur toutes les 30s pendant la saisie
NFR27 : Queue d'upload offline persistée localement et synchronisée à la reconnexion

### Additional Requirements

**Architecture — Starter Template (CRITIQUE — impact Epic 1 Story 1) :**
- L'Architecture spécifie un starter template obligatoire : `pnpm dlx shadcn@latest init -t next` (Next.js 16 + shadcn/ui + Tailwind CSS v4)
- La première story d'implémentation DOIT initialiser ce projet avant tout développement
- Commandes d'init : `pnpm dlx shadcn@latest init -t next` puis `pnpm dlx shadcn@latest add button card input select badge progress sheet dialog skeleton toast`

**Architecture — Base de données & ORM :**
- PostgreSQL via Neon (serverless) avec Row-Level Security (RLS) pour multi-tenant
- Prisma comme ORM — schéma unique source de vérité avec `tenant_id` sur tous les modèles
- Upstash Redis pour le rate limiting, cache sessions, cache recherche
- Helper `withTenant(tenantId)` à créer dans `server/db/helpers.ts` — injecté dans toutes les queries Prisma

**Architecture — Authentification & Sécurité :**
- Auth.js v5 (NextAuth) — JWT + sessions, providers email/magic-link
- RBAC via middleware Next.js + rôles en JWT claims (4 rôles : JOUEUR, AGENT, SCOUT, ADMIN + super-admin DSC)
- Consentement parental : accès conditionnel `parental_consent_validated` en middleware
- Audit log immuable : table `audit_logs` PostgreSQL pour toutes actions admin

**Architecture — API & Communication :**
- tRPC end-to-end typesafe — patterns obligatoires : `trpc.player.getProfile`, `trpc.agent.searchPlayers`, etc.
- Zod schemas partagés dans `lib/validations/` — réutilisés tRPC input ET React Hook Form
- Webhooks externes UNIQUEMENT via Route Handlers : `/api/webhooks/whatsapp`, `/api/webhooks/momo`
- Tout le CRUD métier passe par tRPC — jamais de Route Handler custom pour du CRUD

**Architecture — Frontend :**
- TanStack Query v5 pour le server state (listes, profils, recherche)
- Zustand pour le client state (favorites locaux, préférences thème, upload offline queue state)
- next-intl pour l'i18n — FR + EN dès le sprint 1
- React Hook Form + Zod pour tous les formulaires
- IndexedDB via `idb` pour la queue d'uploads offline

**Architecture — Infrastructure & Déploiement :**
- Vercel pour hosting frontend/API (Edge Network global)
- GitHub Actions CI/CD — tests sur PR + déploiement Vercel preview
- Sentry pour monitoring erreurs runtime
- Vercel Analytics pour Core Web Vitals

**UX — Design System :**
- Couleurs par espace utilisateur : `--color-joueur` (orange), `--color-agent` (bleu), `--color-scout` (ambre), `--color-admin` (violet)
- Touch targets ≥ 44x44px sur tous les éléments interactifs
- Skeleton screens via `shadcn/ui Skeleton` — jamais de spinners CSS custom
- Mobile-first : écrans 360px–428px prioritaires

**UX — Comportements critiques :**
- Auto-save brouillon profil joueur toutes les 30s pendant la saisie (NFR26)
- Bouton WhatsApp persistant et toujours visible sur chaque fiche profil joueur
- Filtres de recherche agent persistants entre sessions
- Feedback immédiat sur upload vidéo : composant `Progress` avec % réel Cloudinary
- Onboarding joueur en étapes (pas tout d'un coup) avec barre de progression visible
- Responsive : Mobile (< 768px) prioritaire, Tablet (768-1024px) pour agents, Desktop (> 1024px) pour admin

**UX — Accessibilité :**
- WCAG 2.1 AA partiel dès le MVP : contraste ≥ 4.5:1, labels ARIA, alt text images
- Taille de texte minimale 16px sur mobile
- Navigation clavier + touch complète

### FR Coverage Map

FR01 : Epic 1 – Inscription joueur/agent/scout
FR02 : Epic 1 – Connexion email/mot de passe
FR03 : Epic 1 – Langue FR/EN persistée
FR04 : Epic 1 – Thème dark/light persisté
FR05 : Epic 1 – Consentement parental mineur
FR06 : Epic 1 + Epic 4 – Validation/suspension/suppression compte (inscription + admin back-office)
FR07 : Epic 1 – Suppression compte + données (droit à l’effacement)
FR08 : Epic 2 – Création profil joueur < 5 min
FR09 : Epic 2 – Upload vidéo + compression Cloudinary
FR10 : Epic 2 – Lien partage WhatsApp unique
FR11 : Epic 2 – Mise à jour profil
FR12 : Epic 2 – Score complétude profil
FR13 : Epic 2 – Profil public visiteur
FR14 : Epic 3 – Recherche filtres combinés (agent)
FR15 : Epic 3 – Filtres validation (vidéo, coach)
FR16 : Epic 3 – Consultation profil complet (agent)
FR17 : Epic 3 – Carnet de suivi / favoris
FR18 : Epic 8 – Alertes nouveaux profils (V1.0)
FR19 : Epic 3 – Messagerie agent → joueur
FR20 : Epic 3 – Messagerie joueur → agent
FR21 : Epic 3 – Notifications ≤ 60s
FR22 : Epic 6 – Upload clip scout + tagging joueur
FR23 : Epic 6 – Profil proxy terrain (scout)
FR24 : Epic 6 – Queue upload offline
FR25 : Epic 6 – Suivi commissions scout
FR26 : Epic 6 – Badge scout citoyen certifié (admin)
FR27 : Epic 8 – Validation coach (V1.0)
FR28 : Epic 8 – Badges validation sur profil public
FR29 : Epic 4 – Tableau de bord santé plateforme
FR30 : Epic 4 – Modération contenu signalé
FR31 : Epic 4 – Signalement contenu/compte (utilisateur)
FR32 : Epic 4 – Gestion plans tarifaires + validation abonnements
FR33 : Epic 5 – Souscription abonnement Orange Money / MTN MoMo
FR34 : Epic 5 – Historique et statut paiements agent
FR35 : Epic 5 – Activation/désactivation accès agent par statut abonnement

## Epic List

### Epic 1 : Fondation Projet & Identité Utilisateur *(MVP)*

Les utilisateurs (joueur, agent, admin) peuvent s’inscrire, se connecter, gérer leurs préférences (langue FR/EN, thème dark/light) et leur compte — sur une base technique opérationnelle (Next.js 16, Prisma + Neon, Auth.js v5, CI/CD Vercel, multi-tenant RLS).

**FRs couvertes :** FR01, FR02, FR03, FR04, FR05, FR06, FR07
**NFRs clés :** NFR07, NFR08, NFR09, NFR10, NFR12, NFR13, NFR17, NFR18, NFR19, NFR20
**Note :** Story 1.1 = initialisation projet starter (pré-requis greenfield absolu avant tout développement)

### Story 1.1 : Initialisation du projet — Next.js 16 + shadcn/ui + CI/CD

As a développeur,
I want un projet Next.js 16 initialisé avec shadcn/ui, Tailwind CSS v4, les tokens CSS DSC (couleurs par espace, dark/light), le pipeline CI/CD GitHub Actions + Vercel et les variables d'environnement configurées,
So that toute l'équipe dispose d'une base technique fonctionnelle, déployable et testée avant d'écrire la première ligne de code métier.

**Acceptance Criteria:**

**Given** le repository GitHub est vide (greenfield)
**When** `pnpm dlx shadcn@latest init -t next` est exécuté suivi de l'ajout des composants MVP (`button card input select badge progress sheet dialog skeleton toast`)
**Then** le projet Next.js 16 démarre sans erreur en dev et en prod
**And** la structure de dossiers correspond à l'arborescence définie dans l'Architecture (`app/(public)`, `app/(joueur)`, `app/(agent)`, `app/(admin)`, `server/trpc/`, `lib/validations/`, etc.)
**And** les tokens CSS DSC sont définis dans `globals.css` (`--color-joueur`, `--color-agent`, `--color-scout`, `--color-admin`, variables dark/light)
**And** GitHub Actions exécute lint + type-check sur chaque PR sans erreur
**And** Vercel déploie automatiquement un preview sur chaque PR et une production sur `main`
**And** les variables d'environnement sont documentées dans `.env.example` (sans secrets)
**And** le bundle JS initial est < 200KB gzippé (NFR05) vérifié via Vercel Analytics

### Story 1.2 : Schéma de données multi-tenant (Prisma + Neon)

As a développeur,
I want un schéma Prisma complet avec les modèles `Tenant` et `User` (+ enum `Role`) configurés avec Row-Level Security et le helper `withTenant(tenantId)`,
So that toutes les données sont isolées par tenant depuis la première ligne de code, et aucune query ne peut accéder aux données d'un autre tenant.

**Acceptance Criteria:**

**Given** une connexion Neon (PostgreSQL serverless) est configurée
**When** `prisma migrate deploy` est exécuté
**Then** les tables `tenants` et `users` existent avec `tenant_id` comme colonne obligatoire sur `users`
**And** les enums `Role` (`JOUEUR`, `AGENT`, `SCOUT`, `ADMIN`) sont créés
**And** le helper `withTenant(tenantId)` est implémenté dans `server/db/helpers.ts` et force le filtre `WHERE tenant_id = ?` sur toute query Prisma
**And** une migration de seed crée un tenant de développement par défaut
**And** les IDs utilisent CUID2 (`@default(cuid())`) — jamais UUID v4 ni autoincrement exposé
**And** Upstash Redis est connecté et un cache de session basique fonctionne

### Story 1.3 : Authentification & RBAC (Auth.js v5, 4 rôles)

As a utilisateur inscrit,
I want pouvoir me connecter avec mon email et mon mot de passe et être redirigé vers mon espace selon mon rôle,
So that chaque utilisateur accède uniquement aux fonctionnalités de son rôle, de façon sécurisée.

**Acceptance Criteria:**

**Given** un utilisateur a un compte avec un rôle défini (JOUEUR, AGENT, SCOUT, ADMIN)
**When** il saisit ses identifiants sur `/auth/connexion`
**Then** il est authentifié via Auth.js v5 et reçoit un JWT contenant `role` + `tenant_id`
**And** il est redirigé vers son espace (`/(joueur)/tableau-de-bord`, `/(agent)/tableau-de-bord`, `/(admin)/tableau-de-bord`)
**And** le middleware Next.js bloque l'accès aux routes d'un espace pour un utilisateur d'un autre rôle (RBAC)
**And** les mots de passe sont hachés avec bcrypt coût ≥ 12 (NFR08)
**And** les tokens JWT expirent en ≤ 24h avec rotation par refresh token (NFR09)
**And** toutes les communications passent par HTTPS/TLS 1.3 (NFR07)
**And** si les identifiants sont incorrects, un message d'erreur explicite s'affiche sans révéler si l'email existe
**And** si le compte est suspendu, un message d'information clair s'affiche

### Story 1.4 : Inscription multi-rôle & consentement parental

As a visiteur,
I want créer un compte en sélectionnant mon rôle (joueur ou agent) via un formulaire ou un lien d'invitation WhatsApp,
So that j'accède à la plateforme avec les fonctionnalités adaptées à mon profil.

**Acceptance Criteria:**

**Given** je suis sur la page d'accueil ou en possession d'un lien d'invitation
**When** je sélectionne mon rôle (joueur / agent) et renseigne email + mot de passe
**Then** un compte est créé avec le rôle sélectionné et rattaché au tenant courant
**And** je reçois un email de confirmation (ou message WhatsApp si lien d'invitation)
**And** les erreurs de saisie (email invalide, email déjà utilisé, mot de passe trop court) s'affichent en FR ou EN selon la langue sélectionnée (NFR18)
**And** si l'utilisateur déclare être mineur (< 18 ans), le formulaire de consentement parental est affiché avec un lien de téléchargement PDF (FR05)
**And** le profil du mineur reste non-public tant que `parental_consent_validated = false` (NFR10)
**And** les champs du formulaire ont des labels ARIA explicites (NFR18)
**And** la navigation est possible au clavier uniquement (NFR19)

### Story 1.5 : Langue d'interface (FR/EN) & thème dark/light

As a utilisateur,
I want choisir ma langue (Français ou English) et basculer entre le thème dark et light, avec mémorisation de mes préférences entre sessions,
So that l'interface s'adapte à mes préférences personnelles sur tous mes appareils.

**Acceptance Criteria:**

**Given** je suis sur n'importe quelle page de la plateforme
**When** je sélectionne une langue dans le `LanguageSwitcher`
**Then** toute l'interface bascule immédiatement dans la langue sélectionnée sans rechargement de page
**And** la préférence est persistée dans `localStorage` via `useUserPreferences` (FR03)
**And** la langue détectée par défaut correspond à la locale du navigateur (next-intl)
**And** quand je bascule le `ThemeToggle` dark/light, le thème change instantanément via CSS custom properties
**And** la préférence de thème est persistée dans `localStorage` et respecte `prefers-color-scheme` par défaut (FR04)
**And** le ratio de contraste est ≥ 4.5:1 en modes dark ET light (NFR17)
**And** aucune string d'interface n'est hardcodée dans les composants — tout passe par `next-intl`

### Story 1.6 : Gestion du compte utilisateur (suppression & droit à l'effacement)

As a utilisateur authentifié,
I want pouvoir supprimer mon compte et toutes mes données personnelles depuis mes paramètres,
So that j'exerce mon droit à l'effacement et que mes données ne soient plus accessibles sur la plateforme.

**Acceptance Criteria:**

**Given** je suis connecté à mon compte
**When** je demande la suppression de mon compte depuis la page de paramètres
**Then** une modale de confirmation s'affiche avec un avertissement clair sur l'irréversibilité de l'action
**And** après confirmation, toutes mes données personnelles sont supprimées de la base (profil + vidéos Cloudinary + messages)
**And** ma session est invalidée immédiatement et je suis redirigé vers la page d'accueil
**And** l'action admin sur un compte tiers est journalisée dans `audit_logs` (NFR12)
**And** si la suppression échoue, un message d'erreur explicite s'affiche et les données restent intactes
**And** un email de confirmation de suppression est envoyé à l'adresse du compte (FR07)

---

### Epic 2 : Passeport Talent Joueur *(MVP)*

Un joueur peut créer son profil complet en < 5 min, uploader une vidéo (compression automatique Cloudinary), générer son lien de partage WhatsApp unique, mettre à jour son profil, consulter son score de complétude, et rendre son profil visible publiquement.

**FRs couvertes :** FR08, FR09, FR10, FR11, FR12, FR13
**NFRs clés :** NFR01, NFR03, NFR05, NFR16, NFR26

### Story 2.1 : Création du Passeport Talent (onboarding joueur)

As a joueur inscrit,
I want créer mon profil complet (nom, poste, âge, région, club, photo) en moins de 5 minutes via un formulaire en étapes progressives avec auto-save,
So that j'existe numériquement et mes informations sont visibles par les agents dès la validation de mon profil.

**Acceptance Criteria:**

**Given** je suis connecté avec le rôle JOUEUR et je n'ai pas encore de profil
**When** j'accède à `/(joueur)/profil/creer`
**Then** le formulaire se présente en 3 étapes maximum avec une barre de progression visible
**And** chaque étape est sauvegardée automatiquement toutes les 30s (NFR26) — si je perds la connexion, mes données sont préservées
**And** les champs obligatoires minimum sont : nom complet, poste (gardien / défenseur / milieu / attaquant / ailier), âge, région (liste des régions camerounaises), club actuel
**And** le formulaire est complété en < 5 min en conditions normales (FR08)
**And** le First Contentful Paint de la page formulaire est ≤ 3s sur connexion 3G (NFR01)
**And** tous les champs ont des labels ARIA, les erreurs sont explicites en FR/EN (NFR18)
**And** les touch targets sont ≥ 44×44px (NFR19)

### Story 2.2 : Upload vidéo avec compression automatique (Cloudinary)

As a joueur,
I want uploader un clip vidéo de match depuis mon téléphone avec compression automatique côté serveur,
So that les agents puissent voir mes performances sans que cela consomme trop de data ni de stockage.

**Acceptance Criteria:**

**Given** j'ai un profil joueur créé et je suis sur `/(joueur)/videos`
**When** je sélectionne une vidéo depuis ma galerie Android (≤ 3 min, tout format courant)
**Then** l'upload se déclenche via une URL Cloudinary signée générée côté serveur (jamais exposée côté client)
**And** un composant `Progress` shadcn/ui affiche le pourcentage réel de progression de l'upload
**And** la vidéo est compressée automatiquement par Cloudinary (cible : < 5MB pour un clip 90s)
**And** l'upload d'un clip 90s est complété en < 60s sur connexion 3G (NFR03)
**And** la vidéo compressée est servie depuis un nœud CDN Afrique (Lagos ou Johannesburg) (NFR23)
**And** en cas d'échec, un message d'erreur humain s'affiche via `next-intl` et le joueur peut réessayer sans perdre sa sélection
**And** le profil gratuit supporte au moins 1 vidéo (quota défini dans la config tenant)

### Story 2.3 : Profil public & lien de partage WhatsApp

As a joueur,
I want générer un lien de partage unique vers mon profil public et le partager directement sur WhatsApp,
So that les agents et mon réseau peuvent consulter mon Passeport Talent depuis n'importe quel appareil, même sans compte DSC.

**Acceptance Criteria:**

**Given** j'ai un profil avec au moins les champs obligatoires renseignés
**When** je clique sur le bouton "Partager sur WhatsApp" (toujours visible sur ma page profil)
**Then** l'app WhatsApp s'ouvre avec un message pré-formaté contenant mon lien de profil unique (`/joueur/[slug]`)
**And** le slug est lisible et SEO-friendly (ex. `/joueur/kevin-mbarga-bafoussam`)
**And** la page profil publique est accessible sans compte DSC par tout visiteur via ce lien
**And** la page profil publique affiche : photo, nom, poste, âge, région, club, vidéos, score de complétude
**And** la page a des meta tags Open Graph (photo, nom, poste, région) pour prévisualisation WhatsApp enrichie
**And** la page est prerendered (ISR/SSG) pour être indexable par Google et optimisée pour 3G (NFR01)
**And** la page profil d'un mineur non-validé retourne une page "en attente de validation" (NFR10)

### Story 2.4 : Mise à jour profil & score de complétude

As a joueur,
I want mettre à jour mes informations à tout moment et voir un score de complétude indiquant ce qu'il me reste à renseigner,
So that mon profil reste à jour et je sais exactement comment l'améliorer pour attirer plus d'agents.

**Acceptance Criteria:**

**Given** j'ai un profil existant et je suis sur `/(joueur)/profil`
**When** je modifie un champ et sauvegarde
**Then** les modifications sont enregistrées immédiatement et visibles sur le profil public dans < 5s
**And** un score de complétude est affiché (ex. "Profil complété à 70%") avec la liste des éléments manquants (FR12)
**And** le score augmente à chaque élément ajouté : photo (+20%), vidéo (+30%), club (+10%), région (+10%), bio (+10%), etc.
**And** si le score est < 100%, un message d'encouragement et les éléments manquants sont listés clairement
**And** l'auto-save fonctionne toutes les 30s pendant la saisie sur le formulaire d'édition (NFR26)
**And** le profil public reste consultable pendant l'édition (pas de downtime)

---

### Epic 3 : Espace Agent — Recherche & Mise en Relation *(MVP)*

Un agent peut rechercher des joueurs par filtres combinés (poste, âge, région, validation), consulter les profils complets, maintenir un carnet de suivi (favoris + notes privées), contacter directement un joueur via messagerie intégrée, et recevoir des notifications en temps quasi-réel (≤ 60s).

**FRs couvertes :** FR14, FR15, FR16, FR17, FR19, FR20, FR21
**NFRs clés :** NFR04, NFR21, NFR24

### Story 3.1 : Moteur de recherche filtré (poste, âge, région)

As a agent,
I want rechercher des joueurs en combinant des filtres (poste, tranche d'âge, région) et filtrer par présence de vidéo ou de validation coach,
So that je trouve rapidement les profils correspondant à mes critères sans me déplacer.

**Acceptance Criteria:**

**Given** je suis connecté avec le rôle AGENT et je suis sur `/(agent)/recherche`
**When** je sélectionne un ou plusieurs filtres (poste, âge min/max, région, "avec vidéo", "validé par coach")
**Then** les résultats s'affichent en < 2s sous forme de grille de `PlayerCard` (NFR04)
**And** chaque card affiche : photo, nom, poste, âge, région, badge "vidéo disponible" si applicable, badge "coach validé" si applicable
**And** les filtres sont cumulables (ex. "Défenseur central + 18-22 ans + Région Centre + avec vidéo") (FR14, FR15)
**And** les filtres sont persistants pendant la session (si je reviens sur la page, mes filtres sont conservés)
**And** si aucun résultat ne correspond, un message clair s'affiche avec une suggestion d'élargir les filtres
**And** les résultats sont paginés en cursor-based (`{ items, nextCursor }`) pour optimiser les performances 3G
**And** les skeleton screens `shadcn/ui Skeleton` s'affichent pendant le chargement — jamais de spinner CSS custom

### Story 3.2 : Consultation du profil complet d'un joueur

As a agent,
I want consulter le profil complet d'un joueur (photo, vidéos, stats, club, région, badges de validation),
So that je peux prendre une décision de contact éclairée sans me déplacer.

**Acceptance Criteria:**

**Given** je suis sur la grille de résultats de recherche
**When** je clique sur la card d'un joueur
**Then** je suis redirigé vers le profil complet du joueur : photo, nom, poste, âge, région, club, bio, vidéos, score de complétude, badges (FR16)
**And** les vidéos sont lisibles directement dans la page via le lecteur Cloudinary (servies depuis le CDN Afrique)
**And** le chargement de la page profil est ≤ 3s sur 3G (NFR01)
**And** un bouton "Contacter" est visible en permanence sur la page profil (CTA principal)
**And** si le joueur est un mineur non-validé, son profil n'est pas accessible par l'agent (NFR10)
**And** la page profil réutilise le même composant `TalentPassport` que la vue publique `/joueur/[slug]`

### Story 3.3 : Carnet de suivi — favoris & notes privées

As a agent,
I want ajouter un joueur à mon carnet de suivi avec une note privée, et retrouver facilement ma liste de joueurs suivis,
So that je gère mes prospects de recrutement sans perdre de profils intéressants entre deux sessions.

**Acceptance Criteria:**

**Given** je suis sur le profil d'un joueur ou sur sa card dans les résultats
**When** je clique sur "Ajouter au carnet" (icône bookmark)
**Then** le joueur est ajouté à mon carnet de suivi accessible sur `/(agent)/favoris` (FR17)
**And** je peux ajouter une note privée (texte libre) sur chaque joueur suivi — visible uniquement par moi
**And** sur `/(agent)/favoris`, je vois la liste de mes joueurs suivis avec photo, nom, poste, région, ma note privée
**And** je peux retirer un joueur de mon carnet (icône bookmark active → inactive)
**And** les favoris sont persistés en base de données et survivent à une déconnexion
**And** le carnet supporte jusqu'à 100 joueurs suivis pour les comptes gratuits (configurable par plan)

### Story 3.4 : Messagerie directe agent ↔ joueur

As a agent,
I want envoyer un message direct à un joueur via la messagerie intégrée de la plateforme,
So that je peux initier un contact professionnel sans avoir besoin de son numéro WhatsApp personnel.

**Acceptance Criteria:**

**Given** je suis sur le profil d'un joueur et je clique sur "Contacter"
**When** je rédige et envoie un message
**Then** le message est transmis au joueur via `trpc.messaging.sendMessage` (FR19)
**And** le joueur voit le message sur `/(joueur)/messages` dans un délai ≤ 60s (polling 30s) (FR20, NFR21)
**And** le joueur peut répondre à l'agent depuis son espace messages
**And** la conversation affiche les messages dans l'ordre chronologique avec horodatage (ISO 8601)
**And** un agent sans abonnement actif peut envoyer un maximum de 3 messages par mois (limite configurable)
**And** les messages sont filtrés par `tenant_id` — aucune fuite de données inter-tenant

### Story 3.5 : Notifications in-app & WhatsApp transactionnel

As a utilisateur (joueur ou agent),
I want recevoir des notifications dans l'application et par WhatsApp lors d'événements importants (nouveau message, consultation de profil, validation),
So that je suis informé en temps quasi-réel sans rester connecté en permanence.

**Acceptance Criteria:**

**Given** un événement déclencheur survient (message reçu, profil consulté, validation de compte)
**When** l'événement est traité côté serveur
**Then** une notification in-app apparaît dans le composant `Notifications` dans ≤ 60s via polling 30s (NFR21)
**And** une notification WhatsApp transactionnelle est envoyée via WhatsApp Business API avec un template approuvé Meta (FR21, NFR21)
**And** l'utilisateur a donné un opt-in explicite lors de l'inscription pour les notifications WhatsApp
**And** si l'API WhatsApp est indisponible, un fallback email est envoyé (NFR24)
**And** les notifications sont marquées comme lues quand l'utilisateur les consulte
**And** les webhooks WhatsApp entrants sont traités via `/api/webhooks/whatsapp` (Route Handler sécurisé HMAC)

---

### Epic 4 : Espace Admin — Back-Office & Modération *(MVP)*

L’administrateur peut valider/suspendre/supprimer des comptes utilisateurs, modérer les contenus signalés, gérer les signalements, configurer les plans tarifaires, et surveiller la santé globale de la plateforme — avec audit log immuable de toutes les actions admin.

**FRs couvertes :** FR06 (actions admin), FR29, FR30, FR31, FR32
**NFRs clés :** NFR12, NFR25

### Story 4.1 : Tableau de bord de santé de la plateforme

As a administrateur,
I want accéder à un tableau de bord donnant une vue d'ensemble de la santé de la plateforme (comptes en attente, signalements, métriques clés),
So that je peux prioriser mes actions quotidiennes et suivre la croissance de l'écosystème.

**Acceptance Criteria:**

**Given** je suis connecté avec le rôle ADMIN et je suis sur `/(admin)/tableau-de-bord`
**When** la page se charge
**Then** j'ai une vue des métriques clés : joueurs inscrits, agents actifs, mises en relation du mois, comptes en attente de validation, signalements ouverts (FR29)
**And** les métriques sont filtrées par `tenant_id` (isolation multi-tenant)
**And** les comptes en attente de validation sont listés avec accès rapide à l'action de validation
**And** les signalements ouverts sont listés avec leur type (contenu inapproprié, compte suspect)
**And** le tableau de bord se charge en ≤ 3s (données mises en cache Upstash Redis)
**And** toutes les actions admin sont journalisées dans `audit_logs` (NFR12)

### Story 4.2 : Validation, suspension et suppression de comptes

As a administrateur,
I want valider les nouveaux comptes agents en attente, suspendre les comptes problématiques, et supprimer les comptes à la demande,
So that la qualité et la fiabilité de l'écosystème DSC sont maintenues.

**Acceptance Criteria:**

**Given** je suis sur `/(admin)/comptes` et je consulte la liste des comptes
**When** je clique sur "Valider", "Suspendre" ou "Supprimer" sur un compte
**Then** l'action est appliquée immédiatement via `trpc.admin.validateAccount` / `suspendAccount` / `deleteAccount` (FR06)
**And** l'utilisateur concerné reçoit une notification WhatsApp ou email de la décision dans ≤ 60s
**And** si je valide un compte agent, il reçoit immédiatement l'accès à l'espace agent
**And** si je suspends un compte, l'utilisateur est déconnecté et ses sessions invalidées dans ≤ 5s
**And** je peux consulter le dossier complet de l'utilisateur avant de décider (nom, email, certifications déclarées, date d'inscription)
**And** chaque action est journalisée dans `audit_logs` : admin_id, action, target_user_id, timestamp, raison (NFR12)
**And** l'action de suppression nécessite une confirmation explicite (modale)

### Story 4.3 : Signalement & modération de contenus

As a administrateur,
I want consulter les signalements soumis par les utilisateurs, examiner les contenus signalés, et les supprimer ou innocenter,
So that la plateforme est protégée contre les profils frauduleux et les contenus inappropriés.

**Acceptance Criteria:**

**Given** un utilisateur a soumis un signalement via le bouton "Signaler" sur un profil ou une vidéo (FR31)
**When** je consulte la file de modération sur `/(admin)/moderation`
**Then** je vois la liste des signalements ouverts : type (profil / vidéo / compte), raison, date, utilisateur signalant
**And** je peux accéder directement au contenu signalé depuis la file de modération (FR30)
**And** je peux "Supprimer le contenu" ou "Innocenter" (clôture le signalement sans action)
**And** l'utilisateur signalé reçoit une notification si son contenu est supprimé (sans révéler l'identité du signalant)
**And** le formulaire de signalement propose des catégories prédéfinies (contenu inapproprié, faux profil, comportement abusif)
**And** chaque action de modération est journalisée dans `audit_logs` (NFR12)

### Story 4.4 : Gestion des plans tarifaires & abonnements agents

As a administrateur,
I want configurer les plans tarifaires (gratuit, pro) et visualiser les abonnements agents en cours,
So that la monétisation de la plateforme est gérée de façon centralisée et transparente.

**Acceptance Criteria:**

**Given** je suis sur `/(admin)/abonnements`
**When** je consulte la page
**Then** je vois la liste de tous les abonnements agents actifs : nom, plan, date début, date expiration, statut (actif / expiré / en attente) (FR32)
**And** je peux configurer les quotas par plan (ex. plan gratuit : 3 messages/mois, plan pro : illimité)
**And** je peux manuellement activer ou désactiver l'accès d'un agent (override du statut d'abonnement)
**And** les modifications de plan sont appliquées immédiatement et journalisées dans `audit_logs`
**And** un export CSV basique de la liste des abonnements est disponible pour le suivi financier

---

### Epic 5 : Paiements Mobile Money & Abonnements Agents *(MVP)*

Un agent peut souscrire à un abonnement via Orange Money ou MTN MoMo, consulter l’historique et le statut de ses paiements, et voir son accès plateforme activé ou suspendu automatiquement selon son statut d’abonnement.

**FRs couvertes :** FR33, FR34, FR35
**NFRs clés :** NFR11, NFR22

### Story 5.1 : Intégration Orange Money / MTN MoMo (webhook & confirmation serveur)

As a développeur,
I want intégrer les APIs officielles Orange Money et MTN MoMo avec confirmation de transaction côté serveur avant toute activation d'abonnement,
So that aucun accès agent n'est activé sans paiement réel confirmé, protégeant la plateforme contre les fraudes.

**Acceptance Criteria:**

**Given** un agent initie un paiement Mobile Money
**When** la transaction est complétée côté opérateur (Orange Money ou MTN MoMo)
**Then** un webhook est reçu sur `/api/webhooks/momo` et vérifié par signature HMAC avant traitement
**And** la transaction est confirmée côté serveur via l'API officielle avant tout changement d'état d'abonnement (NFR11, NFR22)
**And** si la confirmation échoue (timeout, erreur API), l'abonnement reste inactif et l'agent en est informé
**And** les clés API Mobile Money ne sont jamais exposées côté client — uniquement dans les variables d'environnement Vercel
**And** chaque transaction traitée est journalisée dans `audit_logs` : agent_id, montant, opérateur, statut, transaction_id opérateur

### Story 5.2 : Souscription à un abonnement & historique des paiements

As a agent,
I want souscrire à un plan d'abonnement via Orange Money ou MTN MoMo et consulter mon historique de paiements,
So that j'accède aux fonctionnalités premium et je garde une trace claire de mes transactions.

**Acceptance Criteria:**

**Given** je suis connecté avec le rôle AGENT et je suis sur ma page abonnement
**When** je sélectionne un plan et clique sur "Payer via Mobile Money"
**Then** je reçois une invite de paiement sur mon téléphone (USSD push Orange Money ou MTN MoMo) (FR33)
**And** une fois le paiement confirmé côté serveur, mon abonnement est activé immédiatement et je reçois une notification de confirmation
**And** si le paiement échoue ou expire, un message d'erreur clair s'affiche avec la possibilité de réessayer
**And** sur `/(agent)/abonnement`, je peux consulter mon historique de paiements : date, montant, opérateur, statut (FR34)
**And** les montants sont affichés en FCFA
**And** une facture simplifiée (récapitulatif texte) est accessible pour chaque paiement réussi

### Story 5.3 : Activation & désactivation automatique de l'accès agent

As a système,
I want activer l'accès complet de l'espace agent lors d'un abonnement validé et le désactiver automatiquement à l'expiration,
So that seuls les agents avec un abonnement actif accèdent aux fonctionnalités premium.

**Acceptance Criteria:**

**Given** un abonnement agent vient d'être confirmé ou expiré
**When** le statut d'abonnement change dans la base de données
**Then** le middleware Next.js lit le statut `subscription_status` depuis la session et autorise ou bloque l'accès aux routes agent premium (FR35)
**And** un agent avec abonnement expiré voit ses fonctionnalités limitées (lecture seule, 3 messages/mois max) avec un CTA "Renouveler mon abonnement"
**And** la vérification du statut d'abonnement ne nécessite pas de requête base de données à chaque requête (statut mis en cache dans le JWT, TTL ≤ 24h)
**And** un email + notification WhatsApp de rappel est envoyé 7 jours avant l'expiration de l'abonnement
**And** un email + notification WhatsApp est envoyé le jour de l'expiration si non renouvelé

---

### Epic 6 : Scout Citoyen & Collecte Terrain *(V1.0)*

Un scout citoyen certifié peut uploader des clips vidéo depuis le terrain et les lier au profil d’un joueur, créer des profils proxy pour les joueurs identifiés, gérer sa queue d’upload hors connexion (sync automatique à la reconnexion), et suivre ses commissions en attente et versées.

**FRs couvertes :** FR22, FR23, FR24, FR25, FR26
**NFRs clés :** NFR27

### Story 6.1 : Upload clip vidéo terrain & tagging joueur

As a scout citoyen,
I want uploader un clip vidéo filmé sur le terrain et le lier au profil d'un joueur existant,
So that le joueur dispose d'une preuve vidéo supplémentaire de ses performances sans avoir à la filmer lui-même.

**Acceptance Criteria:**

**Given** je suis connecté avec le rôle SCOUT et je suis sur `/(scout)/upload`
**When** je sélectionne une vidéo depuis ma galerie et je recherche un joueur par nom ou région
**Then** la vidéo est uploadée via URL Cloudinary signée côté serveur et liée au profil du joueur sélectionné (FR22)
**And** le joueur reçoit une notification : "Un scout a ajouté un clip à votre profil" dans ≤ 60s
**And** un composant `Progress` shadcn/ui affiche la progression réelle de l'upload
**And** la vidéo uploadée apparaît sur le profil public du joueur une fois traitée par Cloudinary
**And** en cas d'échec upload, un message d'erreur clair s'affiche et la vidéo peut être re-sélectionnée

### Story 6.2 : Création de profil proxy joueur depuis le terrain

As a scout citoyen,
I want créer un profil simplifié pour un joueur identifié sur le terrain sans que ce joueur ait un compte DSC,
So that ce joueur est référencé sur la plateforme et peut être contacté par un agent en attendant qu'il crée son propre compte.

**Acceptance Criteria:**

**Given** je suis sur `/(scout)/upload` et le joueur que je veux référencer n'a pas de compte DSC
**When** je crée un profil proxy avec les informations minimales (nom, poste, région, photo ou numéro de téléphone)
**Then** un profil joueur "proxy" est créé avec le statut `proxy = true` et `created_by_scout = scout_id` (FR23)
**And** le profil proxy est visible dans les recherches agents avec un badge "Profil à compléter"
**And** un lien WhatsApp d'invitation est généré pour ce profil proxy et peut être envoyé au joueur par le scout
**And** quand le joueur clique sur le lien et crée son compte, il revendique le profil proxy et prend le contrôle de ses données
**And** le scout est notifié quand le joueur qu'il a référencé crée son compte et complète son profil

### Story 6.3 : Queue d'upload offline (IndexedDB + sync reconnexion)

As a scout citoyen,
I want que mes uploads vidéo soient mis en queue automatiquement si je n'ai pas de connexion, et déclenchés dès que la connexion revient,
So that je peux travailler sur le terrain avec une connexion instable sans perdre mes vidéos.

**Acceptance Criteria:**

**Given** je suis sur le terrain avec une connexion 2G instable ou absente
**When** je sélectionne une vidéo et clique sur "Uploader"
**Then** si la connexion est insuffisante, la vidéo est mise en queue dans IndexedDB via `useOfflineQueue` avec le statut `pending` (FR24, NFR27)
**And** un message clair informe le scout : "Vidéo en attente de connexion — elle sera uploadée automatiquement"
**And** dès que la connexion revient (détectée via `navigator.onLine`), la queue est traitée automatiquement en arrière-plan
**And** le scout voit le statut de chaque élément en queue : en attente / en cours d'upload / uploadé
**And** la queue persiste entre les sessions (fermeture et réouverture de l'app)
**And** en cas d'échec de l'upload même avec connexion, le scout est notifié et peut réessayer manuellement

### Story 6.4 : Suivi des commissions & badge scout certifié

As a scout citoyen,
I want consulter le statut de mes commissions (en attente, validées, versées) et voir mon badge de certification,
So that je suis motivé à continuer à référencer des joueurs en sachant que ma contribution est reconnue et rémunérée.

**Acceptance Criteria:**

**Given** je suis connecté avec le rôle SCOUT et je suis sur `/(scout)/commissions`
**When** la page se charge
**Then** je vois la liste de mes commissions : joueur référencé, statut (en attente / validée / versée), montant en FCFA, date de versement prévue (FR25)
**And** une commission passe en "validée" quand le joueur référencé est contacté par un agent
**And** une commission passe en "versée" quand l'admin confirme le versement Mobile Money
**And** si j'ai le badge Scout Citoyen Certifié, il est affiché en évidence sur mon tableau de bord et sur les profils que j'ai créés (FR26)
**And** l'admin peut attribuer ou révoquer le badge via `trpc.admin.grantScoutBadge` depuis `/(admin)/comptes`
**And** une notification WhatsApp m'est envoyée quand une commission change de statut

---

### Epic 7 : PWA Offline, Performance & Push Notifications *(V1.0)*

La PWA est installable sur Android sans Play Store (bundle < 15MB), supporte la lecture de profils en cache offline via Service Worker, et envoie des notifications push via Firebase Cloud Messaging (remplacement du polling MVP).

**FRs couvertes :** — (NFRs prioritaires)
**NFRs clés :** NFR06, NFR25, NFR27

### Story 7.1 : Service Worker & cache offline profils joueurs

As a utilisateur (joueur, agent),
I want pouvoir consulter les profils joueurs déjà visités même sans connexion internet,
So that je peux travailler en déplacement avec une connexion instable sans perdre accès aux données déjà chargées.

**Acceptance Criteria:**

**Given** j'ai déjà visité le profil d'un joueur avec une connexion active
**When** je perds la connexion et tente de recharger ce profil
**Then** le Service Worker sert la version en cache de la page profil sans erreur (NFR06)
**And** un bandeau discret indique "Mode hors-ligne — données du [date]" pour informer l'utilisateur
**And** les vidéos ne sont pas mises en cache offline (trop volumineuses) — seul le profil texte + photo est servi
**And** la stratégie de cache est `stale-while-revalidate` : servi depuis le cache, mis à jour en arrière-plan dès que la connexion revient
**And** le Service Worker est enregistré via `next-pwa` ou une config custom Next.js 16
**And** le cache est invalidé automatiquement lors d'une mise à jour de profil

### Story 7.2 : Installation PWA Android (manifest, icônes, bundle < 15MB)

As a utilisateur sur Android,
I want installer Dream Studio Connect sur mon écran d'accueil directement depuis le navigateur, sans passer par le Play Store,
So that j'accède à la plateforme comme une app native, rapidement et sans frictions.

**Acceptance Criteria:**

**Given** j'ouvre DSC dans Chrome Android 80+ ou Samsung Internet 12+
**When** le navigateur détecte que la PWA est installable (manifest valide + Service Worker actif + HTTPS)
**Then** une bannière "Ajouter à l'écran d'accueil" s'affiche automatiquement
**And** après installation, l'app se lance en mode standalone (sans barre d'adresse navigateur)
**And** le bundle total installable est < 15MB (NFR06) — vérifié via Lighthouse PWA audit
**And** le `manifest.json` contient : nom, description, icônes 192px et 512px, couleur de thème par espace, `display: standalone`, `start_url`
**And** le First Contentful Paint reste ≤ 3s sur 3G même après installation (NFR01)
**And** un audit Lighthouse PWA score ≥ 90 est requis avant merge

### Story 7.3 : Firebase Cloud Messaging — push notifications hors-app

As a utilisateur (joueur, agent, scout),
I want recevoir des notifications push sur mon Android même quand l'application DSC est fermée,
So that je suis alerté des événements importants sans avoir à maintenir l'app ouverte.

**Acceptance Criteria:**

**Given** j'ai accepté les notifications push lors de l'inscription ou dans mes paramètres
**When** un événement déclencheur survient (message reçu, commission validée, compte validé)
**Then** une notification push Firebase est envoyée via FCM à mon appareil Android
**And** la notification s'affiche même si l'app DSC est en arrière-plan ou fermée
**And** un tap sur la notification ouvre l'app DSC sur la page pertinente (deep link)
**And** le FCM remplace le polling 30s pour les événements d'engagement (le polling reste pour les données temps réel in-app)
**And** le token FCM est renouvelé automatiquement et stocké en base liée à l'utilisateur
**And** si FCM échoue, le fallback email/WhatsApp transactionnel prend le relais (NFR24)
**And** l'opt-out des notifications push est possible depuis les paramètres utilisateur

---

### Epic 8 : Validations Communautaires & Alertes Agents *(V1.0)*

Un coach enregistré peut valider la compétence d’un joueur sur son profil public, le joueur affiche ses badges de validation en évidence, et les agents reçoivent des alertes personnalisées sur les nouveaux profils correspondant à leurs critères sauvegardés.

**FRs couvertes :** FR18, FR27, FR28

### Story 8.1 : Validation de compétence joueur par un coach

As a coach enregistré,
I want valider la compétence d’un joueur sur son profil DSC en apposant ma signature de validation,
So that les agents peuvent distinguer les joueurs avec une validation crédible de coach, renforçant la confiance dans les profils.

**Acceptance Criteria:**

**Given** je suis connecté avec le rôle COACH et je suis sur le profil d’un joueur
**When** je clique sur "Valider ce joueur" et confirme ma validation
**Then** une validation est créée en base : `{ player_id, coach_id, competency, validated_at, tenant_id }` via `trpc.player.addValidation` (FR27)
**And** la validation apparaît immédiatement sur le profil public du joueur avec mon nom, mon rôle et la date
**And** le joueur reçoit une notification : "Un coach a validé votre profil"
**And** un coach ne peut valider un joueur qu’une seule fois (protection doublon)
**And** l’admin peut supprimer une validation abusive depuis le back-office
**And** la validation est filtrée par `tenant_id` — aucune validation inter-tenant

### Story 8.2 : Badges de validation sur le profil public joueur

As a joueur,
I want afficher les badges de validation reçus de coaches sur mon profil public,
So that les agents voient immédiatement que mon talent a été reconnu par des professionnels crédibles, renforçant mes chances d’être contacté.

**Acceptance Criteria:**

**Given** un ou plusieurs coaches ont validé mon profil
**When** un agent ou un visiteur consulte mon profil public `/joueur/[slug]`
**Then** les badges de validation sont affichés en évidence : photo du coach, nom, rôle, date de validation (FR28)
**And** les badges sont triés par date décroissante (validation la plus récente en premier)
**And** un profil avec au moins une validation coach affiche un badge global "Validé par un coach" dans les cards de recherche agent
**And** ce badge est filtrable dans le moteur de recherche agent (FR15 — Story 3.1)
**And** le composant `TalentPassport` est mis à jour pour intégrer la section badges sans régression visuelle sur mobile 360px

### Story 8.3 : Alertes personnalisées agents (nouveaux profils)

As a agent,
I want recevoir des alertes automatiques quand de nouveaux profils joueurs correspondent à mes critères de recherche sauvegardés,
So that je découvre les nouveaux talents sans avoir à relancer manuellement une recherche chaque jour.

**Acceptance Criteria:**

**Given** j’ai sauvegardé des critères de recherche dans mon espace agent
**When** un nouveau profil joueur correspondant à ces critères est créé ou mis à jour sur la plateforme
**Then** je reçois une alerte in-app dans ≤ 60s et une notification FCM si activée (FR18)
**And** l’alerte contient : nom du joueur, poste, région, photo miniature et un lien direct vers le profil
**And** je peux configurer la fréquence des alertes (immédiat / résumé quotidien) depuis mes paramètres
**And** je peux désactiver les alertes pour un critère sauvegardé sans le supprimer
**And** un agent reçoit au maximum 10 alertes par jour (anti-spam, configurable par l’admin)
**And** les alertes sont filtrées par `tenant_id` — aucune alerte inter-tenant

