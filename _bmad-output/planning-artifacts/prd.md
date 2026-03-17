---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
workflowStatus: complete
completedAt: '2026-03-17'
inputDocuments:
  - "_bmad-output/dream-studio-connect-analyse.md"
  - "_bmad-output/brainstorming/brainstorming-session-2026-03-12-1620.md"
  - "_bmad-output/planning-artifacts/product-brief-dream_studio_connect-2026-03-17.md"
workflowType: 'prd'
briefCount: 1
researchCount: 0
brainstormingCount: 1
projectDocsCount: 1
classification:
  projectType: web_app
  domain: sports_marketplace
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - dream_studio_connect

**Author:** falcom
**Date:** 2026-03-17

---

## Executive Summary

Dream Studio Connect est une PWA (Progressive Web App) multi-acteurs qui connecte les footballeurs amateurs et semi-professionnels camerounais avec les agents de football locaux. La plateforme donne une existence numérique permanente aux talents invisibles et permet aux agents de rechercher, filtrer et contacter des joueurs vérifiés sans déplacement physique — depuis n'importe quel appareil Android, en 2G/3G.

**Problème central :** Le Cameroun regorge de footballeurs talentueux qui restent systématiquement invisibles faute d'infrastructure numérique adaptée. Ce n'est pas un problème de talent — c'est un problème de visibilité structurelle. Les outils existants (WhatsApp, Transfermarkt) ne répondent ni aux contraintes locales (Android bas de gamme, 2G/3G), ni aux besoins du marché africain.

**Utilisateurs cibles :**
- **Primaires :** Footballeurs amateurs/semi-pros (15-27 ans, Cameroun) ; Agents locaux de football
- **Secondaires :** Scouts citoyens certifiés DSC ; Organisateurs de tournois ; Parents de joueurs mineurs ; Administrateur général

**Tagline :** *"Ton talent existe. On le rend visible."*

### What Makes This Special

Dream Studio Connect n'est pas une plateforme purement numérique — c'est un écosystème physique + digital dont le différenciateur central est le canal d'acquisition propriétaire : les tournois organisés par Dream Studio Connect, couplés à un réseau de scouts citoyens formés et commissionnés, créent une barrière à l'entrée opérationnelle impossible à répliquer uniquement avec du capital.

**Différenciateurs défendables :**
1. **Tournois physiques** comme moteur d'acquisition — actif physique propriétaire, non réplicable par un concurrent purement digital
2. **Réseau de scouts citoyens** — présence terrain permanente, formée et commissionnée à la réussite du recrutement
3. **First mover structuré** sur le marché camerounais du talent footballistique
4. **Conçu pour les contraintes locales** — PWA < 15MB, offline-first, i18n FR/EN natif, thème dark/light, optimisé 2G/3G et Android bas de gamme

**Vision 5 ans :** Devenir la référence africaine du talent footballistique amateur — l'équivalent de Transfermarkt pour l'Afrique subsaharienne, en partant du Cameroun comme marché d'ancrage.

## Project Classification

- **Type de projet :** Web App — PWA multi-acteurs (joueur, agent, scout, admin)
- **Domaine :** Sports marketplace — mise en relation talent/recruteur
- **Complexité :** Medium — marché biface, 6 personas, contraintes infrastructure Afrique, multilingue, theming
- **Contexte :** Greenfield — construction from scratch, aucun système existant

---

## Success Criteria

### User Success

| Utilisateur | Critère | Mesure |
|---|---|---|
| Joueur | Profil créé en < 5 min sur Android bas de gamme | Temps moyen d'onboarding ≤ 5 min |
| Joueur | Recevoir ≥ 1 contact d'agent dans les 30 jours post-inscription | % joueurs contactés J+30 |
| Agent | Trouver ≥ 1 joueur pertinent via recherche filtrée / semaine | Sessions de recherche hebdomadaires |
| Agent | Décider de contacter un joueur sans déplacement physique | Taux de conversion recherche → contact ≥ 20% |
| Scout Citoyen | Percevoir ≥ 1 commission dans les 3 premiers mois | Commissions versées / scout actif |
| Admin | Modérer et valider les comptes depuis le back-office | Temps de traitement demande ≤ 24h |

