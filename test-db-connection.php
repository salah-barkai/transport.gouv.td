<?php
// Test de connexion à la base de données
require_once 'config.php';

echo "<h2>Test de connexion MySQL</h2>";

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "<p style='color: green;'>✅ Connexion réussie à la base de données !</p>";
    
    // Vérifier si les tables existent
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h3>Tables trouvées :</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>" . htmlspecialchars($table) . "</li>";
    }
    echo "</ul>";
    
    // Si la table articles existe, compter les articles
    if (in_array('articles', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM articles");
        $count = $stmt->fetch()['count'];
        echo "<p>📰 Nombre d'articles dans la base : <strong>" . $count . "</strong></p>";
        
        if ($count > 0) {
            $stmt = $pdo->query("SELECT titre, date, categorie FROM articles LIMIT 5");
            $articles = $stmt->fetchAll();
            echo "<h3>Derniers articles :</h3>";
            echo "<ul>";
            foreach ($articles as $article) {
                echo "<li><strong>" . htmlspecialchars($article['titre']) . "</strong> (" . htmlspecialchars($article['categorie']) . " - " . htmlspecialchars($article['date']) . ")</li>";
            }
            echo "</ul>";
        }
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Erreur de connexion : " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>Vérifiez vos identifiants dans config.php</strong></p>";
}

echo "<hr>";
echo "<p><a href='index-n0c.html'>Retour au site</a></p>";
?>
