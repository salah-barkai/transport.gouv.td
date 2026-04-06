-- ============================================================
-- Base de données MTACMN - MySQL
-- Ministère des Transports, Aviation Civile & Météorologie Nationale
-- ============================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS mtacmn_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE mtacmn_db;

-- ============================================================
-- Table des articles
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL COMMENT 'Titre de l\'article',
    date VARCHAR(50) NOT NULL COMMENT 'Date de publication',
    categorie ENUM('Transports', 'Aviation Civile', 'Météorologie') NOT NULL COMMENT 'Catégorie de l\'article',
    resume TEXT NOT NULL COMMENT 'Résumé de l\'article',
    contenu LONGTEXT COMMENT 'Contenu complet de l\'article',
    image VARCHAR(500) COMMENT 'URL de l\'image',
    imageKey VARCHAR(100) COMMENT 'Clé de l\'image pour référence',
    une BOOLEAN DEFAULT FALSE COMMENT 'Article à la une',
    statut ENUM('Brouillon', 'Publié') DEFAULT 'Brouillon' COMMENT 'Statut de publication',
    vues INT DEFAULT 0 COMMENT 'Nombre de vues',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de mise à jour',
    
    INDEX idx_categorie (categorie),
    INDEX idx_statut (statut),
    INDEX idx_une (une),
    INDEX idx_date (date),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Articles du ministère';