### Business Success

| Horizon | Objectif |
|---|---|
| Mois 3 (MVP) | 500 joueurs inscrits, 30 agents actifs, ≥ 50 mises en relation |
| Mois 9 (V1.0) | 3 000 joueurs, 150 agents, toutes régions Cameroun |
| Mois 12 | MRR ≥ 2 000 000 FCFA (agents abonnés + sponsors tournois) |
| Mois 24 | Présence Afrique Centrale (Gabon, Congo, Tchad) |

**Métrique nord :** Nombre de mises en relation joueur-agent confirmées / mois

### Technical Success

- Disponibilité : uptime ≥ 99% hors maintenances planifiées
- Performance : First Contentful Paint ≤ 3s sur connexion 3G
- Compatibilité : fonctionnel sur Android 6+ avec ≤ 2GB RAM
- PWA size : bundle < 15MB (installation hors Play Store)
- i18n : interface complète FR et EN sans régression visuelle
- Theming : dark/light fonctionnel sur les 3 espaces (joueur, agent, admin)

### Measurable Outcomes

- Taux de complétion profil ≥ 70% (au moins 1 vidéo uploadée)
- Taux de rétention agents actifs ≥ 90%/mois (churn < 10%)
- Taux de conversion tournoi → profil créé ≥ 60%
- Onboarding joueur complété sans assistance externe ≥ 80% des cas

---

## Product Scope

### MVP — Minimum Viable Product

**Espace Joueur :**
- Création de profil (nom, poste, âge, région, club, photo) en < 5 min
- Upload ≥ 1 vidéo avec compression automatique côté serveur
- Lien de partage WhatsApp unique par profil
- Interface FR/EN (i18n natif dès la base)
- Thème Dark/Light avec détection `prefers-color-scheme` + bascule manuelle
- Compatible Android bas de gamme / 2G-3G

**Espace Agent :**
- Moteur de recherche filtré (poste + âge + région)
- Consultation des profils avec vidéos
- Contact direct joueur

**Espace Admin :**
- Gestion des comptes (validation, suspension)
- Modération basique des contenus

### Growth Features (Post-MVP — V1.0)

- Validations communautaires (badges coaches, pairs certifiés)
- Mode hors-ligne avec sync automatique
- Alertes personnalisées agents (nouveaux profils selon critères)
- Scout Citoyen : badge + tracking de commission
- Pages Tournoi avec résultats live
- Messagerie intégrée joueur-agent sécurisée
- Score de complétude de profil
- Langues supplémentaires (pidgin, langues locales camerounaises)

### Vision (Future — V2.0+)

- Matching algorithmique (IA sur profils)
- Application mobile native Android
- Dashboard Analytics agent avec export PDF
- Module contrat numérique
- API partenaires (fédérations, clubs)
- Expansion Afrique Centrale et de l'Ouest

---

## User Journeys

### Journey 1 — Kevin, le Footballeur Invisible (parcours principal)

*On rencontre Kevin après un tournoi à Bafoussam. Il vient de marquer 2 buts. Un scout citoyen l'approche avec son téléphone.*

1. Le scout lui envoie un lien WhatsApp pour créer son profil DSC
2. Kevin ouvre le lien sur son Samsung Android — il choisit le français, thème dark
3. Il remplit son profil en 4 min : nom, poste (ailier gauche), âge, région, club, photo
4. Il uploade un clip de 90 secondes du tournoi — compressé automatiquement
5. Il reçoit son lien de partage unique → il le poste dans son groupe WhatsApp de joueurs
6. 3 jours plus tard : notification — un agent a consulté son profil
7. **Moment aha :** L'agent lui envoie un message via la plateforme → première opportunité réelle

**Exigences révélées :** Onboarding express, upload vidéo + compression, lien WhatsApp partageable, messagerie agent→joueur, notifications.

---

### Journey 2 — Maurice, l'Agent Local (parcours recherche)

*Maurice revient d'un weekend épuisant à Douala — 2 jours de déplacement pour 1 joueur moyen. Il s'inscrit sur DSC.*

