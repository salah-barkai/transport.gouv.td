<?php
/* ============================================================
   API MTACMN - MySQL Backend
   Ministère des Transports, Aviation Civile & Météorologie Nationale
   ============================================================
   API REST pour la gestion des articles et paramètres du site
   Base de données MySQL avec connexion sécurisée
   ============================================================ */

// Charger la configuration
require_once 'config.php';

// Configuration de la base de données
class Database {
    private $host;
    private $dbname;
    private $username;
    private $password;
    private $charset;
    private $pdo;

    public function __construct() {
        $this->host = DB_HOST;
        $this->dbname = DB_NAME;
        $this->username = DB_USER;
        $this->password = DB_PASSWORD;
        $this->charset = DB_CHARSET;
        $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            die('Erreur de connexion à la base de données: ' . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->pdo;
    }
}

// Gestion des articles
class ArticleManager {
    private $db;

    public function __construct($database) {
        $this->db = $database->getConnection();
    }

    // Créer la table des articles si elle n'existe pas
    public function createTable() {
        $sql = "
            CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titre VARCHAR(255) NOT NULL,
                date VARCHAR(50) NOT NULL,
                categorie ENUM('Transports', 'Aviation Civile', 'Météorologie') NOT NULL,
                resume TEXT NOT NULL,
                contenu LONGTEXT,
                image VARCHAR(500),
                imageKey VARCHAR(100),
                une BOOLEAN DEFAULT FALSE,
                statut ENUM('Brouillon', 'Publié') DEFAULT 'Brouillon',
                vues INT DEFAULT 0,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_categorie (categorie),
                INDEX idx_statut (statut),
                INDEX idx_une (une),
                INDEX idx_date (date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        try {
            $this->db->exec($sql);
            return ['success' => true, 'message' => 'Table articles créée avec succès'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    // Récupérer tous les articles
    public function getAllArticles($statut = null, $categorie = null, $limit = 50, $offset = 0) {
        $sql = "SELECT * FROM articles WHERE 1=1";
        $params = [];

        if ($statut) {
            $sql .= " AND statut = :statut";
            $params[':statut'] = $statut;
        }

        if ($categorie) {
            $sql .= " AND categorie = :categorie";
            $params[':categorie'] = $categorie;
        }

        $sql .= " ORDER BY createdAt DESC LIMIT :limit OFFSET :offset";
        $limit = max(1, min((int)$limit, 200));
        $offset = max(0, (int)$offset);

        try {
            $stmt = $this->db->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    // Récupérer un article par ID
    public function getArticleById($id) {
        $sql = "SELECT * FROM articles WHERE id = :id";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    // Créer un article
    public function createArticle($data) {
        $sql = "
            INSERT INTO articles (titre, date, categorie, resume, contenu, image, imageKey, une, statut, vues)
            VALUES (:titre, :date, :categorie, :resume, :contenu, :image, :imageKey, :une, :statut, :vues)
        ";
        
        $params = [
            ':titre' => $data['titre'],
            ':date' => $data['date'] ?? date('d F Y'),
            ':categorie' => $data['categorie'],
            ':resume' => $data['resume'],
            ':contenu' => $data['contenu'],
            ':image' => $data['image'],
            ':imageKey' => $data['imageKey'] ?? '',
            ':une' => $data['une'] ?? false,
            ':statut' => $data['statut'] ?? 'Brouillon',
            ':vues' => $data['vues'] ?? 0
        ];

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return [
                'success' => true,
                'id' => $this->db->lastInsertId(),
                'message' => 'Article créé avec succès'
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    // Mettre à jour un article
    public function updateArticle($id, $data) {
        $current = $this->getArticleById($id);
        if (!$current || isset($current['error'])) {
            return ['success' => false, 'message' => 'Article non trouvé'];
        }

        $merged = array_merge($current, $data);
        $sql = "
            UPDATE articles SET
                titre = :titre,
                date = :date,
                categorie = :categorie,
                resume = :resume,
                contenu = :contenu,
                image = :image,
                imageKey = :imageKey,
                une = :une,
                statut = :statut,
                updatedAt = CURRENT_TIMESTAMP
            WHERE id = :id
        ";
        
        $params = [
            ':id' => $id,
            ':titre' => $merged['titre'],
            ':date' => $merged['date'],
            ':categorie' => $merged['categorie'],
            ':resume' => $merged['resume'],
            ':contenu' => $merged['contenu'],
            ':image' => $merged['image'] ?? '',
            ':imageKey' => $merged['imageKey'] ?? '',
            ':une' => $merged['une'] ?? false,
            ':statut' => $merged['statut']
        ];

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return ['success' => true, 'message' => 'Article mis à jour avec succès'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    // Supprimer un article
    public function deleteArticle($id) {
        $sql = "DELETE FROM articles WHERE id = :id";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);
            return ['success' => true, 'message' => 'Article supprimé avec succès'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    // Compter les articles par statut
    public function countArticlesByStatus() {
        $sql = "
            SELECT 
                statut,
                COUNT(*) as count
            FROM articles
            GROUP BY statut
        ";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();
            
            $counts = [];
            foreach ($results as $row) {
                $counts[$row['statut']] = (int)$row['count'];
            }
            
            return $counts;
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }
}

// Gestion des paramètres
class SettingsManager {
    private $db;

    public function __construct($database) {
        $this->db = $database->getConnection();
    }

    // Créer la table des paramètres si elle n'existe pas
    public function createTable() {
        $sql = "
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value TEXT,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        try {
            $this->db->exec($sql);
            return ['success' => true, 'message' => 'Table settings créée avec succès'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    // Récupérer tous les paramètres
    public function getAllSettings() {
        $sql = "SELECT * FROM settings";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();
            
            $settings = [];
            foreach ($results as $row) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
            
            return $settings;
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    // Mettre à jour un paramètre
    public function updateSetting($key, $value) {
        $sql = "
            INSERT INTO settings (setting_key, setting_value)
            VALUES (:key, :value)
            ON DUPLICATE KEY UPDATE setting_value = :value, updatedAt = CURRENT_TIMESTAMP
        ";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':key' => $key, ':value' => $value]);
            return ['success' => true, 'message' => 'Paramètre mis à jour avec succès'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }
}

// Gestion des utilisateurs
class UserManager {
    private $db;

    public function __construct($database) {
        $this->db = $database->getConnection();
    }

    // Créer la table des utilisateurs si elle n'existe pas
    public function createTable() {
        $sql = "
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('Admin', 'Super Admin', 'Editeur') DEFAULT 'Editeur',
                actif BOOLEAN DEFAULT TRUE,
                lastLogin TIMESTAMP NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ";
        
        try {
            $this->db->exec($sql);
            return ['success' => true, 'message' => 'Table users créée avec succès'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    // Authentifier un utilisateur
    public function authenticate($username, $password) {
        $sql = "SELECT id, username, email, role, actif, password FROM users WHERE username = :username AND actif = TRUE";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':username' => $username]);
            $user = $stmt->fetch();
            
            if ($user) {
                $isValid = password_verify($password, $user['password']) || hash_equals((string)$user['password'], (string)$password);
                if (!$isValid) {
                    return ['success' => false, 'message' => 'Identifiants incorrects'];
                }

                unset($user['password']);
                // Mettre à jour la dernière connexion
                $this->updateLastLogin($user['id']);
                return ['success' => true, 'user' => $user];
            } else {
                return ['success' => false, 'message' => 'Identifiants incorrects'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    // Mettre à jour la dernière connexion
    private function updateLastLogin($userId) {
        $sql = "UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = :id";
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $userId]);
        } catch (PDOException $e) {
            // Erreur silencieuse pour la mise à jour du login
        }
    }
}

// Initialisation et configuration
class MTACMNAPI {
    private function getPathSegments() {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '';
        $path = preg_replace('#/+#', '/', $path);
        $path = str_replace('/api.php', '', $path);
        $path = trim($path, '/');
        return $path === '' ? [] : explode('/', $path);
    }

    private $articleManager;
    private $settingsManager;
    private $userManager;

    public function __construct() {
        $database = new Database();
        $this->articleManager = new ArticleManager($database);
        $this->settingsManager = new SettingsManager($database);
        $this->userManager = new UserManager($database);

        // Créer les tables si elles n'existent pas
        $this->articleManager->createTable();
        $this->settingsManager->createTable();
        $this->userManager->createTable();
    }

    // Envoyer une réponse JSON
    private function sendResponse($data, $statusCode = 200) {
        header_remove('X-Powered-By');
        header_remove('Server');
        header('Content-Type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Gérer les requêtes CORS
    private function handleCORS() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            header('Access-Control-Max-Age: 3600');
            http_response_code(200);
            exit;
        }
    }

    // Router principal
    public function handleRequest() {
        $this->handleCORS();

        $method = $_SERVER['REQUEST_METHOD'];
        $segments = $this->getPathSegments();

        try {
            switch ($method) {
                case 'GET':
                    $this->handleGet($segments);
                    break;
                case 'POST':
                    $this->handlePost($segments);
                    break;
                case 'PUT':
                    $this->handlePut($segments);
                    break;
                case 'DELETE':
                    $this->handleDelete($segments);
                    break;
                default:
                    $this->sendResponse(['error' => 'Méthode non autorisée'], 405);
            }
        } catch (Exception $e) {
            $this->sendResponse(['error' => $e->getMessage()], 500);
        }
    }

    // Gérer les requêtes GET
    private function handleGet($segments) {
        $resource = $segments[0] ?? '';
        $id = $segments[1] ?? null;

        switch ($resource) {
            case '':
                $this->sendResponse(['success' => true, 'message' => 'API MTACMN opérationnelle']);
                break;
            case 'articles':
                if (($segments[1] ?? null) === 'stats') {
                    $stats = $this->articleManager->countArticlesByStatus();
                    $this->sendResponse($stats);
                    break;
                }

                if ($id !== null) {
                    if (!ctype_digit((string)$id)) {
                        $this->sendResponse(['error' => 'ID invalide'], 400);
                    }
                    $article = $this->articleManager->getArticleById($id);
                    if (!$article || isset($article['error'])) {
                        $this->sendResponse(['error' => 'Article non trouvé'], 404);
                    }
                    $this->sendResponse($article);
                    break;
                }

                $statut = $_GET['statut'] ?? null;
                $categorie = $_GET['categorie'] ?? null;
                $limit = (int)($_GET['limit'] ?? 50);
                $offset = (int)($_GET['offset'] ?? 0);
                $articles = $this->articleManager->getAllArticles($statut, $categorie, $limit, $offset);
                $this->sendResponse($articles);
                break;
            case 'settings':
                $settings = $this->settingsManager->getAllSettings();
                $this->sendResponse($settings);
                break;

            default:
                // Compatibilité legacy: /api.php/{id}
                if (ctype_digit($resource)) {
                    $article = $this->articleManager->getArticleById($resource);
                    if (isset($article['error'])) {
                        $this->sendResponse(['error' => 'Article non trouvé'], 404);
                    } else {
                        $this->sendResponse($article);
                    }
                } else {
                    $this->sendResponse(['error' => 'Endpoint non trouvé'], 404);
                }
        }
    }

    // Gérer les requêtes POST
    private function handlePost($segments) {
        $resource = $segments[0] ?? '';

        switch ($resource) {
            case 'articles':
                $data = json_decode(file_get_contents('php://input'), true);
                if ($data) {
                    $result = $this->articleManager->createArticle($data);
                    $this->sendResponse($result, $result['success'] ? 201 : 400);
                } else {
                    $this->sendResponse(['error' => 'Données invalides'], 400);
                }
                break;

            case 'auth':
                $data = json_decode(file_get_contents('php://input'), true);
                if ($data && isset($data['username']) && isset($data['password'])) {
                    $result = $this->userManager->authenticate($data['username'], $data['password']);
                    $this->sendResponse($result, $result['success'] ? 200 : 401);
                } else {
                    $this->sendResponse(['error' => 'Identifiants manquants'], 400);
                }
                break;

            default:
                $this->sendResponse(['error' => 'Endpoint non trouvé'], 404);
        }
    }

    // Gérer les requêtes PUT
    private function handlePut($segments) {
        $resource = $segments[0] ?? '';
        $id = $segments[1] ?? null;

        switch ($resource) {
            case 'settings':
                $data = json_decode(file_get_contents('php://input'), true);
                if ($data && isset($data['key']) && isset($data['value'])) {
                    $result = $this->settingsManager->updateSetting($data['key'], $data['value']);
                    $this->sendResponse($result, $result['success'] ? 200 : 400);
                } else {
                    $this->sendResponse(['error' => 'Données invalides'], 400);
                }
                break;

            default:
                if ($resource === 'articles' && ctype_digit((string)$id)) {
                    $data = json_decode(file_get_contents('php://input'), true);
                    if ($data) {
                        $result = $this->articleManager->updateArticle($id, $data);
                        $this->sendResponse($result, $result['success'] ? 200 : 400);
                    } else {
                        $this->sendResponse(['error' => 'Données invalides'], 400);
                    }
                } elseif (ctype_digit($resource)) {
                    // Compatibilité legacy: /api.php/{id}
                    $data = json_decode(file_get_contents('php://input'), true);
                    if ($data) {
                        $result = $this->articleManager->updateArticle($resource, $data);
                        $this->sendResponse($result, $result['success'] ? 200 : 400);
                    } else {
                        $this->sendResponse(['error' => 'Données invalides'], 400);
                    }
                } else {
                    $this->sendResponse(['error' => 'Endpoint non trouvé'], 404);
                }
        }
    }

    // Gérer les requêtes DELETE
    private function handleDelete($segments) {
        $resource = $segments[0] ?? '';
        $id = $segments[1] ?? null;

        if ($resource === 'articles' && ctype_digit((string)$id)) {
            $result = $this->articleManager->deleteArticle($id);
            $this->sendResponse($result, $result['success'] ? 200 : 404);
            return;
        }

        // Compatibilité legacy: /api.php/{id}
        if (ctype_digit($resource)) {
            $result = $this->articleManager->deleteArticle($resource);
            $this->sendResponse($result, $result['success'] ? 200 : 404);
            return;
        }

        $this->sendResponse(['error' => 'Endpoint non trouvé'], 404);
    }
}

// Point d'entrée principal
$api = new MTACMNAPI();
$api->handleRequest();
?>
