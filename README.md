# Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale - Tchad

Site web officiel du MTACMN (Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale) de la République du Tchad.

## 🚀 Stack technique

- **Frontend**: React 18 + Vite (statique, déployé sur Vercel)
- **API Backend**: Node.js Serverless Functions (Vercel `/api` routes)
- **Database**: MySQL 5.7+ (hébergé externalement)
- **Auth**: Sessions + CSRF tokens

## 📋 Prérequis

- Node.js 18+
- MySQL 5.7+ (avec accès réseau)
- Compte Vercel (pour le déploiement)

## 🛠 Installation & Développement local

### 1. Cloner et installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
Créez un fichier `.env` à la racine :
```bash
cp .env.example .env
```

Éditez `.env` avec vos paramètres MySQL :
```env
MYSQL_HOST=your-mysql-host
MYSQL_USER=your-user
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=mtacmn
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=admin2026
```

### 3. Démarrer le développement
```bash
# Terminal 1: Frontend (Vite) - http://localhost:5173
npm run dev

# Terminal 2: API Node.js (local testing) - http://localhost:3000
npm run dev:api
```

## 🔐 Administration sécurisée

- Accédez à http://localhost:5173/admin.html
- Authentification côté serveur via `/api/auth` (sessions + CSRF)
- Compte par défaut : `admin` / `admin2026`
- **⚠️ Changez les identifiants immédiatement en production !**

## 📦 Déploiement sur Vercel

### 1. Préparer le build
```bash
npm run build
```

### 2. Deployer sur Vercel
```bash
npm install -g vercel
vercel
```

### 3. Configurer les variables d'environnement dans Vercel
Dans le dashboard Vercel, allez à **Settings > Environment Variables** et définissez :
```
MYSQL_HOST=your-mysql-host
MYSQL_USER=your-user
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=mtacmn
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=your-secure-password
```

Vercel déploiera automatiquement :
- **Frontend statique** (React + Vite) → `dist/`
- **API Serverless** (Node.js) → `/api/*` routes

## 🗂 Structure du projet

```
.
├── src/                    # Frontend React
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── api/                    # Vercel Serverless Functions
│   ├── middleware.js       # Auth, CORS, sessions
│   ├── db.js              # MySQL queries
│   ├── auth.js            # POST/GET /api/auth*
│   ├── articles.js        # GET/POST/PUT/DELETE /api/articles
│   ├── settings.js        # GET/PUT /api/settings
│   └── health.js          # GET /api/health (init DB)
├── admin.html             # Dashboard admin (vanilla JS)
├── database.js            # Client API wrapper (legacy)
├── vercel.json           # Config Vercel (functions + static)
├── vite.config.js        # Config Vite (frontend build)
└── .env.example          # Template variables d'env
```

## 🔌 Endpoints API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth` | ❌ | Login → retourne CSRF token + session |
| GET | `/api/auth/status` | ✅ | Vérifier l'authentification |
| GET | `/api/auth/logout` | ✅ | Déconnexion |
| GET | `/api/articles` | ❌ | Lister articles (filtres: statut, categorie) |
| GET | `/api/articles/:id` | ❌ | Article détail |
| POST | `/api/articles` | ✅ | Créer article |
| PUT | `/api/articles/:id` | ✅ | Mettre à jour article |
| DELETE | `/api/articles/:id` | ✅ | Supprimer article |
| GET | `/api/settings` | ❌ | Lister tous les paramètres |
| PUT | `/api/settings` | ✅ | Mettre à jour setting |
| GET | `/api/health` | ❌ | Initialiser la DB (appelé automatiquement) |

## 🔒 Sécurité

- **Sessions**: Cookies HttpOnly + SameSite=Strict
- **CSRF**: Tokens générés à la connexion, validés sur POST/PUT/DELETE
- **Credentials**: Env vars uniquement (jamais hardcodées)
- **CORS**: Configuré pour éviter les accès non autorisés
- **HTTPS**: Recommandé en production (Vercel fourni par défaut)

## 🐛 Troubleshooting

### "Erreur de connexion MySQL"
- Vérifiez `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` dans `.env`
- Assurez-vous que la base de données est accessible depuis votre IP
- Les tables sont créées automatiquement à la première requête

### "Admin login échoue"
- Récupérez les logs : `vercel logs` (en production)
- En local, vérifiez que `ADMIN_DEFAULT_USERNAME` et `ADMIN_DEFAULT_PASSWORD` sont définis
- Les sessions sont stockées en mémoire (réinitialisées au redéploiement) — utilisez Redis en production

### "CORS error"
- Vérifiez que Vercel permet les requêtes cross-origin
- Le middleware CORS est actif sur tous les `/api` endpoints
# Construire le projet
npm run build

# Prévisualiser la version de production
npm run preview
```

## 📁 Structure du projet

```
src/
├── App.jsx          # Composant principal du site
├── main.jsx         # Point d'entrée React
└── index.css        # Styles globaux
```

## 🎨 Personnalisation

### Images
Toutes les images sont centralisées dans l'objet `IMAGES` dans `src/App.jsx`. Pour remplacer une image :

1. **URL externe** : Changez simplement l'URL
2. **Image locale** : Placez l'image dans le dossier `public/` et utilisez le chemin relatif
3. **Import direct** : Importez l'image et utilisez la variable

### Données du ministère
Les informations du ministère sont dans l'objet `MINISTERE` :
- Nom et sigle
- Coordonnées (téléphone, email, adresse)
- Informations de la ministre

### Actualités
Les articles sont dans `ACTUALITES_INITIALES`. Chaque article contient :
- Titre, date, catégorie
- Résumé et contenu complet
- Image associée

### Projets
Les projets stratégiques sont dans `PROJETS` avec :
- Titre et description
- Secteur et statut
- Budget et avancement

### Structures sous tutelle
Les agences sont définies dans `SOUS_STRUCTURES` avec leurs coordonnées.

## 🌐 Fonctionnalités

- **Page d'accueil** : Hero section, actualités à la une, mot de la ministre
- **Actualités** : Articles filtrables par catégorie avec lecture détaillée
- **Projets** : Suivi des grands chantiers nationaux avec barres de progression
- **Météorologie** : Prévisions météo des grandes villes et informations ANAM
- **Réglementations** : Textes officiels et lois par secteur
- **Contact** : Formulaire de contact et informations officielles

## 🎨 Design

- **Palette de couleurs** :
  - Bleu aviation : `#1a3a6e`
  - Vert météo : `#0a5c46`
  - Orange transport : `#f59e0b`
  - Gris neutre : `#374151`

- **Typographie** : Georgia/Crimson Text pour les titres, police système pour le contenu

- **Responsive** : Design adaptatif pour mobile et desktop

## 📝 Déploiement

### Netlify
1. Connectez votre repository GitHub
2. Configurez les commandes de build :
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel
1. Importez votre projet depuis GitHub
2. Vercel détectera automatiquement le framework (Vite + React)

### Autres plateformes
Le projet génère des fichiers statiques dans le dossier `dist/` compatibles avec toute plateforme d'hébergement statique.

## 🔧 Technologies

- **React 18** : Framework JavaScript
- **Vite** : Outil de build rapide
- **CSS-in-JS** : Styles directement dans les composants
- **LocalStorage** : Persistance des données côté client

## 📞 Contact

Pour toute question technique ou demande de modification :
- 📧 : contact@transports.gouv.td
- 🌐 : transports.gouv.td

---

*République du Tchad — Unité · Travail · Progrès* 🇹🇩
