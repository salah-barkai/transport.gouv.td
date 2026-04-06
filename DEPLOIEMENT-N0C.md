# 🚀 Déploiement MTACMN sur Hébergement N0C

## 📋 Prérequis

### N0C Hébergement
- ✅ Hébergement Mutualisé N0C (PHP 8.2+)
- ✅ Base de données MySQL (minimum 1 Go)
- ✅ Accès FTP/SFTP
- ✅ Accès cPanel/Plesk
- ✅ Nom de domaine (ex: mtacmn.gouv.td)

### Logiciels nécessaires
- ✅ Client FTP (FileZilla, WinSCP)
- ✅ Éditeur de texte (VS Code)
- ✅ Navigateur web

---

## 🗂️ Structure des fichiers à uploader

```
📁 mtacmn/
├── 📄 config.php                 (Configuration)
├── 📄 api-n0c.php                (API REST)
├── 📄 start.html                 (Site public)
├── 📄 admin.html                 (Dashboard admin)
├── 📄 api-client.js              (Client JavaScript)
├── 📄 .htaccess                  (Configuration Apache)
├── 📁 image/                     (Images du site)
│   ├── 🖼️ logo.jpg
│   ├── 🖼️ Ministre de transport.jpg
│   └── 🖼️ image pour acceuil.jpg
├── 📁 uploads/                   (Dossier uploads)
├── 📁 logs/                      (Logs du site)
└── 📁 database/                  (Scripts SQL)
    └── 📄 database.sql
```

---

## 🔧 Étape 1 : Configuration de la base de données

### 1.1 Créer la base de données N0C
1. Connectez-vous à cPanel/Plesk
2. Allez dans "Base de données MySQL"
3. Créez une nouvelle base de données :
   - **Nom** : `mtacmn_db`
   - **Utilisateur** : `mtacmn_user`
   - **Mot de passe** : `votre_mot_de_passe_secure`

### 1.2 Importer la structure
1. Allez dans "phpMyAdmin"
2. Sélectionnez la base de données `mtacmn_db`
3. Cliquez sur "Importer"
4. Choisissez le fichier `database.sql`
5. Cliquez sur "Exécuter"

---

## 🔧 Étape 2 : Configuration du fichier config.php

### 2.1 Éditez config.php
```php
<?php
// Base de données N0C
define('DB_HOST', 'localhost'); // ou l'adresse fournie par N0C
define('DB_NAME', 'mtacmn_db'); // nom de votre BDD
define('DB_USER', 'mtacmn_user'); // utilisateur BDD
define('DB_PASSWORD', 'votre_mot_de_passe'); // mot de passe BDD

// Configuration du site
define('SITE_URL', 'https://mtacmn.gouv.td'); // votre domaine
define('API_URL', 'https://mtacmn.gouv.td/api-n0c.php');
define('ADMIN_URL', 'https://mtacmn.gouv.td/admin.html');

// Sécurité
define('JWT_SECRET', 'votre_cle_secrete_ici'); // changez cette valeur
define('DEBUG_MODE', false); // mettre false en production
?>
```

---

## 🔧 Étape 3 : Upload des fichiers

### 3.1 Connexion FTP
1. Ouvrez FileZilla
2. Hôte : `ftp.votre-domaine.td`
3. Utilisateur : `votre_utilisateur_ftp`
4. Mot de passe : `votre_mot_de_passe_ftp`
5. Port : `21`

### 3.2 Upload des fichiers
1. Allez dans le dossier `public_html` ou `www`
2. Créez un dossier `mtacmn`
3. Uploadez tous les fichiers du dossier local

### 3.3 Permissions des dossiers
```bash
# Via FTP ou cPanel
chmod 755 mtacmn/
chmod 755 mtacmn/image/
chmod 755 mtacmn/uploads/
chmod 755 mtacmn/logs/
chmod 644 mtacmn/*.php
chmod 644 mtacmn/*.html
chmod 644 mtacmn/*.js
```

---