-- ============================================================
-- Table des paramètres du site
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY COMMENT 'Clé du paramètre',
    setting_value TEXT COMMENT 'Valeur du paramètre',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de mise à jour',
    
    INDEX idx_updatedAt (updatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Paramètres du site';

-- ============================================================
-- Table des utilisateurs
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Nom d\'utilisateur',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email de l\'utilisateur',
    password VARCHAR(255) NOT NULL COMMENT 'Mot de passe hashé',
    role ENUM('Admin', 'Super Admin', 'Editeur') DEFAULT 'Editeur' COMMENT 'Rôle de l\'utilisateur',
    actif BOOLEAN DEFAULT TRUE COMMENT 'Compte actif ou non',
    lastLogin TIMESTAMP NULL COMMENT 'Dernière connexion',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_actif (actif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Utilisateurs du système';

-- ============================================================
-- Insertion des données initiales
-- ============================================================

-- Insertion des paramètres par défaut
INSERT INTO settings (setting_key, setting_value) VALUES
('siteName', 'Ministère des Transports, de l\'Aviation Civile et de la Météorologie Nationale'),
('sigle', 'MTACMN'),
('ministre', 'Mme Fatimé Goukouni Weddeye'),
('secretaireGeneral', 'Dihoulné Laurent'),
('president', 'Maréchal Mahamat Idriss Déby Itno'),
('adresse', 'N\'Djaména, République du Tchad'),
('telephone', '+235 22 51 44 92'),
('email', 'contact@transports.gouv.td'),
('siteOfficiel', 'transports.gouv.td'),
('bp', 'BP 578')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_key);

-- Insertion de l'utilisateur administrateur par défaut
INSERT INTO users (username, email, password, role, actif) VALUES 
('admin', 'admin@transports.gouv.td', '$2y$10$abcdefghijklmnopqrstuvwxzA1B2C3D4E5F6G7H8I9JkLmNoPqRsTuVwXyZ', 'Super Admin', TRUE)
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- ============================================================
-- Insertion des articles initiaux
-- ============================================================

-- Note: Les dates sont au format français pour l'affichage
INSERT INTO articles (titre, date, categorie, resume, contenu, image, imageKey, une, statut, vues) VALUES 
('Audit OACI : La ministre évalue les préparatifs à l\'aéroport Hassan Djamous', '21 mars 2026', 'Aviation Civile', 'La ministre Fatimé Goukouni Weddeye a effectué une visite à l\'Aéroport international Hassan Djamous à quelques jours d\'un audit international de l\'OACI en matière de sûreté aérienne.', 'La ministre des Transports, de l\'Aviation civile et de la Météorologie nationale, Fatimé Goukouni Weddeye, a effectué ce samedi 21 mars une visite à l\'Aéroport international Hassan Djamous. Cette descente sur le terrain visait à galvaniser les équipes et à s\'assurer de la pleine préparation avant l\'audit OACI. La piste d\'atterrissage a bénéficié d\'une réhabilitation complète avec installation de nouveaux équipements de sécurité modernisés. Le ministère entend se conformer à toutes les normes internationales de l\'Organisation de l\'Aviation Civile Internationale.', 'image/article_1.jpg', 'article_1', TRUE, 'Publié', 1240),

('Semaine Nationale de la Météorologie 2026 : « Observer aujourd\'hui pour protéger demain »', '24 mars 2026', 'Météorologie', 'L\'ANAM a lancé officiellement la Semaine nationale de la météorologie (SENAMET) sous le thème « Observer aujourd\'hui et protéger demain », avec le soutien de partenaires internationaux.', 'Le ministère des Transports, à travers l\'Agence nationale de la météorologie (ANAM), a lancé officiellement la Semaine nationale de la météorologie (SENAMET). L\'objectif est de sensibiliser les populations et de mobiliser des ressources pour moderniser le réseau d\'observation météorologique. Les activités comprennent des panels et ateliers avec l\'appui du PAM, la Banque mondiale, le PNUD et l\'OMM.', 'image/article_2.jpg', 'article_2', FALSE, 'Publié', 876),

('Normes ASSA-AC : Atelier de vulgarisation de la réglementation aéronautique CEMAC', '16 février 2026', 'Aviation Civile', 'Atelier de vulgarisation des normes communautaires de l\'ASSA-AC au Centre CIFOP de Farcha pour renforcer la sécurité du transport aérien national.', 'Le Secrétaire général Dihoulne Laurent a présidé l\'atelier de vulgarisation de la réglementation communautaire de l\'Agence de Supervision de la Sécurité Aérienne en Afrique Centrale (ASSA-AC). Cet atelier vise à renforcer la compréhension et l\'application effective des normes aéronautiques communautaires de la zone CEMAC par les acteurs de l\'aviation civile tchadienne.', 'image/article_3.jpg', 'article_3', FALSE, 'Publié', 543),

('Transports : Évaluation stratégique du programme présidentiel — Chantier 8', '2 mars 2026', 'Transports', 'Le Premier ministre Allah Maye Halina a présidé une réunion d\'évaluation du volet transport du programme présidentiel, couvrant le désenclavement et la modernisation des infrastructures.', 'La réunion a évalué l\'état d\'avancement des projets prioritaires : modernisation des infrastructures routières et aéroportuaires, le projet de voie ferrée Tchad–Cameroun, le développement des ports secs à Moundou et Amdjarass, et le renforcement des partenariats avec les compagnies aériennes internationales.', 'image/article_4.jpg', 'article_4', FALSE, 'Publié', 412),

('Sécurité routière : Lancement du programme « Ambassadeurs routiers »', '15 janvier 2026', 'Transports', 'Le ministère lance le programme des ambassadeurs routiers pour la vulgarisation du code de la route et l\'amélioration de la sécurité sur les grands axes nationaux.', 'Dans le cadre du renforcement de la sécurité routière, le ministère a lancé le programme des « ambassadeurs routiers » pour vulgariser le code de la route et aménager des aires de repos sur les grands axes.', 'image/article_5.jpg', 'article_5', FALSE, 'Brouillon', 0);

-- ============================================================
-- Procédures et vues utiles
-- ============================================================

-- Vue pour les articles publiés uniquement
CREATE OR REPLACE VIEW v_articles_publies AS
SELECT 
    id, titre, date, categorie, resume, contenu, image, imageKey, une, vues, createdAt, updatedAt
FROM articles 
WHERE statut = 'Publié'
ORDER BY createdAt DESC;

-- Vue pour les statistiques des articles
CREATE OR REPLACE VIEW v_articles_stats AS
SELECT 
    categorie,
    COUNT(*) as total,
    SUM(vues) as total_vues,
    COUNT(CASE WHEN statut = 'Publié' THEN 1 END) as publies,
    COUNT(CASE WHEN statut = 'Brouillon' THEN 1 END) as brouillons
FROM articles 
GROUP BY categorie;

-- Procédure pour incrémenter les vues
DELIMITER //
CREATE PROCEDURE incrementer_vues(IN article_id INT)
BEGIN
    UPDATE articles 
    SET vues = vues + 1 
    WHERE id = article_id;
END //
DELIMITER ;

-- ============================================================
-- Index de performance
-- ============================================================

-- Index composite pour la recherche
CREATE FULLTEXT INDEX ft_articles_search ON articles(titre, resume, contenu);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_articles_recentes ON articles(statut, createdAt DESC);
CREATE INDEX idx_articles_categorie_statut ON articles(categorie, statut);
CREATE INDEX idx_articles_une_statut ON articles(une, statut);

-- ============================================================
-- Sécurité
-- ============================================================

-- Création d\'un utilisateur en lecture seule (pour les opérations de monitoring)
CREATE USER IF NOT EXISTS 'mtacmn_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON mtacmn_db.* TO 'mtacmn_readonly'@'localhost';
FLUSH PRIVILEGES;

-- Trigger pour journaliser les modifications
DELIMITER //
CREATE TRIGGER log_article_changes
AFTER INSERT ON articles
FOR EACH ROW
BEGIN
    INSERT INTO article_logs (article_id, action, ancienne_valeur, nouvelle_valeur, utilisateur, date_action)
    VALUES (NEW.id, 'INSERT', NULL, JSON_OBJECT(
        'titre', NEW.titre,
        'statut', NEW.statut,
        'categorie', NEW.categorie
    ), USER(), NOW());
END //
DELIMITER ;

-- Table pour les logs (optionnel)
CREATE TABLE IF NOT EXISTS article_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT,
    action ENUM('INSERT', 'UPDATE', 'DELETE'),
    ancienne_valeur JSON,
    nouvelle_valeur JSON,
    utilisateur VARCHAR(50),
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_article_id (article_id),
    INDEX idx_date_action (date_action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Journal des modifications d\'articles';

-- ============================================================
-- Notes d'installation
-- ============================================================

/* 
INSTRUCTIONS D'INSTALLATION :

1. Importer la base de données :
   mysql -u root -p < database.sql

2. Configurer l'API PHP :
   - Modifier les paramètres de connexion dans api.php
   - Assurer que les extensions PHP suivantes sont activées :
     * pdo_mysql
     * json
     * mbstring

3. Permissions :
   - Donner les droits appropriés à l'utilisateur MySQL
   - Configurer les permissions des fichiers si nécessaire

4. Sécurité :
   - Changer le mot de passe par défaut
   - Utiliser des mots de passe forts
   - Configurer HTTPS en production
   - Limiter les accès par IP si nécessaire

5. Performance :
   - Activer le cache query MySQL
   - Surveiller les requêtes lentes
   - Utiliser les index fournis

STRUCTURE OPTIMISÉE POUR :
- Performance élevée avec les index
- Recherche全文 (full-text) disponible
- Vues SQL pour les requêtes communes
- Procédures stockées pour les opérations répétitives
- Journalisation des modifications
- Sécurité intégrée
*/
