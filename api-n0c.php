<?php
/* ============================================================
   API MTACMN - Version N0C Hébergement
   Ministère des Transports, Aviation Civile & Météorologie Nationale
   ============================================================ */

// Inclure la configuration
require_once 'config.php';

// Configuration de la base de données pour N0C
class Database {
    private $pdo;

    public function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
        } catch (PDOException $e) {
            if (DEBUG_MODE) {
                die('Erreur de connexion: ' . $e->getMessage());
            } else {
                die('Erreur de connexion à la base de données');
            }
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
}

// Gestion des paramètres
class SettingsManager {
    private $db;

    public function __construct($database) {
        $this->db = $database->getConnection();
    }

    // Créer la table des paramètres
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

// API principale
class MTACMNAPI {
    private function getPathSegments() {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '';
        $path = preg_replace('#/+#', '/', $path);
        $path = str_replace('/api-n0c.php', '', $path);
        $path = trim($path, '/');
        return $path === '' ? [] : explode('/', $path);
    }

    private $articleManager;
    private $settingsManager;

    public function __construct() {
        $database = new Database();
        $this->articleManager = new ArticleManager($database);
        $this->settingsManager = new SettingsManager($database);

        // Créer les tables si elles n'existent pas
        $this->articleManager->createTable();
        $this->settingsManager->createTable();
    }

    // Envoyer une réponse JSON
    private function sendResponse($data, $statusCode = 200) {
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
                $this->sendResponse(['success' => true, 'message' => 'API MTACMN N0C opérationnelle']);
                break;
            case 'articles':
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
                if (ctype_digit($resource)) {
                    $article = $this->articleManager->getArticleById($resource);
                    if (!$article || isset($article['error'])) {
                        $this->sendResponse(['error' => 'Article non trouvé'], 404);
                    }
                    $this->sendResponse($article);
                    break;
                }
                $this->sendResponse(['error' => 'Endpoint non trouvé'], 404);
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