1. Inscription agent → période d'essai gratuite
2. Il tape ses critères : "Défenseur central — 18-23 ans — Région Littoral"
3. 12 profils apparaissent avec photos, stats, vidéos, validations coaches
4. Il filtre sur "validé par ≥ 1 coach" → 4 profils restants
5. Il consulte le profil de Thierry — 2 vidéos, validation de son coach de club
6. Il ajoute Thierry à son carnet de suivi (favoris)
7. **Moment aha :** Il contacte Thierry directement → économise 2 jours de déplacement

**Exigences révélées :** Moteur de recherche multi-critères, filtres validation, carnet de suivi/favoris, consultation profil détaillé, messagerie.

---

### Journey 3 — Amina, la Scout Citoyenne (parcours terrain)

*Amina, 22 ans, Douala — formée par DSC. Elle filme un match de quartier ce samedi.*

1. Elle ouvre l'app DSC depuis le terrain — réseau 3G instable
2. Elle filme une séquence avec son téléphone et tague le numéro 9
3. Upload déclenché automatiquement quand la connexion revient (queue offline)
4. Elle lie le clip au profil du joueur (ou crée un profil rapide)
5. Le joueur reçoit une notification : "Amina a ajouté un clip à votre profil"
6. 3 semaines plus tard — le joueur est contacté par un agent via ce clip
7. **Moment aha :** Elle reçoit une notification de commission en attente → motivation confirmée

**Exigences révélées :** Upload offline avec queue, tagging joueur, commission tracking, notifications scout.

---

### Journey 4 — falcom, l'Administrateur (parcours validation)

*falcom reçoit une alerte : un agent vient de s'inscrire sans vérification de certification.*

1. Il accède au back-office via navigateur desktop
2. Il voit la liste des comptes en attente de validation
3. Il consulte le dossier de l'agent : nom, contacts, certifications déclarées
4. Il approuve le compte → l'agent reçoit notification d'accès confirmé
5. Plus tard : signalement d'un profil joueur avec contenu inapproprié
6. falcom modère et suspend le profil en 2 clics → notification envoyée au joueur
7. **Moment aha :** Le back-office lui donne visibilité totale sur la qualité de l'écosystème

**Exigences révélées :** Back-office admin, workflow de validation de compte, système de signalement/modération, tableau de bord de santé plateforme.

### Journey Requirements Summary

| Journey | Capacités clés révélées |
|---|---|
| Kevin (joueur) | Onboarding express, upload vidéo compressé, lien WhatsApp, notifications, messagerie |
| Maurice (agent) | Recherche filtrée, filtre validation, favoris, consultation profil, messagerie |
| Amina (scout) | Upload offline/queue, tagging, commission tracking, notifications |
| falcom (admin) | Back-office validation, modération, tableau de bord |

---

## Domain-Specific Requirements

### Contraintes Réglementaires & Légales

- **Joueurs mineurs (< 18 ans) :** Consentement parental requis — formulaire de consentement téléchargeable (PDF signé hors-ligne) + case à cocher obligatoire lors de l'inscription. Le profil d'un mineur reste non-visible publiquement tant que le consentement n'est pas validé par l'admin.
- **Protection des données :** Politique de confidentialité FR/EN obligatoire. Droit à l'effacement de profil sur demande. Données hébergées dans des régions conformes (AWS Lagos ou équivalent africain).
- **Responsabilité légale :** DSC est un intermédiaire de mise en relation — pas de responsabilité directe sur les transactions joueur/agent. Les contrats se négocient hors-plateforme (sauf module futur V2.0).
- **Agents non-certifiés FIFA :** Mention explicite dans les CGU que la plateforme ne certifie pas les compétences professionnelles des agents, uniquement leur identité.

### Contraintes Techniques Spécifiques

