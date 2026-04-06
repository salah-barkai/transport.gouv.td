<?php
// Vérification complète de la base de données
require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🗄️ Vérification Complète de la Base de Données</h1>";

// 1. Vérifier si la table existe
echo "<h2>📋 Vérification de la table articles</h2>";
try {
    $sql = "SHOW TABLES LIKE 'articles'";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $tables = $stmt->fetchAll();
    
    if (!empty($tables)) {
        echo "<div class='status success'>✅ Table 'articles' existe</div>";
    } else {
        echo "<div class='status error'>❌ Table 'articles' n'existe pas!</div>";
        echo "<div class='status info'>🔧 Création de la table...</div>";
        
        // Créer la table
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

// 2. Vérifier la structure de la table
echo "<h2>🏗️ Structure de la table articles</h2>";
try {
    $sql = "DESCRIBE articles";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $structure = $stmt->fetchAll();
    
    echo "<div style='background: #f8f9fa; padding: 15px; border-radius: 8px;'>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr style='background: #007bff; color: white;'><th>Champ</th><th>Type</th><th>Null</th><th>Key</th></tr>";
    
    foreach ($structure as $column) {
        $color = in_array($column['Field'], ['categorie', 'image']) ? 'orange' : 'inherit';
        echo "<tr style='color: $color;'>";
        echo "<td><strong>{$column['Field']}</strong></td>";
        echo "<td>{$column['Type']}</td>";
        echo "<td>{$column['Null']}</td>";
        echo "<td>{$column['Key']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    echo "</div>";
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur structure: " . $e->getMessage() . "</div>";
}

// 3. Compter les articles
echo "<h2>📊 Comptage des articles</h2>";
try {
    $sql = "SELECT COUNT(*) as total FROM articles";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $count = $stmt->fetch();
    
    echo "<div class='status info'>📈 Total articles: {$count['total']}</div>";
    
    if ($count['total'] == 0) {
        echo "<div class='status warning'>⚠️ La table est vide!</div>";
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur comptage: " . $e->getMessage() . "</div>";
}

// 4. Vérifier les articles par statut
echo "<h2>📋 Articles par statut</h2>";
try {
    $sql = "SELECT statut, COUNT(*) as count FROM articles GROUP BY statut";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $stats = $stmt->fetchAll();
    
    if (!empty($stats)) {
        foreach ($stats as $stat) {
            $color = $stat['statut'] === 'Publié' ? 'green' : 'orange';
            $icon = $stat['statut'] === 'Publié' ? '✅' : '📝';
            echo "<div class='status' style='color: $color;'>$icon {$stat['statut']}: {$stat['count']}</div>";
        }
    } else {
        echo "<div class='status warning'>⚠️ Aucun article trouvé</div>";
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur statut: " . $e->getMessage() . "</div>";
}

// 5. Vérifier les articles par catégorie
echo "<h2>📁 Articles par catégorie</h2>";
try {
    $sql = "SELECT categorie, COUNT(*) as count FROM articles GROUP BY categorie ORDER BY count DESC";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll();
    
    if (!empty($categories)) {
        foreach ($categories as $cat) {
            echo "<div class='status info'>📁 {$cat['categorie']}: {$cat['count']} articles</div>";
        }
    } else {
        echo "<div class='status warning'>⚠️ Aucune catégorie trouvée</div>";
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur catégories: " . $e->getMessage() . "</div>";
}

// 6. Afficher les 5 derniers articles
echo "<h2>📰 5 derniers articles</h2>";
try {
    $sql = "SELECT * FROM articles ORDER BY createdAt DESC LIMIT 5";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $articles = $stmt->fetchAll();
    
    if (!empty($articles)) {
        foreach ($articles as $article) {
            $statutColor = $article['statut'] === 'Publié' ? 'green' : 'orange';
            $statutIcon = $article['statut'] === 'Publié' ? '✅' : '📝';
            
            echo "<div style='background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #007bff;'>";
            echo "<div style='display: flex; justify-content: space-between; margin-bottom: 10px;'>";
            echo "<strong>ID: {$article['id']} - {$article['titre']}</strong>";
            echo "<span style='color: $statutColor;'>$statutIcon {$article['statut']}</span>";
            echo "</div>";
            echo "<div style='font-size: 12px; color: #666; margin-bottom: 8px;'>";
            echo "📁 Catégorie: {$article['categorie']} | ";
            echo "📅 Date: {$article['date']} | ";
            echo "🕐 Créé: {$article['createdAt']}";
            echo "</div>";
            if ($article['image']) {
                echo "<div style='font-size: 11px; color: #007bff;'>🖼️ Image: " . substr($article['image'], 0, 100) . (strlen($article['image']) > 100 ? '...' : '') . "</div>";
            }
            echo "<div style='font-size: 13px; margin-top: 8px;'>" . substr($article['resume'], 0, 150) . (strlen($article['resume']) > 150 ? '...' : '') . "</div>";
            echo "</div>";
        }
    } else {
        echo "<div class='status warning'>⚠️ Aucun article trouvé</div>";
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur articles: " . $e->getMessage() . "</div>";
}

// 7. Test d'insertion
echo "<h2>🧪 Test d'insertion</h2>";
$test_article = [
    'titre' => 'Article de test diagnostic - ' . date('H:i:s'),
    'date' => date('d/m/Y'),
    'categorie' => 'Transports',
    'resume' => 'Test de résumé pour vérifier l\'insertion',
    'contenu' => 'Test de contenu pour vérifier que l\'insertion fonctionne correctement.',
    'statut' => 'Publié',
    'image' => 'https://example.com/test-image.jpg'
];

try {
    $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut, image) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut, :image)";
    $stmt = $db->prepare($sql);
    $stmt->execute($test_article);
    
    $test_id = $db->lastInsertId();
    echo "<div class='status success'>✅ Test d'insertion réussi (ID: $test_id)</div>";
    
    // Nettoyer le test
    $db->exec("DELETE FROM articles WHERE id = $test_id");
    echo "<div class='status info'>🧹 Article de test supprimé</div>";
    
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur insertion: " . $e->getMessage() . "</div>";
}

// 8. Test de récupération API
echo "<h2>🌐 Test API</h2>";
try {
    $sql = "SELECT * FROM articles WHERE statut = 'Publié' ORDER BY createdAt DESC";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $published = $stmt->fetchAll();
    
    echo "<div class='status info'>📊 Articles publiés: " . count($published) . "</div>";
    
    if (!empty($published)) {
        echo "<div style='background: #d4edda; padding: 15px; border-radius: 8px;'>";
        echo "<h4>Format attendu par l'API:</h4>";
        echo "<pre style='background: #f8f9fa; padding: 10px; border-radius: 4px;'>";
        echo json_encode([
            'success' => true,
            'articles' => array_slice($published, 0, 2) // Juste 2 pour l'exemple
        ], JSON_PRETTY_PRINT);
        echo "</pre>";
        echo "</div>";
    }
} catch (Exception $e) {
    echo "<div class='status error'>❌ Erreur API test: " . $e->getMessage() . "</div>";
}

// 9. Instructions
echo "<h2>🎯 Diagnostic Complet</h2>";
echo "<div style='background: #d1ecf1; padding: 20px; border-radius: 10px; border-left: 5px solid #17a2b8;'>";
echo "<h3 style='color: #0c5460; margin-top: 0;'>📋 Ce diagnostic montre:</h3>";
echo "<ul style='color: #0c5460;'>";
echo "<li>✅ Si la table existe et sa structure</li>";
echo "<li>✅ Le nombre total d'articles</li>";
echo "<li>✅ La répartition par statut et catégorie</li>";
echo "<li>✅ Les derniers articles insérés</li>";
echo "<li>✅ Si l'insertion fonctionne</li>";
echo "<li>✅ Le format des données pour l'API</li>";
echo "</ul>";
echo "</div>";

echo "<div style='text-align: center; margin-top: 30px;'>";
echo "<a href='admin.html' style='background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 0 10px;'>🔧 Administration</a>";
echo "<a href='start.html' style='background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 0 10px;'>🌐 Site Public</a>";
echo "</div>";

// Style CSS
echo "<style>
.status { padding: 10px 15px; border-radius: 6px; margin: 10px 0; font-weight: bold; }
.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
.info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
.warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
h1 { color: #333; text-align: center; margin-bottom: 30px; }
h2 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-top: 30px; }
</style>";
?>
