# Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale - Tchad

Site web officiel du MTACMN (Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale) de la République du Tchad.

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le front (Vite)
npm run dev

# Démarrer l'API PHP (dans un 2e terminal)
npm run api
```

### Construction pour la production
```bash
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