- **Paiements :** Mobile Money prioritaire (Orange Money, MTN Mobile Money Cameroun). Intégration passerelle de paiement locale compatible MoMo/OM dès le MVP pour les abonnements agents.
- **WhatsApp Business API :** Canal principal de notifications et d'onboarding. Respect des conditions Meta (opt-in explicite, limite de messages, templates approuvés). Compte WhatsApp Business à créer/valider avant le lancement.
- **Stockage vidéo :** Quota par profil gratuit (1 vidéo, max 3 min compressée). Profil Pro : vidéos illimitées. Politique de rétention : vidéos conservées tant que le compte est actif, supprimées 90 jours après désactivation.
- **Infrastructure réseau :** Optimisation pour 2G/3G — lazy loading, images WebP compressées, cache agressif, Service Worker pour la PWA.

### Intégrations Requises

| Système | Usage | Phase |
|---|---|---|
| WhatsApp Business API (Meta) | Notifications, onboarding, lien de partage | MVP |
| Orange Money / MTN MoMo | Paiements abonnements agents | MVP |
| Cloudinary (ou équivalent CDN Afrique) | Stockage + compression vidéo + CDN Lagos/Johannesburg | MVP |
| Firebase Push Notifications | Notifications engagement hors-app | V1.0 |

### Risques Spécifiques au Domaine

| Risque | Mitigation |
|---|---|
| Faux profils joueurs | Validation par scout citoyen certifié + badge admin |
| Agents malveillants | Période d'essai surveillée + validation identité par admin avant accès complet |
| Contenu vidéo inapproprié | Modération admin + signalement communautaire |
| Abandon à l'onboarding (connexion instable) | Queue offline, sauvegarde automatique du brouillon de profil |
| Non-paiement Mobile Money | Confirmation de transaction côté serveur avant activation abonnement |

---

## Innovation & Novel Patterns

### Detected Innovation Areas

#### 1. Modèle d'acquisition hybride Physique + Digital

Aucune plateforme de talent sportif africaine n'utilise ses propres événements physiques comme moteur d'acquisition primaire. DSC *organise* les tournois pour *alimenter* la plateforme — le canal d'acquisition **est** le produit.

> Analogie : Airbnb n'a pas inventé la location, mais a créé une infrastructure de confiance autour d'actifs existants. DSC crée une infrastructure numérique autour de tournois existants.

#### 2. Scout Citoyen à Commission (innovation de distribution)

Transformer des jeunes locaux motivés en réseau de collecte de données humain, rémunéré à la performance. Aucune plateforme comparable en Afrique n'a externalisé la collecte de talent à un réseau décentralisé de citoyens commissionnés.

> Pattern proche : modèle gig economy (Rappi/Jumia) appliqué à la découverte de talent sportif.

#### 3. WhatsApp comme Canal d'Onboarding Natif (innovation UX/distribution)

Plutôt que de combattre WhatsApp, DSC l'*utilise* comme moteur de distribution : le lien de profil partageable transforme chaque joueur en ambassadeur involontaire. Le réseau existant devient le canal d'acquisition.

### Market Context & Competitive Landscape

- **WhatsApp** : concurrent informel dominant — DSC s'y intègre plutôt que de le combattre
- **Transfermarkt / FIFA Connect** : conçus pour l'élite mondiale, inaccessibles aux réalités africaines
- **Aucun concurrent local structuré** identifié sur le marché camerounais — position de first mover

### Validation Approach

- **Tournoi pilote** : mesurer le taux de conversion lien WhatsApp → profil créé (cible ≥ 60%)
- **Scouts citoyens pilotes** : recruter 3-5 scouts → mesurer le taux de profils créés via scout vs direct
- **A/B test onboarding** : lien WhatsApp vs navigateur direct → optimiser le taux de complétion

### Risk Mitigation

| Risque d'innovation | Mitigation |
|---|---|
| Dépendance aux CGU Meta (WhatsApp Business API) | Fallback SMS/email maintenu en parallèle |
| Perte de motivation des scouts citoyens | Paiement Mobile Money sous 48h garanti dès la commission validée |
| Faible taux de conversion tournoi → profil | Assistance scout sur place + QR code pré-rempli |

---

## Web App Specific Requirements

### Project-Type Overview

Dream Studio Connect est une **PWA SPA (Single Page Application)** multi-espaces, déployée sans app store, installable depuis le navigateur Android. Architecture modulaire avec 3 espaces séparés (joueur, agent, admin) chargés en lazy loading pour optimiser les performances sur connexions faibles.

