

# 🏭 Plateforme HSEE LEONI
### Système Digital de Gestion Hygiène · Sécurité · Santé · Environnement · Énergie

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Power BI](https://img.shields.io/badge/Power_BI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

> **Projet de stage d'été — LEONI Tunisie · Département IT-Hub**
> Digitalisation complète du système HSEE : de la planification des inspections jusqu'au suivi des actions correctives, avec un tableau de bord analytique Power BI et un assistant IA RAG intégré.


## 📋 Table des matières

- [🎯 Contexte et problématique](#-contexte-et-problématique)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Stack technique](#️-stack-technique)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [📁 Structure du projet](#-structure-du-projet)
- [🔐 Authentification et rôles](#-authentification-et-rôles)
- [📊 Tableau de bord Power BI](#-tableau-de-bord-power-bi)
- [🤖 Chatbot RAG](#-chatbot-rag)
- [⚙️ Pipeline CI/CD](#️-pipeline-cicd)
- [🌍 Variables d'environnement](#-variables-denvironnement)
- [📸 Captures d'écran](#-captures-décran)
- [👨‍💻 Auteur](#-auteur)

---

## 🎯 Contexte et problématique

**LEONI** est l'un des plus grands groupes industriels mondiaux spécialisés dans les systèmes de câblage et les solutions de câbles. Ses usines en Tunisie emploient des milliers de collaborateurs et sont soumises à des exigences strictes en matière de **Hygiène, Sécurité, Santé, Environnement et Énergie (HSEE)**.

### ❌ Avant — La situation initiale

```
📊 Suivi sur Excel          → Pas de traçabilité, erreurs manuelles
📋 Checklists papier        → Perte de données, saisie longue
📧 Emails manuels           → Aucune automatisation des alertes
📅 Planning manuel           → Pas de vision 52 semaines
🔍 Aucun KPI temps réel     → Décisions basées sur des données obsolètes
```

### ✅ Après — La solution développée

```
🌐 Plateforme web complète  → Accès multi-rôles, temps réel
📱 Interface mobile-ready   → GPS, photos, checklist numérique
⚡ Automatisation totale    → Emails, notifications, rappels crons
📅 Planning 52 semaines     → Génération automatique, vue calendrier
📊 Dashboard Power BI       → KPIs en temps réel, RLS par rôle
🤖 Chatbot RAG              → Questions en langage naturel sur les données HSEE
```

---

## ✨ Fonctionnalités

### 🔐 Authentification & Gestion des accès
- Authentification JWT avec Access Token (15min) + Refresh Token (7j)
- 3 rôles distincts : **Admin HSEE**, **Auditeur**, **Pilote d'Action**
- Interface adaptative selon le rôle (menus, pages, données visibles)
- Déconnexion automatique après inactivité (`InactivityDialog`)
- Activation de compte par email avec lien sécurisé

### 🗓️ Plan de surveillance 52 semaines
- Planification par domaine (11 domaines) et site géographique
- 4 fréquences : Hebdomadaire · Mensuel · Trimestriel · Annuel
- **Génération automatique** des occurrences selon la fréquence
- Vue calendrier matricielle (11 domaines × 52 semaines) avec codes couleur
- Cron quotidien à minuit : `PLANIFIE → EN_RETARD` si échéance dépassée
- Cron hebdomadaire (vendredi 18h) : génération automatique semaine suivante
- Import/Export CSV pour migration depuis Excel

### 🔍 Gestion des inspections
- Création avec **horodatage serveur non falsifiable**
- Capture GPS géolocalisation (mobile-ready)
- Cycle de vie : `PLANIFIE → EN_COURS → REALISE → EN_RETARD`
- Clôture conditionnelle : **checklist 100% complète obligatoire**
- Vérification SQL cross-module (sans dépendance circulaire)
- Page "Mes tâches" dédiée à l'Auditeur (filtré par JWT, pas de planning global)
- Export CSV des inspections filtrées

### 📋 Checklists (Epic binôme)
- 11 templates par domaine (PLANT, SANITAIRES, CANTINE, INFIRMERIE...)
- Système de cotation adapté par domaine (0-3, 0-10, 0/1/2)
- Détection automatique des déviations (`isDeviation = true`)
- Ajout de photos comme preuves terrain
- Analyse des causes et responsable suggéré

### ⚠️ Anomalies & Actions correctives
- Détection automatique lors du remplissage checklist
- Vue graphique : anomalies par domaine + par criticité
- Création d'action corrective depuis l'anomalie (préfill automatique)
- Assignation à un Pilote → **email HTML branded + notification in-app**
- Cycle complet : `OUVERTE → EN_COURS → SOUMISE → VALIDEE/REJETEE → CLOTUREE`
- Ajout de preuves et commentaires par le Pilote
- Validation/Rejet avec motif par l'Auditeur ou Admin

### 🔔 Système de notifications
- **Notifications in-app** : polling automatique 60 secondes
- Badge compteur sur la cloche (non-lus)
- Panel Dialog sans Popper.js (contrainte technique résolue)
- 10 types de notifications couvrant tous les événements métier
- Centre de notifications paginé avec filtres
- **Emails HTML branded LEONI** (Nodemailer SMTP) :
  - Assignation action corrective au Pilote
  - Validation / Rejet avec motif
  - Rappels deadline J-7 et J-1 (cron 08h00)
  - Alertes événements réglementaires J-30 et J-7

### 📅 Événements réglementaires
- 11 types : Audit certification, CSST, Analyses eau, Formation HSE...
- Alertes automatiques email + notification à J-30 et J-7
- Marquage automatique EN_RETARD si échéance dépassée
- Gestion récurrence et organisme externe

### 📊 Tableau de bord Power BI
- **Page 1 — Stratégique** (Admin / Direction) :
  - 4 cartes KPI : taux réalisation, conformité, anomalies, actions retard
  - Donut statuts inspections (P/R/Retard)
  - Barres conformité par domaine
  - Courbe tendance hebdomadaire
  - Histogramme multi-sites
- **Page 2 — Opérationnelle** (Auditeur / Pilote) :
  - KPIs personnels filtrés par JWT
  - Tableau actions urgentes (deadline < 7j) avec formatage rouge
  - Entonnoir cycle actions
  - **RLS (Row-Level Security)** par email utilisateur
- 5 vues SQL analytiques optimisées pour Power BI

### 🤖 Chatbot RAG (Intelligence Artificielle)
- Questions en langage naturel sur les données HSEE
- LLM : **Mistral-7B** (Hugging Face, GPU T4 Google Colab)
- Embeddings : **MiniLM** (sentence-transformers)
- Vector Store maison + **ChromaDB**
- Pipeline **LangChain** RAG complet
- Classifier criticité ML maison (Random Forest + TF-IDF)
- API **FastAPI** + tunnel **ngrok** vers PostgreSQL local
- Intégré dans l'interface React existante

### ⚙️ DevOps & CI/CD
- **Pipeline GitHub Actions** complet (backend + frontend)
- Multi-stage **Dockerfile** (build → production)
- **docker-compose** orchestration complète
- Déploiement automatique sur VPS via SSH
- Backup PostgreSQL quotidien (02h00)
- Stratégie de branches : `main` (prod) · `develop` (staging) · `feature/*`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND — React 18                          │
│  TypeScript · MUI v5 · React Router v6 · Axios · PowerBIEmbed  │
│  Pages: Auth · Dashboard · Inspections · Planning · Notifs...   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST — JWT Bearer Token
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND — NestJS 10                          │
│  TypeScript · TypeORM · Passport JWT · class-validator          │
│  Modules: Auth · Users · Inspections · Planning · Actions       │
│           Notifications · Mail · RegulatoryEvents               │
│  Crons: @nestjs/schedule (minuit + 08h + vendredi 18h)          │
│  Emails: Nodemailer SMTP + Templates HTML branded               │
└──────────────────────┬──────────────────────────────────────────┘
                       │ TypeORM + SQL brut (DataSource.query)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BASE DE DONNÉES — PostgreSQL 15                 │
│  Tables: users · inspections · plan_surveillance                │
│          corrective_actions · notifications · regulatory_events │
│          checklist_templates · checklist_items · checklist_responses │
│  Vues SQL: v_conformite_domaine · v_inspections_par_semaine     │
│            v_taux_realisation_site · v_actions_operationnelles  │
│            v_inspections_auditeur                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │ DirectQuery / Import
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  POWER BI — Analytics                           │
│  Page 1: KPIs stratégiques · RLS Admin/Direction                │
│  Page 2: Suivi opérationnel · RLS Auditeur/Pilote              │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Chatbot RAG

```
Frontend React ──→ FastAPI (port 8000)
                       │
                   ngrok tunnel
                       │
               Google Colab (GPU T4)
                       │
              ┌────────┴────────┐
          LangChain RAG    ChromaDB
              │                │
          Mistral-7B      MiniLM Embed
```

---

## 🛠️ Stack technique

| Couche | Technologie | Version | Usage |
|--------|------------|---------|-------|
| **Frontend** | React | 18 | UI composants |
| | TypeScript | 5.x | Typage statique |
| | Vite | 5.x | Build tool |
| | Material UI | v5 | Design system |
| | React Router | v6 | Navigation SPA |
| | Axios | 1.x | Client HTTP |
| | powerbi-client-react | 2.x | Embed Power BI |
| **Backend** | NestJS | 10.x | Framework API |
| | TypeORM | 0.3.x | ORM |
| | Passport JWT | — | Authentification |
| | class-validator | — | Validation DTOs |
| | @nestjs/schedule | — | Crons automatiques |
| | Nodemailer | — | Envoi emails SMTP |
| | bcrypt | — | Hash mots de passe |
| **Base de données** | PostgreSQL | 15 | BDD principale |
| **Analytics** | Power BI | Desktop/Service | Dashboard KPI |
| **IA / RAG** | LangChain | — | Pipeline RAG |
| | Mistral-7B | HF | LLM génération |
| | ChromaDB | — | Vector store |
| | sentence-transformers | — | Embeddings MiniLM |
| | FastAPI | — | API Python RAG |
| | ngrok | — | Tunnel local → Colab |
| **DevOps** | Docker | — | Conteneurisation |
| | GitHub Actions | — | CI/CD pipeline |
| | Nginx | alpine | Serveur web frontend |

---

## 🚀 Démarrage rapide

### Prérequis

```bash
node >= 20
npm >= 10
docker >= 24
docker-compose >= 2.x
postgresql >= 15 (ou via Docker)
```

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/hsee-leoni.git
cd hsee-leoni
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

### 3. Démarrer avec Docker Compose

```bash
docker-compose up -d
# PostgreSQL + Backend NestJS + Frontend React
# Disponible sur http://localhost:80
```

### 4. Démarrer en développement (sans Docker)

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

### 5. Comptes par défaut

```
Admin HSEE   : admin@leoni.tn    / Admin123!
Auditeur     : auditeur@leoni.tn / Audit123!
Pilote       : pilote@leoni.tn   / Pilot123!
```

---

## 📁 Structure du projet

```
leoni-hsee/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                    # Pipeline CI/CD complet
│
├── backend/                             # NestJS API REST
│   ├── src/
│   │   ├── auth/                        # Authentification JWT
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── forgot-password.dto.ts
│   │   │   │   └── reset-password.dto.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   │
│   │   ├── users/                       # Gestion utilisateurs
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── inspections/                 # Inspections terrain
│   │   │   ├── inspections.controller.ts
│   │   │   ├── inspections.service.ts
│   │   │   ├── inspections.module.ts
│   │   │   ├── inspection.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-inspection.dto.ts
│   │   │       └── update-inspection.dto.ts
│   │   │
│   │   ├── checklists/                  # Checklists par domaine
│   │   │   ├── checklists.controller.ts
│   │   │   ├── checklists.service.ts
│   │   │   ├── checklists.module.ts
│   │   │   ├── entities/
│   │   │   │   ├── checklist-template.entity.ts
│   │   │   │   ├── checklist-item.entity.ts
│   │   │   │   ├── checklist-response.entity.ts
│   │   │   │   └── checklist-response-photo.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-checklist.dto.ts
│   │   │       └── submit-response.dto.ts
│   │   │
│   │   ├── anomalies/                   # Détection anomalies
│   │   │   ├── anomalies.controller.ts
│   │   │   ├── anomalies.service.ts
│   │   │   ├── anomalies.module.ts
│   │   │   ├── entities/
│   │   │   │   ├── anomaly.entity.ts
│   │   │   │   └── anomaly-photo.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-anomaly.dto.ts
│   │   │       └── update-anomaly.dto.ts
│   │   │
│   │   ├── corrective-actions/          # Workflow PDCA
│   │   │   ├── actions.controller.ts
│   │   │   ├── actions.service.ts
│   │   │   ├── actions.module.ts
│   │   │   ├── entities/
│   │   │   │   ├── corrective-action.entity.ts
│   │   │   │   ├── action-proof.entity.ts
│   │   │   │   ├── action-comment.entity.ts
│   │   │   │   └── action-history.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-action.dto.ts
│   │   │       ├── update-status.dto.ts
│   │   │       └── reject-action.dto.ts
│   │   │
│   │   ├── dashboard/                   # KPIs et statistiques
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dashboard.module.ts
│   │   │
│   │   ├── rag/                         # Proxy chatbot RAG
│   │   │   ├── rag.controller.ts
│   │   │   ├── rag.service.ts
│   │   │   └── rag.module.ts
│   │   │
│   │   ├── mail/                        # Emails Nodemailer
│   │   │   ├── mail.service.ts
│   │   │   └── mail.module.ts
│   │   │
│   │   ├── common/                      # Partagé
│   │   │   ├── enums/
│   │   │   │   ├── role.enum.ts
│   │   │   │   ├── domaine.enum.ts
│   │   │   │   ├── anomaly-status.enum.ts
│   │   │   │   ├── action-status.enum.ts
│   │   │   │   └── inspection-status.enum.ts
│   │   │   ├── guards/
│   │   │   │   └── roles.guard.ts
│   │   │   └── decorators/
│   │   │       └── roles.decorator.ts
│   │   │
│   │   ├── app.module.ts                # Module racine
│   │   └── main.ts                      # Point d'entrée
│   │
│   ├── Dockerfile
│   ├── .env                             # Variables d'environnement
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                            # React + TypeScript + MUI
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts                   # Instance Axios + interceptors
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx          # Contexte authentification
│   │   │
│   │   ├── services/                    # Appels API
│   │   │   ├── authService.ts
│   │   │   ├── userService.ts
│   │   │   ├── inspectionService.ts
│   │   │   ├── anomalyService.ts
│   │   │   ├── actionService.ts
│   │   │   ├── checklistService.ts
│   │   │   └── ragService.ts
│   │   │
│   │   ├── pages/                       # Pages React
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   ├── ResetPasswordPage.tsx
│   │   │   │   └── SetPasswordPage.tsx
│   │   │   ├── admin/
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   └── CreateUserPage.tsx
│   │   │   ├── inspections/
│   │   │   │   ├── InspectionsListPage.tsx
│   │   │   │   └── CreateInspectionPage.tsx
│   │   │   ├── checklists/
│   │   │   │   ├── ChecklistBuilderPage.tsx
│   │   │   │   ├── ChecklistFillPage.tsx
│   │   │   │   └── ChecklistResultsPage.tsx
│   │   │   ├── anomalies/
│   │   │   │   ├── AnomaliesPage.tsx
│   │   │   │   └── AnomalyDetailPage.tsx
│   │   │   ├── actions/
│   │   │   │   ├── ActionsListPage.tsx
│   │   │   │   └── ActionDetailPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── ForbiddenPage.tsx
│   │   │
│   │   ├── components/                  # Composants réutilisables
│   │   │   ├── inspections/
│   │   │   │   └── GeoLocationCapture.tsx
│   │   │   ├── chat/
│   │   │   │   └── HseeChat.tsx         # Chatbot RAG flottant
│   │   │   └── layout/
│   │   │       └── AppLayout.tsx
│   │   │
│   │   ├── types/                       # Types TypeScript
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx                      # Routing principal
│   │   └── main.tsx                     # Point d'entrée
│   │
│   ├── Dockerfile
│   ├── nginx.conf                       # Config Nginx production
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── terraform/                           # Infrastructure as Code
│   ├── main.tf                          # Provider AWS
│   ├── variables.tf                     # Variables Terraform
│   ├── vpc.tf                           # VPC + Subnets
│   ├── ecr.tf                           # Repos ECR
│   ├── ec2.tf                           # EC2 + SG + EIP
│   └── leoni-hsee-key.pub               # Clé publique SSH
│
├── docker-compose.yml                   # Développement local
├── docker-compose.prod.yml              # Production EC2
└── .gitignore
```
-----
## 🔐 Authentification et rôles

| Fonctionnalité | Admin HSEE | Auditeur | Pilote d'Action |
|---|:---:|:---:|:---:|
| Dashboard Power BI (stratégique) | ✅ | ❌ | ❌ |
| Dashboard Power BI (opérationnel) | ✅ | ✅ | ✅ |
| Plan surveillance 52 semaines | ✅ | ❌ | ❌ |
| Mes tâches (inspections assignées) | ❌ | ✅ | ❌ |
| Créer une inspection | ✅ | ✅ | ❌ |
| Clôturer une inspection | ✅ | ✅ | ❌ |
| Voir toutes les anomalies | ✅ | ✅ | ❌ |
| Créer action corrective | ✅ | ✅ | ❌ |
| Traiter une action (pilote) | ❌ | ❌ | ✅ |
| Valider/Rejeter une action | ✅ | ✅ | ❌ |
| Gestion utilisateurs | ✅ | ❌ | ❌ |
| Événements réglementaires | ✅ | ❌ | ❌ |
| Notifications in-app | ✅ | ✅ | ✅ |

---

## 📊 Tableau de bord Power BI

Le dashboard Power BI est intégré directement dans l'application via `PowerBIEmbed` et repose sur **5 vues SQL** créées dans PostgreSQL :

```sql
v_conformite_domaine        -- Score conformité % par domaine
v_inspections_par_semaine   -- Tendance hebdomadaire
v_taux_realisation_site     -- Performance par site géographique
v_actions_operationnelles   -- Actions avec délai restant + alertes
v_inspections_auditeur      -- Vue filtrée pour RLS auditeur
```

**RLS configuré pour 3 rôles :**
- `ADMIN_HSEE` → toutes les données, tous les sites
- `AUDITEUR` → ses inspections uniquement (`auditeur_email = USERPRINCIPALNAME()`)
- `PILOTE_ACTION` → ses actions uniquement (`pilote_email = USERPRINCIPALNAME()`)

---

## 🤖 Chatbot RAG

Architecture distribuée exploitant Google Colab (GPU T4 gratuit) :

```
Question utilisateur
      ↓
FastAPI (local) ← ngrok ← Google Colab
      ↓                        ↓
PostgreSQL              LangChain Pipeline
(données réelles)             ↓
                    MiniLM Embeddings
                             ↓
                        ChromaDB Search
                             ↓
                    Mistral-7B (génération)
                             ↓
                      Réponse contextualisée
```

**Composants développés sur mesure :**
- 🧠 **Vector Store maison** — indexation par domaine HSEE
- 🎯 **Classifier criticité** — Random Forest + TF-IDF sur données LEONI

---

## ⚙️ Pipeline CI/CD

```
git push → GitHub Actions
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
feature/*   develop       main
    │           │           │
lint+test  lint+test   lint+test
           +build      +build
           +deploy     +deploy
           staging     production
```

**GitHub Secrets requis :**

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Username Docker Hub |
| `DOCKER_TOKEN` | Token Docker Hub |
| `PROD_HOST` | IP serveur production |
| `PROD_SSH_KEY` | Clé SSH privée |
| `JWT_SECRET` | Secret JWT production |
| `POSTGRES_PASSWORD` | Mot de passe BDD |
| `VITE_API_URL` | URL API production |

---

## 🌍 Variables d'environnement

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/leoni_db

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=hsee@leoni.tn
SMTP_PASS=your-smtp-password

# Frontend
FRONTEND_URL=https://hsee.leoni.tn

# Frontend (Vite)
VITE_API_URL=https://hsee.leoni.tn/api
```

---

## 📸 Captures d'écran

| Page | Description |
|------|-------------|
| ![Login](/Interfaces/login.png) | Page de connexion sécurisée |
| ![Dashboard](/Interfaces/dashboard1.png) | Tableau de bord Power BI embarqué |
| ![Planning](/Interfaces/plan.png) | Calendrier 52 semaines |
| ![Inspections](/Interfaces/inspectionPage.png) | Liste des inspections avec filtres |
| ![MesTaches](/Interfaces/mes%20taches.png) | Page tâches Auditeur |
| ![Notifications](/Interfaces/notif.png) | Centre de notifications |
| ![Chatbot](Interfaces/chatbot.png) | Assistant IA RAG |

> 📸 *Remplacer les liens `#` par vos vraies captures d'écran*

---

## 👨‍💻 Auteur

**Oumayma Elhaj mohamed et Ben Tiba Roua**

Étudiantes en 3 éme année cycle d'ingénieur en informatique — Stagiaire IT-Hub chez LEONI Tunisie


---

## 🏢 Contexte entreprise

> **LEONI AG** — Groupe industriel allemand mondial
> Spécialiste des systèmes de câblage et solutions de câbles
> Présence dans plus de 30 pays · Usines en Tunisie (Sousse, Mateur, Manzel Hayett)
> Département **IT-Hub Tunisie** — Centre d'excellence technologique

---



**⭐ Si ce projet vous a été utile, n'hésitez pas à laisser une étoile !**

*Développé avec ❤️ lors d'un stage chez LEONI Tunisie*


