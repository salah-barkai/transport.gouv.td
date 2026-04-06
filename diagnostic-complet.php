<?php
// Script de diagnostic complet pour identifier pourquoi les articles ne se publient pas
require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🔍 Diagnostic COMPLET - Pourquoi les articles ne se publient pas</h1>";

// 1. Vérifier la connexion MySQL
echo "<h2>🗄️ Connexion MySQL</h2>";
try {
    $version = $db->getAttribute(PDO::ATTR_SERVER_VERSION);
    echo "<div class='status success'>✅ Connecté à MySQL version: $version</div>";
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur connexion MySQL: " . $e->getMessage() . "</div>";
    die();
}

// 2. Vérifier si la base de données existe
echo "<h2>📊 Base de données</h2>";
try {
    $sql = "SHOW DATABASES LIKE 'mtacmn_db'";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $dbs = $stmt->fetchAll();
    
    if (!empty($dbs)) {
        echo "<div class='status success'>✅ Base de données 'mtacmn_db' existe</div>";
    } else {
        echo "<div class='status error'>❌ Base de données 'mtacmn_db' n'existe pas!</div>";
        echo "<div class='status info'>🔧 Création de la base de données...</div>";
        
        try {
            $db->exec("CREATE DATABASE mtacmn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "<div class='status success'>✅ Base de données créée</div>";
        } catch (Exception $e) {
            echo "<div class='status error'>❌ Erreur création BDD: " . $e->getMessage() . "</div>";
        }
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur vérification BDD: " . $e->getMessage() . "</div>";
}

// 3. Vérifier la table articles
echo "<h2>📋 Table articles</h2>";
try {
    $sql = "SHOW TABLES LIKE 'articles'";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $tables = $stmt->fetchAll();
    
    if (!empty($tables)) {
        echo "<div class='status success'>✅ Table 'articles' existe</div>";
        
        // Vérifier la structure
        $sql = "DESCRIBE articles";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $structure = $stmt->fetchAll();
        
        echo "<div style='background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;'>";
        echo "<h4>Structure de la table:</h4>";
        foreach ($structure as $column) {
            $color = in_array($column['Field'], ['categorie', 'image', 'statut']) ? 'orange' : 'inherit';
            echo "<div style='color: $color;'><strong>{$column['Field']}</strong>: {$column['Type']} (Null: {$column['Null']})</div>";
        }
        echo "</div>";
        
    } else {
        echo "<div class='status error'>❌ Table 'articles' n'existe pas!</div>";
        echo "<div class='status info'>🔧 Création de la table...</div>";
        
        $articleManager = new ArticleManager($db);
        $result = $articleManager->createTable();
        
        if ($result['success']) {
            echo "<div class='status success'>✅ Table créée avec succès</div>";
        } else {
            echo "<div class='status error'>❌ Erreur création table: {$result['message']}</div>";
        }
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur vérification table: " . $e->getMessage() . "</div>";
}

// 4. Vérifier les articles existants
echo "<h2>📰 Articles existants</h2>";
try {
    $sql = "SELECT COUNT(*) as total FROM articles";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $total = $stmt->fetch();
    
    echo "<div class='status info'>📊 Total articles: {$total['total']}</div>";
    
    if ($total['total'] > 0) {
        // Vérifier les articles par statut
        $sql = "SELECT statut, COUNT(*) as count FROM articles GROUP BY statut";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $stats = $stmt->fetchAll();
        
        echo "<h4>Répartition par statut:</h4>";
        foreach ($stats as $stat) {
            $color = $stat['statut'] === 'Publié' ? 'green' : 'orange';
            $icon = $stat['statut'] === 'Publié' ? '✅' : '📝';
            echo "<div style='color: $color;'>$icon {$stat['statut']}: {$stat['count']}</div>";
        }
        
        // Afficher les 3 derniers articles
        $sql = "SELECT * FROM articles ORDER BY createdAt DESC LIMIT 3";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $recent = $stmt->fetchAll();
        
        echo "<h4>3 derniers articles:</h4>";
        foreach ($recent as $article) {
            $statutColor = $article['statut'] === 'Publié' ? 'green' : 'orange';
            echo "<div class='article' style='margin: 10px 0; padding: 15px; border-left: 4px solid #007bff;'>";
            echo "<div><strong>ID {$article['id']}: {$article['titre']}</strong></div>";
            echo "<div style='font-size: 12px; color: #666;'>Catégorie: {$article['categorie']} | Statut: <span style='color: $statutColor;'>{$article['statut']}</span></div>";
            echo "<div style='font-size: 11px; color: #999;'>Créé le: {$article['createdAt']}</div>";
            echo "</div>";
        }
        
    } else {
        echo "<div class='status warning'>⚠️ Aucun article dans la base de données!</div>";
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur lecture articles: " . $e->getMessage() . "</div>";
}

// 5. Test d'insertion direct
echo "<h2>🧪 Test d'insertion DIRECT</h2>";
$test_article = [
    'titre' => 'TEST DIRECT - Article publié - ' . date('H:i:s'),
    'date' => date('d/m/Y'),
    'categorie' => 'Transports',
    'resume' => 'Test de résumé pour article PUBLIÉ',
    'contenu' => 'Test de contenu pour vérifier l\'insertion d\'un article PUBLIÉ directement dans la base.',
    'statut' => 'Publié',
    'image' => 'https://example.com/test.jpg'
];

try {
    echo "<div class='status info'>🔄 Insertion d'un article de test PUBLIÉ...</div>";
    
    $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut, image) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut, :image)";
    $stmt = $db->prepare($sql);
    $result = $stmt->execute($test_article);
    
    if ($result) {
        $test_id = $db->lastInsertId();
        echo "<div class='status success'>✅ Article PUBLIÉ inséré (ID: $test_id)</div>";
        
        // Vérifier qu'il est bien là
        $sql = "SELECT * FROM articles WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $test_id]);
        $inserted = $stmt->fetch();
        
        if ($inserted) {
            echo "<div class='status success'>✅ Vérification: Article bien présent dans la BDD</div>";
            echo "<div style='background: #d4edda; padding: 10px; border-radius: 6px; margin: 10px 0;'>";
            echo "<strong>Article inséré:</strong><br>";
            echo "Titre: {$inserted['titre']}<br>";
            echo "Catégorie: {$inserted['categorie']}<br>";
            echo "Statut: <span style='color: green;'>{$inserted['statut']}</span><br>";
            echo "ID: {$inserted['id']}";
            echo "</div>";
            
            // Nettoyer le test
            $db->exec("DELETE FROM articles WHERE id = $test_id");
            echo "<div class='status info'>🧹 Article de test supprimé</div>";
            
        } else {
            echo "<div class='status error'>❌ Erreur: Article inséré mais non retrouvé!</div>";
        }
        
    } else {
        echo "<div class='status error'>❌ Erreur lors de l'insertion</div>";
    }
    
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur insertion test: " . $e->getMessage() . "</div>";
    echo "<div style='background: #f8d7da; padding: 10px; border-radius: 6px; margin: 10px 0;'>";
    echo "<strong>Détails de l'erreur:</strong><br>";
    echo "Code: " . $e->getCode() . "<br>";
    echo "Message: " . $e->getMessage() . "<br>";
    echo "Fichier: " . $e->getFile() . "<br>";
    echo "Ligne: " . $e->getLine();
    echo "</div>";
}

// 6. Test de l'API directement
echo "<h2>🌐 Test de l'API</h2>";
try {
    // Simuler un appel API
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['REQUEST_URI'] = '/api.php/articles';
    $_GET['statut'] = 'Publié';
    
    $api = new MTACMNAPI();
    
    echo "<div class='status info'>🔄 Test de l'API avec les articles publiés...</div>";
    
    // Capturer la sortie
    ob_start();
    $api->handleRequest();
    $output = ob_get_clean();
    
    $response = json_decode($output, true);
    
    if ($response && isset($response['articles'])) {
        echo "<div class='status success'>✅ API fonctionne - " . count($response['articles']) . " articles publiés trouvés</div>";
        
        if (!empty($response['articles'])) {
            echo "<div style='background: #d4edda; padding: 10px; border-radius: 6px; margin: 10px 0;'>";
            echo "<strong>Réponse API:</strong><br>";
            foreach (array_slice($response['articles'], 0, 2) as $article) {
                echo "• {$article['titre']} ({$article['statut']})<br>";
            }
            echo "</div>";
        }
    } else {
        echo "<div class='status error'>❌ API ne retourne pas les articles attendus</div>";
        echo "<div style='background: #f8d7da; padding: 10px; border-radius: 6px; margin: 10px 0;'>";
        echo "<strong>Réponse brute:</strong><br>";
        echo "<pre style='font-size: 11px;'>" . htmlspecialchars($output) . "</pre>";
        echo "</div>";
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur test API: " . $e->getMessage() . "</div>";
}

// 7. Vérifier les permissions
echo "<h2>🔐 Permissions MySQL</h2>";
try {
    $sql = "SHOW GRANTS FOR CURRENT_USER()";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $grants = $stmt->fetchAll();
    
    echo "<div style='background: #f8f9fa; padding: 15px; border-radius: 8px;'>";
    echo "<h4>Permissions utilisateur:</h4>";
    foreach ($grants as $grant) {
        echo "<div style='font-size: 12px;'>" . htmlspecialchars($grant['Grants for mtacmn_user@%']) . "</div>";
    }
    echo "</div>";
} catch (Exception $e) {
    echo "<div class='status warning'>⚠️ Impossible de vérifier les permissions: " . $e->getMessage() . "</div>";
}

// 8. Instructions finales
echo "<h2>🎯 DIAGNOSTIC COMPLET</h2>";
echo "<div style='background: #d1ecf1; padding: 20px; border-radius: 10px; border-left: 5px solid #17a2b8;'>";
echo "<h3 style='color: #0c5460; margin-top: 0;'>✅ Ce diagnostic vérifie:</h3>";
echo "<ol style='color: #0c5460;'>";
echo "<li><strong>Connexion MySQL</strong> - Base de données accessible</li>";
echo "<li><strong>Existence BDD/Table</strong> - Structures créées</li>";
echo "<li><strong>Articles existants</strong> - Contenu actuel</li>";
echo "<li><strong>Insertion directe</strong> - Capacité d'ajouter</li>";
echo "<li><strong>Test API</strong> - Réponse au format attendu</li>";
echo "<li><strong>Permissions</strong> - Drots de l'utilisateur</li>";
echo "</ol>";
echo "</div>";

echo "<div style='text-align: center; margin-top: 30px;'>";
echo "<a href='admin.html' style='background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 0 10px;'>🔧 Administration</a>";
echo "<a href='start.html' style='background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 0 10px;'>🌐 Site Public</a>";
echo "</div>";

// Style
echo "<style>
.status { padding: 10px 15px; border-radius: 6px; margin: 10px 0; font-weight: bold; }
.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
.info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
.warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
.article { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #007bff; }
h1 { color: #333; text-align: center; margin-bottom: 30px; }
h2 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-top: 30px; }
h4 { color: #333; margin: 15px 0 10px 0; }
</style>";
?>