### Technical Architecture Considerations

- **Architecture :** SPA avec code-splitting par espace (joueur / agent / admin chargés indépendamment)
- **PWA :** Service Worker pour cache offline, manifest pour installation sur écran d'accueil Android sans Play Store
- **Routing :** Client-side routing avec URL profondes partageables (lien profil joueur)
- **State management :** Store centralisé (Pinia/Vuex ou Redux selon stack choisi)
- **Build :** Installation PWA complète < 15MB (offline), bundle JS initial < 200KB gzippé, lazy chunks < 3MB par espace

### Browser Matrix

| Navigateur | Priorité | Version minimale |
|---|---|---|
| Chrome Android | ★★★ Primaire | Chrome 80+ |
| Samsung Internet | ★★ Secondaire | Samsung Internet 12+ |
| Safari iOS | ★ Best-effort | iOS 14+ |
| Firefox Android | ★ Best-effort | Firefox 90+ |

### Responsive Design

- **Mobile-first :** Design conçu pour écrans 360px–428px (Android bas de gamme)
- **Breakpoints :** Mobile (< 768px) prioritaire, Tablet (768-1024px) pour agents, Desktop (> 1024px) pour admin
- **Touch targets :** Minimum 44x44px sur tous les éléments interactifs
- **Theming :** CSS custom properties pour dark/light, détection `prefers-color-scheme` + bascule manuelle persistée en localStorage

### Performance Targets

| Métrique | Cible | Contexte |
|---|---|---|
| First Contentful Paint | ≤ 3s | Connexion 3G (1.6 Mbps) |
| Time to Interactive | ≤ 5s | Connexion 3G |
| Largest Contentful Paint | ≤ 4s | Connexion 3G |
| Bundle initial | < 200KB gzipé | Chargement hors-cache |
| Vidéo compressée | < 5MB / clip | Upload 3G < 60s |

### SEO Strategy

