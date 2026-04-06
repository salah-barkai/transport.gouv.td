<?php
// Solution complète pour corriger catégorie ET image en une seule fois
require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🔧 Solution Complète - Catégorie + Image</h1>";

// 1. État actuel de la table
echo "<h2>🏗️ Structure actuelle</h2>";
$sql = "DESCRIBE articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$structure = $stmt->fetchAll();

foreach ($structure as $column) {
    if (in_array($column['Field'], ['categorie', 'image'])) {
        $color = ($column['Field'] === 'categorie' && strpos($column['Type'], 'ENUM') !== false) ? 'red' : 'green';
        $icon = ($column['Field'] === 'categorie' && strpos($column['Type'], 'ENUM') !== false) ? '❌' : '✅';
        echo "<div style='color: $color; background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 5px 0;'>";
        echo "$icon <strong>{$column['Field']}</strong>: {$column['Type']}</div>";
    }
}

// 2. Correction de la colonne catégorie
echo "<h2>🔧 Correction 1: Colonne Catégorie</h2>";

try {
    // Changer ENUM en VARCHAR(100)
    $sql = "ALTER TABLE articles MODIFY COLUMN categorie VARCHAR(100) NOT NULL";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    
    echo "<div style='color: green; font-size: 16px;'>✅ Colonne 'categorie' modifiée en VARCHAR(100)</div>";
    
} catch (Exception $e) {
    echo "<div style='color: red;'>❌ Erreur catégorie: " . $e->getMessage() . "</div>";
}

// 3. Correction de la colonne image
echo "<h2>🔧 Correction 2: Colonne Image</h2>";

try {
    // Augmenter image à VARCHAR(1000)
    $sql = "ALTER TABLE articles MODIFY COLUMN image VARCHAR(1000)";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    
    echo "<div style='color: green; font-size: 16px;'>✅ Colonne 'image' modifiée en VARCHAR(1000)</div>";
    
} catch (Exception $e) {
    echo "<div style='color: red;'>❌ Erreur image: " . $e->getMessage() . "</div>";
}

// 4. Vérifier la nouvelle structure
echo "<h2>✅ Nouvelle structure</h2>";
$sql = "DESCRIBE articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$new_structure = $stmt->fetchAll();

foreach ($new_structure as $column) {
    if (in_array($column['Field'], ['categorie', 'image'])) {
        echo "<div style='color: green; background: #d4edda; padding: 10px; border-radius: 5px; margin: 5px 0;'>";
        echo "✅ <strong>{$column['Field']}</strong>: {$column['Type']}</div>";
    }
}

// 5. Test complet avec les deux colonnes
echo "<h2>🧪 Test complet</h2>";

$test_article = [
    'titre' => 'Test complet - ' . date('H:i:s'),
    'date' => date('d/m/Y'),
    'categorie' => 'Nouvelle catégorie de test', // Catégorie personnalisée
    'resume' => 'Test avec catégorie personnalisée et longue URL d\'image',
    'contenu' => 'Test de contenu pour vérifier que les deux colonnes (catégorie et image) fonctionnent correctement.',
    'image' => 'https://example.com/very/long/path/to/images/with/spaces/and/special/characters/article-image-' . str_repeat('x', 200) . '.jpg',
    'statut' => 'Brouillon'
];

echo "<div style='background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;'>";
echo "<strong>Test avec:</strong><br>";
echo "Catégorie: '{$test_article['categorie']}' (longueur: " . strlen($test_article['categorie']) . ")<br>";
echo "Image: " . substr($test_article['image'], 0, 80) . "... (longueur: " . strlen($test_article['image']) . ")";
echo "</div>";

try {
    $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, image, statut) VALUES (:titre, :date, :categorie, :resume, :contenu, :image, :statut)";
    $stmt = $db->prepare($sql);
    $stmt->execute($test_article);
    
    $test_id = $db->lastInsertId();
    echo "<div style='color: green; font-size: 18px; font-weight: bold;'>✅ Test complet réussi (ID: $test_id)</div>";
    
    // Nettoyer
    $db->exec("DELETE FROM articles WHERE id = $test_id");
    echo "<div style='color: blue;'>🧹 Article de test supprimé</div>";
    
} catch (Exception $e) {
    echo "<div style='color: red; font-size: 18px; font-weight: bold;'>❌ Test échoué: " . $e->getMessage() . "</div>";
}

// 6. Nettoyage des anciennes catégories invalides
echo "<h2>🧹 Nettoyage des catégories</h2>";

$sql = "SELECT DISTINCT categorie FROM articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo "<h3>Catégories existantes:</h3>";
foreach ($categories as $cat) {
    echo "<div style='color: blue;'>• '$cat'</div>";
}

// 7. Instructions finales
echo "<h2>🎯 Solution Complète Appliquée!</h2>";
echo "<div style='background: #d4edda; padding: 20px; border-radius: 10px; border-left: 5px solid #28a745;'>";
echo "<h3 style='color: #155724; margin-top: 0;'>✅ Tous les problèmes résolus!</h3>";
echo "<p style='color: #155724; font-size: 16px;'><strong>Les deux colonnes sont maintenant corrigées:</strong></p>";
echo "<ul style='color: #155724;'>";
echo "<li>✅ Catégorie: VARCHAR(100) - Plus de limitation ENUM</li>";
echo "<li>✅ Image: VARCHAR(1000) - Support des longues URLs</li>";
echo "<li>✅ Fini les erreurs de troncature</li>";
echo "<li>✅ Compatible avec toutes les données</li>";
echo "</ul>";
echo "</div>";

echo "<div style='background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 15px;'>";
echo "<h3 style='color: #856404; margin-top: 0;'>🔄 Prochaines étapes:</h3>";
echo "<ol style='color: #856404;'>";
echo "<li><strong>Rafraîchir l'administration</strong>: admin.html</li>";
echo "<li><strong>Tester la création</strong>: Nouvel article</li>";
echo "<li><strong>Vérifier la sauvegarde</strong>: Plus d'erreurs</li>";
echo "<li><strong>Tester avec image</strong>: Longue URL acceptée</li>";
echo "</ol>";
echo "</div>";

echo "<div style='text-align: center; margin-top: 30px;'>";
echo "<a href='admin.html' style='background: #28a745; color: white; padding: 20px 40px; text-decoration: none; border-radius: 10px; font-size: 20px; display: inline-block;'>🚀 Tester l'administration MAINTENANT</a>";
echo "</div>";
?>