## 🔧 Étape 4 : Configuration Apache

### 4.1 Vérifier .htaccess
Le fichier `.htaccess` doit être à la racine du dossier `mtacmn`

### 4.2 Version PHP
1. Dans cPanel, allez dans "Sélecteur de version PHP"
2. Choisissez **PHP 8.2** ou supérieur
3. Activez les extensions :
   - ✅ `pdo_mysql`
   - ✅ `json`
   - ✅ `mbstring`
   - ✅ `curl`
   - ✅ `gd`

---

## 🔧 Étape 5 : Test de l'installation

### 5.1 Test de l'API
Ouvrez votre navigateur :
```
https://mtacmn.gouv.td/api-n0c.php/articles
```

Vous devriez voir :
```json
[]
```

### 5.2 Test du site public
```
https://mtacmn.gouv.td/start.html
```

### 5.3 Test du dashboard
```
https://mtacmn.gouv.td/admin.html
```

---

## 🔧 Étape 6 : Configuration finale

### 6.1 SSL/TLS
1. Dans cPanel, allez dans "SSL/TLS"
2. Activez "SSL/TLS gratuit"
3. Forcer HTTPS via .htaccess (déjà configuré)

### 6.2 Créer le premier utilisateur
1. Allez dans phpMyAdmin
2. Exécutez cette requête SQL :
```sql
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@mtacmn.gouv.td', '$2y$10$abcdefghijklmnopqrstuvwxz', 'Super Admin');
```

### 6.3 Insérer les données initiales
```sql
INSERT INTO settings (setting_key, setting_value) VALUES
('siteName', 'Ministère des Transports, de l\'Aviation Civile et de la Météorologie Nationale'),
('sigle', 'MTACMN'),
('ministre', 'Mme Fatimé Goukouni Weddeye'),
('secretaireGeneral', 'Dihoulné Laurent'),
('president', 'Maréchal Mahamat Idriss Déby Itno'),
('adresse', 'N\'Djaména, République du Tchad'),
('telephone', '+235 22 51 44 92'),
('email', 'contact@mtacmn.gouv.td'),
('siteOfficiel', 'mtacmn.gouv.td'),
('bp', 'BP 578');
```

---

## 🚀 Accès final

### 🌐 URLs de production
- **Site public** : `https://mtacmn.gouv.td`
- **Dashboard admin** : `https://mtacmn.gouv.td/admin.html`
- **API REST** : `https://mtacmn.gouv.td/api-n0c.php`

### 🔐 Connexion admin
- **Identifiant** : `admin`
- **Mot de passe** : `admin2026`

---

## 🔧 Maintenance

### Sauvegarde automatique
```bash
# Via cPanel
1. Allez dans "Sauvegardes"
2. Configurez une sauvegarde quotidienne
3. Inclure la base de données et les fichiers
```

### Monitoring
- Vérifiez les logs dans `logs/mtacmn.log`
- Surveillez l'espace disque
- Vérifiez les performances de la base de données

### Mises à jour
1. Testez les mises à jour en local
2. Uploadez les fichiers modifiés
3. Vérifiez le fonctionnement

---

## 🆘 Support

### Problèmes courants
- **Erreur 500** : Vérifiez les logs d'erreur
- **Base de données** : Vérifiez les identifiants dans config.php
- **Permissions** : Vérifiez les droits des dossiers

### Contact support N0C
- Email : support@n0c.com
- Téléphone : +235 XX XX XX XX
- Documentation : https://help.n0c.com

---

## 📊 Performance

### Optimisation recommandée
- ✅ Activer le cache PHP (OPcache)
- ✅ Utiliser CDN pour les images
- ✅ Compresser les fichiers CSS/JS
- ✅ Optimiser les images

### Monitoring
- Utilisez Google Analytics
- Surveillez les temps de chargement
- Vérifiez l'expérience utilisateur

---

**🎯 Votre site MTACMN est maintenant hébergé sur N0C et prêt pour la production !**
