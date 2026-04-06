<?php
/* ============================================================
   Configuration MTACMN - Hébergement N0C
   ============================================================ */

// Base de données N0C
define('DB_HOST', 'localhost');
define('DB_NAME', 'transport_gov');
define('DB_USER', 'transport_gov');
define('DB_PASSWORD', 'Bouye66382404.'); // Remplacez par le vrai mot de passe
define('DB_CHARSET', 'utf8mb4');

// Configuration du site
define('SITE_URL', 'https://transport.gouv.td');
define('API_URL', 'https://transport.gouv.td/api.php');
define('ADMIN_URL', 'https://transport.gouv.td/admin.html');

// Sécurité
define('JWT_SECRET', 'votre_cle_secrete_jets_ici');
define('DEBUG_MODE', true);

// Upload et fichiers
define('UPLOAD_MAX_SIZE', 5242880); // 5MB
define('UPLOAD_PATH', 'uploads/');
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'pdf']);

// Email
define('SMTP_HOST', 'smtp.transport.gouv.td');
define('SMTP_PORT', 587);
define('SMTP_USER', 'contact@transport.gouv.td');
define('SMTP_PASSWORD', 'mot_de_passe_email');

// Logs
define('LOG_FILE', 'logs/mtacmn.log');
define('ERROR_LOG_FILE', 'logs/error.log');

// Cache
define('CACHE_ENABLED', true);
define('CACHE_DURATION', 3600); // 1 heure

?>
