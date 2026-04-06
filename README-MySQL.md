# 🗄️ Base de données MySQL pour MTACMN

## 📋 Architecture

Le système utilise maintenant **MySQL** comme base de données principale, remplaçant IndexedDB/localStorage pour une solution plus robuste et professionnelle.

### 🏗️ Structure du projet

```
site transport/
├── api.php              # API REST PHP (backend)
├── api-client.js         # Client JavaScript pour communiquer avec l'API
├── database.sql          # Structure SQL de la base de données
├── start.html            # Site public (utilise api-client.js)
├── admin.html             # Dashboard admin (utilise api-client.js)
├── database.js            # Fallback localStorage (conservé)
├── image/                # Images du site
└── src/                  # Fichiers source React
```

## 🚀 Installation

### 1. Configuration de MySQL

```bash
# Importer la base de données
mysql -u root -p < database.sql

# Créer un utilisateur dédié (recommandé)
mysql -u root -p
CREATE USER 'mtacmn_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON mtacmn_db.* TO 'mtacmn_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configuration de PHP

Assurez-vous d'avoir les extensions PHP suivantes :
- `pdo_mysql`
- `json`
- `mbstring`

### 3. Configuration de l'API

Créez un fichier `.env` à partir de `.env.example`, puis adaptez :
```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=mtacmn_db
DB_USER=mtacmn_user
DB_PASSWORD=votre_mot_de_passe
```

## 📊 Tables créées

### `articles`
| Champ | Type | Description |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID unique |
| titre | VARCHAR(255) | Titre de l'article |
| date | VARCHAR(50) | Date de publication |
| categorie | ENUM | Transports/Aviation Civile/Météorologie |
| resume | TEXT | Résumé |
| contenu | LONGTEXT | Contenu complet |
| image | VARCHAR(500) | URL de l'image |
| une | BOOLEAN | Article à la une |
| statut | ENUM | Brouillon/Publié |
| vues | INT | Nombre de vues |
| createdAt | TIMESTAMP | Date de création |
| updatedAt | TIMESTAMP | Dernière mise à jour |

### `settings`
| Champ | Type | Description |
|-------|------|-------------|
| setting_key | VARCHAR(100) | Clé du paramètre |
| setting_value | TEXT | Valeur du paramètre |
| updatedAt | TIMESTAMP | Dernière mise à jour |

### `users`
| Champ | Type | Description |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID unique |
| username | VARCHAR(50) | Nom d'utilisateur |
| email | VARCHAR(100) | Email |
| password | VARCHAR(255) | Mot de passe hashé |
| role | ENUM | Admin/Super Admin/Editeur |
| actif | BOOLEAN | Compte actif |
| lastLogin | TIMESTAMP | Dernière connexion |
| createdAt | TIMESTAMP | Date de création |

## 🔌 API Endpoints

### Articles
- `GET /api.php/articles` - Récupérer tous les articles
- `GET /api.php/articles/{id}` - Récupérer un article
- `POST /api.php/articles` - Créer un article
- `PUT /api.php/articles/{id}` - Mettre à jour un article
- `DELETE /api.php/articles/{id}` - Supprimer un article
- `GET /api.php/articles/stats` - Statistiques des articles

### Paramètres
- `GET /api.php/settings` - Récupérer tous les paramètres
- `PUT /api.php/settings` - Mettre à jour un paramètre

### Authentification
- `POST /api.php/auth` - Connexion utilisateur

## 🔄 Synchronisation

Le système inclut une **synchronisation automatique** toutes les 30 secondes :

1. Le dashboard et le site public communiquent avec l'API MySQL
2. Les changements sont propagés en temps réel
3. Fallback vers localStorage si MySQL est indisponible
4. Support de l'export/import des données

## 🛡️ Sécurité

### Mot de passe
- Utilisez des mots de passe forts
- Hashage avec `password_hash()` en production
- Protection contre les injections SQL avec PDO

### CORS
- Configuration CORS pour les requêtes cross-origin
- Headers de sécurité appropriés

### Validation
- Validation des entrées côté serveur
- Échappement des données sensibles
- Types de données stricts

## 📈 Performance

### Index
- Index sur les colonnes fréquemment interrogées
- Index composite pour les recherches
- Index全文 (full-text) pour la recherche dans les articles

### Vues SQL
- `v_articles_publies` - Articles publiés uniquement
- `v_articles_stats` - Statistiques par catégorie

### Cache
- Activer le cache query MySQL
- Utiliser des en-têtes de cache appropriés
- Optimiser les requêtes fréquentes

## 🚀 Utilisation

### Démarrage rapide

1. **Importer la base de données** :
   ```bash
   mysql -u root -p < database.sql
   ```

2. **Démarrer le serveur PHP** :
   ```bash
   npm run api
   ```

3. **Ouvrir les sites** :
   - Dashboard : `http://127.0.0.1:8000/admin.html`
   - Site public : `http://127.0.0.1:8000/start.html`

### Monitoring

```php
// Activer les logs MySQL
error_log(/var/log/mysql/error.log);

// Surveiller les requêtes lentes
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

## 🔄 Migration depuis localStorage

Pour migrer les données existantes :

1. **Exporter** via le dashboard (bouton Export)
2. **Importer** via le dashboard (fichier JSON)
3. Les données sont automatiquement synchronisées avec MySQL

## 📝 Personnalisation

### Ajouter des champs

1. Modifier `database.sql` pour ajouter des colonnes
2. Mettre à jour `api.php` pour gérer les nouveaux champs
3. Adapter `api-client.js` pour les utiliser

### Ajouter des endpoints

1. Ajouter la méthode dans `MTACMNAPIClient`
2. Ajouter le case dans `handleRequest()`
3. Ajouter la route dans `APIRouter`

## 🔧 Dépannage

### Problèmes courants

**Connexion refusée** :
- Vérifiez les identifiants MySQL
- Vérifiez que le serveur PHP fonctionne

**Erreur 500** :
- Vérifiez les logs d'erreur PHP
- Vérifiez la connexion à la base de données

**CORS** :
- Vérifiez la configuration dans `api.php`
- Utilisez un plugin CORS pour le développement

### Outils utiles

```bash
# Vérifier la structure de la base de données
mysql -u root -p -e "DESCRIBE mtacmn_db.articles;"

# Vérifier les logs MySQL
tail -f /var/log/mysql/error.log

# Tester l'API
curl -X GET http://localhost/api.php/articles
curl -X POST http://localhost/api.php/auth -H "Content-Type: application/json" -d '{"username":"admin","password":"admin2026"}'
```

## 📞 Support

Pour toute question sur l'installation ou l'utilisation :

1. Vérifiez les logs d'erreurs
2. Consultez la documentation de l'API
3. Testez les endpoints individuellement

---

**Avantages de MySQL vs localStorage :**
- ✅ **Performance** : Requêtes optimisées avec index
- ✅ **Scalabilité** : Supporte plusieurs utilisateurs simultanés
- ✅ **Persistance** : Données permanentes et fiables
- ✅ **Sécurité** : Gestion fine des permissions
- ✅ **Backups** : Sauvegardes professionnelles possibles
- ✅ **Intégration** : Compatible avec d'autres systèmes

**Migration simple :** Le système inclut un fallback automatique vers localStorage si MySQL n'est pas disponible.
