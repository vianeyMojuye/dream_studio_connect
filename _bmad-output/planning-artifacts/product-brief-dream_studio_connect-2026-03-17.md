---
stepsCompleted: [step-01-init, step-02-vision, step-03-users, step-04-metrics, step-05-scope, step-06-complete]
inputDocuments:
  - "_bmad-output/dream-studio-connect-analyse.md"
  - "_bmad-output/brainstorming/brainstorming-session-2026-03-12-1620.md"
date: 2026-03-17
author: falcom
---

# Product Brief: dream_studio_connect

---

## Executive Summary

Dream Studio Connect est la première plateforme camerounaise de mise en relation entre footballeurs amateurs/semi-professionnels et agents de football locaux. Elle donne une existence numérique permanente aux talents invisibles, et connecte les agents avec des profils vérifiés — depuis un téléphone Android bas de gamme, via WhatsApp, au cœur du terrain.

> *"Ton talent existe. On le rend visible."*

---

## Core Vision

### Problem Statement

Le Cameroun regorge de footballeurs talentueux qui restent invisibles : pas d'existence numérique, pas de canal structuré vers les agents. Ce n'est pas un problème de talent — c'est un **problème de visibilité**.

### Problem Impact

- Le joueur n'existe nulle part en dehors de son terrain physique
- L'agent dépense temps et argent en déplacements pour peu de résultats
- Le talent rural (Maroua, Ngaoundéré) est totalement exclu du système
- Le bouche à oreille reste le seul mécanisme de recommandation — non scalable

### Why Existing Solutions Fall Short

- **WhatsApp** : messages éphémères, limités au réseau existant, aucune recherche structurée
- **Transfermarkt / FIFA Connect** : conçus pour l'élite mondiale, interface complexe, nécessitent bonne connexion, ignorent l'Afrique profonde
- **Aucune solution locale structurée** n'existe sur le marché camerounais

### Proposed Solution

Une PWA (Progressive Web App) accessible depuis un Android bas de gamme en 2G/3G, permettant à un joueur de créer son "Passeport Talent" en moins de 5 minutes — partageable via WhatsApp — et trouvable par un agent via un moteur de recherche filtré (poste, âge, région).

L'acquisition s'appuie sur un écosystème physique propriétaire : tournois organisés par Dream Studio Connect + scouts citoyens formés sur le terrain.

### Key Differentiators

1. **Tournois physiques** comme canal d'acquisition propriétaire — impossible à répliquer par un concurrent purement digital
2. **Réseau de scouts citoyens** formés et commissionnés — "yeux" permanents sur tous les terrains du Cameroun
3. **First mover** sur la plateforme structurée de talent footballistique camerounais
4. **Conçu pour les contraintes locales** : 2G/3G, Android bas de gamme, français + langues locales, confiance culturelle
5. **Double mission** sociale et économique — un positionnement authentique difficile à copier

---

## Target Users

### Primary Users

#### 🏃 Kevin — Le Footballeur Invisible

- **Profil :** 19 ans, ailier gauche, club de quartier à Bafoussam
- **Équipement :** Android bas de gamme, WhatsApp, connexion 3G instable
- **Contexte :** Son coach dit qu'il a le niveau pour monter — mais personne hors de son quartier ne le sait
- **Situation actuelle :** Envoie des vidéos sur WhatsApp qui disparaissent en 24h, dans le même cercle de 50 personnes
- **Objectif :** Exister quelque part en dehors du terrain, avoir une chance d'être vu par quelqu'un qui compte
- **Moment "aha!" :** Il partage son lien de profil sur WhatsApp et un agent lui écrit 3 jours après

**Segments inclus :** joueurs de clubs de quartier, talents ruraux (Maroua, Ngaoundéré), jeunes d'académies locales — âge 15-27 ans.

#### 🤝 Maurice — L'Agent Local Frustré

- **Profil :** 38 ans, agent non-certifié FIFA, opère à Yaoundé et Douala
- **Contexte :** Place 3-4 joueurs par an dans des clubs locaux et parfois africains
- **Situation actuelle :** 2 weekends/mois en minibus vers des tournois — souvent pour rien. Réseau WhatsApp de coaches, aucune structure.
- **Objectif :** Filtrer "défenseur central, 17-22 ans, région Centre" depuis son téléphone, sans se déplacer
- **Moment "aha!" :** Il trouve un profil avec 3 vidéos + 2 validations de coaches — il contacte le joueur directement

### Secondary Users

#### ⚙️ L'Administrateur Général (falcom)

- Gère la plateforme dans sa globalité : validation des comptes, certification des agents, supervision du réseau de scouts, pilotage des tournois
- Accès back-office complet : gestion des utilisateurs, modération des contenus, suivi des commissions, analytics globaux
- Garant de la qualité et de la confiance dans l'écosystème — certifie, valide et sanctionne
- **Besoin clé :** Vue d'ensemble claire, outils d'action rapide, maintien de la crédibilité de la plateforme

#### 🔍 Le Scout Citoyen

- Jeune local formé et certifié par Dream Studio Connect
- Filme et tague les joueurs lors des matchs de quartier et tournois
- Rémunéré à la commission si un joueur est recruté via son upload
- Devient les "yeux" permanents de la plateforme sur le terrain

#### 🏆 L'Organisateur de Tournoi

- Partenaire clé de l'écosystème physique DSC
- Point d'entrée naturel pour l'acquisition de nouveaux joueurs
- Bénéficie de la digitalisation de ses événements (visibilité, résultats, profils)

#### 👨‍👩‍👦 Le Parent du Joueur Mineur