- **Profils joueurs :** URLs profondes partageables et indexables par Google (`/joueur/kevin-mbarga-bafoussam`) — renforce la visibilité externe au-delà de WhatsApp
- **SSR ou Prerendering :** Prerendering statique des pages publiques (profil joueur, page d'accueil) pour l'indexation
- **Meta tags dynamiques :** Open Graph par profil (photo, nom, poste, région) pour prévisualisation WhatsApp enrichie

### Real-Time & Notifications

- **MVP :** Polling léger (30s) pour notifications in-app + WhatsApp Business API pour notifications transactionnelles hors-app
- **V1.0 :** Firebase Push Notifications (engagement hors-app) + Server-Sent Events ou WebSocket pour temps réel in-app
- **Canaux :** WhatsApp Business API (transactionnel, MVP) + Firebase Push (engagement, V1.0)

### Accessibility Level

- **Niveau MVP :** WCAG 2.1 AA partiel — focus sur contrastes suffisants (dark/light), navigation clavier, tailles de texte lisibles
- **Priorités :** Ratio de contraste ≥ 4.5:1, labels ARIA sur formulaires, alt text sur images
- **V1.0 :** Audit WCAG 2.1 AA complet

### i18n Architecture

- **Librairie :** `i18next` (React) ou `vue-i18n` (Vue) intégré dès le sprint 1
- **Langues MVP :** Français (fr) + Anglais (en) — fichiers de traduction séparés par namespace (commun, joueur, agent, admin)
- **Détection :** Langue navigateur + choix manuel persisté en localStorage
- **Extensibilité :** Architecture permettant l'ajout de pidgin, fulfudé, éwóndó en V1.0 sans refonte

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Approche MVP :** Problem-Solving MVP — prouver que la visibilité numérique génère des contacts réels entre joueurs et agents via les tournois comme canal d'acquisition physique

**Ressources estimées MVP :** 1 dev fullstack + 1 designer UI/UX, 8-12 semaines

**Critère de go/no-go MVP :** 50 mises en relation confirmées dans les 90 jours post-lancement

### MVP Feature Set (Phase 1 — Mois 1-3)

**Parcours utilisateurs supportés :** Kevin (joueur), Maurice (agent), falcom (admin)

**Capacités indispensables :**

| Espace | Fonctionnalité | Justification |
|---|---|---|
| Joueur | Création profil en < 5 min | Sans ça, pas de données |
| Joueur | Upload vidéo compressée | Preuve de talent |
| Joueur | Lien WhatsApp partageable | Canal d'acquisition |
| Agent | Recherche filtrée (poste/âge/région) | Raison d'être de la plateforme |
| Agent | Consultation profil + contact direct | Conversion de valeur |
| Admin | Validation comptes + modération | Confiance écosystème |
| Tous | i18n FR/EN + thème Dark/Light | Non-négociable dès MVP |
| Tech | PWA install < 15MB, FCP ≤ 3s sur 3G, bundle JS < 200KB | Contexte marché Afrique |

### Post-MVP Features

**Phase 2 — Growth (Mois 3-9) :**
- Validations communautaires (badges coaches/pairs)
- Mode hors-ligne avec sync automatique
- Scout Citoyen : badge + commission tracking
- Pages Tournoi avec résultats
- Messagerie intégrée joueur-agent
- Alertes personnalisées agents
- Langues supplémentaires (pidgin, langues locales)

**Phase 3 — Expansion (Mois 9-24) :**
- IA matching algorithmique
- Application mobile native Android
- Dashboard Analytics + Export PDF
- Module contrat numérique
- API partenaires (fédérations, clubs)
- Expansion Afrique Centrale

### Risk Mitigation Strategy

| Type | Risque | Mitigation |
|---|---|---|
| **Technique** | Compression vidéo sur 2G instable | Cloudinary server-side + queue upload offline |
| **Marché** | Agents non convaincus sans base de joueurs | 1 mois d'essai gratuit + démo ROI lors d'un tournoi pilot |
| **Ressources** | Délai de développement | Réduire MVP à joueur + agent uniquement, admin minimal |

---

## Functional Requirements

### Gestion des Utilisateurs & Authentification

- FR01 : Un visiteur peut créer un compte (joueur, agent, scout) via formulaire ou lien WhatsApp
- FR02 : Un utilisateur peut se connecter avec email/mot de passe
- FR03 : Un utilisateur peut choisir la langue d'interface (FR/EN) et la conserver entre sessions
- FR04 : Un utilisateur peut basculer entre thème dark et light avec persistance de préférence
- FR05 : Un joueur mineur peut soumettre un formulaire de consentement parental téléchargeable
- FR06 : L'administrateur peut valider, suspendre ou supprimer un compte utilisateur
- FR07 : Un utilisateur peut supprimer son compte et ses données sur demande

### Profil Joueur (Passeport Talent)

- FR08 : Un joueur peut créer un profil complet (nom, poste, âge, région, club, photo) en < 5 min
- FR09 : Un joueur peut uploader au moins une vidéo de match (compression automatique côté serveur)
- FR10 : Un joueur peut générer un lien de partage unique vers son profil
- FR11 : Un joueur peut mettre à jour les informations de son profil à tout moment
- FR12 : Un joueur peut consulter un score de complétude indiquant les informations manquantes
- FR13 : Un visiteur peut consulter un profil joueur public via son lien de partage

### Découverte & Recherche de Talents

- FR14 : Un agent peut rechercher des joueurs par filtres combinés (poste, âge, région)
- FR15 : Un agent peut filtrer les résultats par présence de vidéo ou de validation coach
- FR16 : Un agent peut consulter le profil complet d'un joueur (photo, vidéos, stats, informations)
- FR17 : Un agent peut ajouter un joueur à son carnet de suivi (favoris avec notes privées)
- FR18 : Un agent peut recevoir des alertes sur les nouveaux profils correspondant à ses critères (V1.0)

### Communication & Mise en Relation

- FR19 : Un agent peut envoyer un message à un joueur via la messagerie de la plateforme
- FR20 : Un joueur peut recevoir et répondre aux messages d'agents
- FR21 : Un utilisateur peut recevoir des notifications (nouveau contact, nouveau clip, validation) dans un délai ≤ 60s après l'événement déclencheur

### Scout Citoyen & Collecte de Contenu

- FR22 : Un scout citoyen peut uploader un clip vidéo et le lier au profil d'un joueur
- FR23 : Un scout citoyen peut créer un profil joueur simplifié (proxy) depuis le terrain
- FR24 : Le système peut mettre en queue un upload vidéo et le déclencher à la reconnexion réseau
- FR25 : Un scout citoyen peut consulter le statut de ses commissions en attente et versées
- FR26 : L'administrateur peut attribuer ou révoquer le badge Scout Citoyen Certifié

### Validations Communautaires (V1.0)

- FR27 : Un coach enregistré peut valider la compétence d'un joueur sur son profil
- FR28 : Un joueur peut afficher les badges de validation reçus sur son profil public

### Administration & Modération

- FR29 : L'administrateur peut consulter un tableau de bord de santé de la plateforme
- FR30 : L'administrateur peut modérer et supprimer un contenu signalé (vidéo, profil)
- FR31 : Un utilisateur peut signaler un contenu inapproprié ou un compte suspect
- FR32 : L'administrateur peut configurer les plans tarifaires et valider les abonnements agents

### Paiements & Abonnements

- FR33 : Un agent peut souscrire à un abonnement via Mobile Money (Orange Money / MTN MoMo)
- FR34 : Un agent peut consulter l'historique et le statut de ses paiements
- FR35 : Le système peut activer ou désactiver l'accès agent selon le statut d'abonnement

---

## Non-Functional Requirements

### Performance

- NFR01 : First Contentful Paint ≤ 3s sur connexion 3G (1.6 Mbps)
- NFR02 : Time to Interactive ≤ 5s sur connexion 3G
- NFR03 : Upload vidéo (clip 90s) complété en < 60s sur connexion 3G
- NFR04 : Résultats de recherche affichés en < 2s pour une requête filtrée
- NFR05 : Bundle PWA initial < 200KB gzippé (hors assets media)
- NFR06 : Application installable et utilisable hors-ligne (lecture de profil en cache)

### Sécurité

- NFR07 : Toutes les communications chiffrées via HTTPS/TLS 1.3
- NFR08 : Mots de passe stockés avec haçhage bcrypt (coût ≥ 12)
- NFR09 : Tokens d'authentification JWT avec expiration ≤ 24h et rotation par refresh token
- NFR10 : Données personnelles des mineurs accessibles uniquement après validation consentement parental
- NFR11 : Paiements traités uniquement via passerelle certifiée (Orange Money / MTN MoMo API officielle)
- NFR12 : Journalisation des actions administrateur (audit log immuable)
- NFR13 : Protection contre injections SQL, XSS et CSRF sur tous les endpoints

### Scalabilité

- NFR14 : Architecture supportant 10 000 utilisateurs actifs simultanés sans dégradation > 10%
- NFR15 : Infrastructure déployable dans de nouvelles régions géographiques sans refonte (Afrique Centrale)
- NFR16 : Stockage vidéo scalable sans limite définie en avance (Cloudinary ou équivalent CDN)

### Accessibilité

- NFR17 : Ratio de contraste ≥ 4.5:1 pour tout le texte (modes dark et light)
- NFR18 : Tous les formulaires avec labels ARIA et messages d'erreur explicites
- NFR19 : Navigation entièrement possible sans souris (clavier + touch)
- NFR20 : Taille de texte minimale 16px sur mobile, scalable via paramètres système

### Intégrations

- NFR21 : WhatsApp Business API : respect des quotas Meta (opt-in explicite, templates approuvés)
- NFR22 : Mobile Money API : confirmation de transaction côté serveur avant toute activation d'abonnement
- NFR23 : Cloudinary CDN : vidéos servies depuis un nœud Afrique (Lagos ou Johannesburg)
- NFR24 : Disponibilité des intégrations tierces : fallback gracieux si WhatsApp API indisponible

### Fiabilité

- NFR25 : Uptime ≥ 99% hors maintenances planifiées (annoncées 48h à l'avance)
- NFR26 : Sauvegarde automatique du brouillon de profil joueur toutes les 30s pendant la saisie
- NFR27 : Queue d'upload offline persistée localement et synchronisée à la reconnexion
