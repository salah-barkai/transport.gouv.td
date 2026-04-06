# Guide de Migration vers Supabase - MTACMN

## 📋 Étapes Complétées

✅ **Schéma PostgreSQL converti** (`database/supabase-schema.sql`)  
✅ **Configuration Supabase créée** (`config-supabase.js`, `.env.supabase`)  
✅ **Client JavaScript Supabase** (`database-supabase.js`)  
✅ **Page de démonstration** (`index-supabase.html`)  

## 🚀 Étapes Suivantes à Manuellement

### 1. Créer votre projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte et connectez-vous
3. Cliquez sur **"New Project"**
4. Configurez :
   - **Nom du projet** : `mtacmn-transport`
   - **Région** : choisissez `eu-west-1` (Europe)
   - **Mot de passe base de données** : choisissez un mot de passe sécurisé

### 2. Configurer les clés

Une fois le projet créé, allez dans **Settings > API** et notez :
- **Project URL** : `https://xxxxxxxx.supabase.co`
- **Anon Public Key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Mettez à jour `config-supabase.js` avec vos vraies clés :

```javascript
const SUPABASE_CONFIG = {
    url: 'https://VOTRE-PROJET.supabase.co',
    anonKey: 'VOTRE_CLÉ_ANON_PUBLIQUE',
    serviceRoleKey: 'VOTRE_CLÉ_SERVICE_ROLE'
};
```

### 3. Créer les tables

#### Option A : Via l'interface Supabase (recommandé)

1. Allez dans **SQL Editor**
2. Copiez-collez le contenu de `database/supabase-schema.sql`
3. Cliquez sur **"Run"**

#### Option B : Via la ligne de commande

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref VOTRE-PROJET-ID

# Exécuter le schéma
supabase db push --schema database/supabase-schema.sql
```

### 4. Configurer le stockage (Storage)

1. Allez dans **Storage**
2. Créez un bucket nommé `images`
3. Configurez les politiques :
   - **Politique publique** : `SELECT` pour tout le monde
   - **Politique upload** : `INSERT` pour les utilisateurs authentifiés

### 5. Configurer l'authentification

1. Allez dans **Authentication > Settings**
2. Activez **Email/Password**
3. Configurez l'URL de redirection :
   - `http://localhost:8080/admin.html` (développement)
   - `https://votre-domaine.td/admin.html` (production)

### 6. Tester la connexion

Ouvrez `index-supabase.html` dans votre navigateur et vérifiez la console :

```javascript
// Devriez voir :
✅ Base de données Supabase initialisée avec succès
✅ 5 articles chargés
📊 Mode: Supabase
```

## 🔧 Configuration des Variables d'Environnement

### Développement

Créez un fichier `.env.local` :
```env
SUPABASE_URL=https://VOTRE-PROJET.supabase.co
SUPABASE_ANON_KEY=VOTRE_CLÉ_ANON
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLÉ_SERVICE
```

### Production

Configurez les variables dans votre hébergement :
```env
SUPABASE_URL=https://VOTRE-PROJET.supabase.co
SUPABASE_ANON_KEY=VOTRE_CLÉ_ANON_PRODUCTION
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLÉ_SERVICE_PRODUCTION
```

## 📊 Migration des Données Existantes

### Depuis MySQL vers Supabase

1. **Exportez vos données MySQL** :
```sql
-- Dans votre base MySQL
SELECT * FROM articles;
SELECT * FROM settings;
SELECT * FROM users;
```

2. **Importez dans Supabase** :
```javascript
// Script de migration
async function migrateData() {
    const { data, error } = await supabase
        .from('articles')
        .insert([
            // Vos données ici
        ]);
}
```

### Script de migration automatique

```javascript
// migration-script.js
const mysqlData = {
    articles: [
        // Vos articles existants
    ],
    settings: [
        // Vos paramètres existants  
    ]
};

async function migrateToSupabase() {
    try {
        // Migrer les articles
        for (const article of mysqlData.articles) {
            await supabase.from('articles').insert([{
                titre: article.titre,
                date: article.date,
                categorie: article.categorie,
                resume: article.resume,
                contenu: article.contenu,
                image: article.image,
                imageKey: article.imageKey,
                une: article.une,
                statut: article.statut,
                vues: article.vues
            }]);
        }
        
        console.log('✅ Migration terminée');
    } catch (error) {
        console.error('❌ Erreur de migration:', error);
    }
}
```

## 🔒 Sécurité et Bonnes Pratiques

### 1. Politiques RLS (Row Level Security)

Les politiques sont déjà configurées dans le schéma :
- Articles publiés : visibles par tout le monde
- Administration : réservée aux utilisateurs authentifiés

### 2. Clés API

- **Anon Key** : Utilisée dans le frontend JavaScript
- **Service Role Key** : Utilisée uniquement côté serveur (jamais dans le frontend)

### 3. Variables d'environnement

```javascript
// Jamais exposer la clé service role dans le frontend
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // ✅
// const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY); // ❌
```

## 🚀 Déploiement

### Option 1 : Hébergement Statique (Netlify, Vercel)

1. Uploadez les fichiers sur votre hébergeur
2. Configurez les variables d'environnement
3. Déployez

### Option 2 : Hébergement avec Backend

1. Gardez l'API PHP pour certaines fonctionnalités
2. Utilisez Supabase pour les données principales
3. Configurez CORS si nécessaire

## 📞 Support et Dépannage

### Problèmes Courants

1. **Erreur CORS** : Configurez les origines autorisées dans Supabase
2. **Erreur RLS** : Vérifiez les politiques de sécurité
3. **Timeout** : Augmentez le timeout dans la configuration

### Logs et Debuggage

```javascript
// Activer le mode debug
window.SUPABASE_CONFIG.debug = true;

// Vérifier la connexion
const { data, error } = await supabase
    .from('articles')
    .select('count')
    .single();

console.log('Test de connexion:', { data, error });
```

## 🎉 Prochaines Étapes

1. ✅ **Tester** la connexion avec `index-supabase.html`
2. ✅ **Migrer** vos données existantes
3. ✅ **Adapter** l'interface d'administration
4. ✅ **Configurer** le stockage des images
5. ✅ **Déployer** en production

---

**Note** : Ce guide suppose que vous avez déjà créé votre projet Supabase. Si vous rencontrez des problèmes, consultez la [documentation Supabase](https://supabase.com/docs).