- Décideur silencieux pour les joueurs de moins de 18 ans
- Méfiant par défaut envers les agents non traçables
- Rassuré par la transparence, les badges certifiés et la traçabilité de la plateforme

### User Journey

**Parcours joueur (acquisition via tournoi) :**

```
Tournoi DSC organisé
        ↓
Joueur participe au match
        ↓
Scout Citoyen filme & tague le joueur
        ↓
Lien WhatsApp envoyé au joueur post-match
        ↓
Joueur crée son Passeport Talent en < 5 min
        ↓
Agent reçoit notification : nouveau profil disponible
        ↓
Agent filtre, consulte le profil, contacte le joueur
        ↓
✅ Mise en relation réussie
```

**Parcours agent (acquisition directe) :**

```
Agent entend parler de DSC (bouche à oreille / tournoi)
        ↓
Inscription + période d'essai gratuite
        ↓
Recherche filtrée : poste + âge + région
        ↓
Consultation des profils avec vidéos + validations
        ↓
Contact direct joueur via messagerie sécurisée
        ↓
✅ Conversion en abonnement payant après 1er recrutement réussi
```
---

## Success Metrics

### User Success Metrics

| Utilisateur | Métrique | Signal de valeur |
|---|---|---|
| **Joueur** | Profil créé en < 5 min | Onboarding réussi sur Android bas de gamme |
| **Joueur** | ≥ 1 contact d'agent reçu dans les 30 jours | La plateforme génère une opportunité réelle |
| **Agent** | ≥ 1 joueur trouvé via recherche filtrée / semaine | Le moteur de recherche remplace les déplacements |
| **Agent** | Taux de conversion recherche → contact ≥ 20% | Les profils sont assez riches pour décider sans se déplacer |
| **Scout Citoyen** | ≥ 1 commission perçue dans les 3 premiers mois | Le modèle d'incitation fonctionne |

### Business Objectives

| Phase | Objectif | Horizon |
|---|---|---|
| **MVP** | 500 joueurs inscrits, 30 agents actifs | Mois 3 |
| **V1.0** | 3 000 joueurs, 150 agents, toutes régions Cameroun | Mois 9 |
| **V2.0** | ≥ 2 000 000 FCFA/mois de revenus récurrents | Mois 12 |
| **V3.0** | Présence Afrique Centrale (Gabon, Congo, Tchad) | Mois 24 |

### Key Performance Indicators

**Acquisition :**
- Nombre de joueurs inscrits / tournoi organisé
- Taux de conversion tournoi → profil créé (cible : ≥ 60%)

**Engagement :**
- Taux de complétion des profils (cible : ≥ 70% avec au moins 1 vidéo)
- Taux de retour agents / semaine (cible : ≥ 3 sessions/semaine/agent actif)

**Business :**
- MRR (Monthly Recurring Revenue) agents abonnés
- Churn agents (cible : < 10%/mois)
- Nombre de mises en relation joueur-agent complétées / mois

---

## MVP Scope

### Core Features

**Espace Joueur :**
- Création de profil en < 5 min (nom, poste, âge, région, club, photo)
- Upload d'au moins 1 vidéo (compression automatique côté serveur)
- Lien de partage WhatsApp unique
- Compatible Android bas de gamme / 2G-3G
- Interface multilingue **FR/EN** (architecture i18n dès la base)
- Thème **Dark / Light** avec détection automatique (`prefers-color-scheme`) + bascule manuelle

**Espace Agent :**
- Moteur de recherche filtré (poste + âge + région)
- Consultation des profils avec vidéos
- Contact direct avec le joueur
- Interface multilingue FR/EN + thème Dark/Light

**Administration :**
- Gestion des comptes utilisateurs (validation, suspension)
- Modération basique des contenus
- Back-office multilingue FR/EN

> **Contraintes architecture :**
> - i18n (`i18next`) posé dès le sprint 1 — ajout de langues futures (pidgin, langues locales) trivial
> - Theming (CSS custom properties / Tailwind dark mode) dès le sprint 1 — évite une refonte visuelle ultérieure

### Out of Scope for MVP

- Validations communautaires (badges coaches/peers) → V1.0
- Mode hors-ligne / sync automatique → V1.0
- Alertes personnalisées agents → V1.0
- Scout Citoyen : badge + tracking commission → V1.0
- Pages Tournoi avec résultats live → V1.0
- Messagerie intégrée joueur-agent → V1.0
- Dashboard Analytics agent → V2.0
- Export PDF fiche joueur → V2.0
- Langues supplémentaires (pidgin, langues locales) → V1.0

### MVP Success Criteria

- 500 joueurs inscrits avec profil complété à ≥ 70%
- 30 agents actifs (≥ 1 recherche/semaine)
- ≥ 50 mises en relation confirmées
- Taux de complétion onboarding ≥ 60% sur Android bas de gamme
- Disponible en FR et EN sans bug d'affichage
- Thème dark/light fonctionnel sur les 3 espaces (joueur, agent, admin)

### Future Vision

**V1.0 (Mois 3-9) :**
- Validations communautaires, mode hors-ligne, alertes agents, Scout Citoyen, Pages Tournoi, messagerie
- Langues supplémentaires (pidgin, langues locales camerounaises)

**V2.0 (Mois 9-18) :**
- Dashboard Analytics, Export PDF, matching algorithmique, app mobile native Android
- Expansion toutes régions Cameroun

**V3.0 (Mois 18-36) :**
- Intelligence artificielle sur les profils
- Expansion Afrique Centrale (Gabon, Congo, Tchad)
- Module contrat numérique
- API partenaires (fédérations, clubs)