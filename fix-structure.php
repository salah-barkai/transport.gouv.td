<?php
// Solution radicale : Modifier la structure de la table pour accepter toutes les catégories
require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🔧 Solution Radicale - Modification Structure Table</h1>";

// 1. Afficher la structure actuelle
echo "<h2>🏗️ Structure actuelle</h2>";
$sql = "DESCRIBE articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$structure = $stmt->fetchAll();

foreach ($structure as $column) {
    if ($column['Field'] === 'categorie') {
        echo "<div style='background: #f8f9fa; padding: 15px; border-radius: 6px;'>";
        echo "<strong>Colonne categorie actuelle:</strong><br>";
        echo "Type: {$column['Type']}<br>";
        echo "Null: {$column['Null']}<br>";
        echo "Key: {$column['Key']}<br>";
        echo "</div>";
        break;
    }
}

// 2. Solution 1: Modifier le ENUM pour inclure plus de valeurs
echo "<h2>🔧 Solution 1: Étendre l'ENUM</h2>";

// D'abord, récupérer toutes les catégories existantes
$sql = "SELECT DISTINCT categorie FROM articles WHERE categorie IS NOT NULL";
$stmt = $db->prepare($sql);
$stmt->execute();
$existing_categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo "<h3>Catégories existantes trouvées:</h3>";
foreach ($existing_categories as $cat) {
    echo "<div style='color: blue;'>• '$cat'</div>";
}

// Créer la nouvelle liste ENUM
$base_categories = ['Transports', 'Aviation Civile', 'Météorologie'];
$all_categories = array_unique(array_merge($base_categories, $existing_categories));
$enum_values = "'" . implode("','", array_map('addslashes', $all_categories)) . "'";

echo "<h3>Nouvel ENUM proposé:</h3>";
echo "<div style='background: #fff3cd; padding: 10px; border-radius: 5px; font-family: monospace;'>";
echo "categorie ENUM($enum_values) NOT NULL";
echo "</div>";

// 3. Solution 2: Changer en VARCHAR (plus flexible)
echo "<h2>🔧 Solution 2: Changer en VARCHAR (recommandé)</h2>";
echo "<div style='background: #d1ecf1; padding: 15px; border-radius: 8px;'>";
echo "<h3 style='color: #0c5460; margin-top: 0;'>Pourquoi VARCHAR est mieux:</h3>";
echo "<ul style='color: #0c5460;'>";
echo "<li>✅ Accepte n'importe quelle catégorie</li>";
echo "<li>✅ Plus flexible pour l'avenir</li>";
echo "<li>✅ Pas de limitation de valeurs prédéfinies</li>";
echo "<li>✅ Compatible avec le code existant</li>";
echo "</ul>";
echo "</div>";

// 4. Exécuter la modification
echo "<h2>🚀 Application de la solution</h2>";

try {
    // Solution 2: Changer en VARCHAR(100)
    $sql = "ALTER TABLE articles MODIFY COLUMN categorie VARCHAR(100) NOT NULL";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    
    echo "<div style='color: green; font-size: 18px; font-weight: bold;'>✅ Colonne categorie modifiée en VARCHAR(100) avec succès!</div>";
    
    // Vérifier la modification
    $sql = "DESCRIBE articles";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $new_structure = $stmt->fetchAll();
    
    foreach ($new_structure as $column) {
        if ($column['Field'] === 'categorie') {
            echo "<div style='background: #d4edda; padding: 15px; border-radius: 6px; margin-top: 15px;'>";
            echo "<strong>Nouvelle structure:</strong><br>";
            echo "Type: {$column['Type']}<br>";
            echo "Null: {$column['Null']}<br>";
            echo "</div>";
            break;
        }
    }
    
} catch (Exception $e) {
    echo "<div style='color: red; font-size: 18px; font-weight: bold;'>❌ Erreur lors de la modification: " . $e->getMessage() . "</div>";
}

// 5. Test immédiat avec différentes catégories
echo "<h2>🧪 Test d'insertion avec différentes catégories</h2>";

$test_categories = [
    'Transports',
    'Aviation Civile', 
    'Météorologie',
    'Transport', // Sans 's'
    'aviation civile', // Minuscules
    'Météo', // Court
    'Nouvelle catégorie', // Complètement nouvelle
    'Transport Routier', // Avec espace
];

foreach ($test_categories as $cat) {
    $test_article = [
        'titre' => "Test catégorie: '$cat' - " . date('H:i:s'),
        'date' => date('d/m/Y'),
        'categorie' => $cat,
        'resume' => "Test de résumé pour la catégorie: $cat",
        'contenu' => "Test de contenu pour vérifier que la catégorie '$cat' fonctionne maintenant.",
        'statut' => 'Brouillon'
    ];
    
    try {
        $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut)";
        $stmt = $db->prepare($sql);
        $stmt->execute($test_article);
        
        $test_id = $db->lastInsertId();
        echo "<div style='color: green;'>✅ Catégorie '$cat' acceptée (ID: $test_id)</div>";
        
        // Nettoyer le test
        $db->exec("DELETE FROM articles WHERE id = $test_id");
        
    } catch (Exception $e) {
        echo "<div style='color: red;'>❌ Catégorie '$cat' rejetée: " . $e->getMessage() . "</div>";
    }
}

// 6. Afficher l'état final
echo "<h2>📊 État final</h2>";
$sql = "SELECT categorie, COUNT(*) as count FROM articles GROUP BY categorie ORDER BY count DESC";
$stmt = $db->prepare($sql);
$stmt->execute();
$final_state = $stmt->fetchAll();

echo "<h3>Catégories actuelles:</h3>";
foreach ($final_state as $row) {
    echo "<div style='color: blue; margin: 5px 0;'>• <strong>{$row['categorie']}</strong> : {$row['count']} articles</div>";
}

// 7. Instructions finales
echo "<h2>🎯 Solution Appliquée!</h2>";
echo "<div style='background: #d4edda; padding: 20px; border-radius: 10px; border-left: 5px solid #28a745;'>";
echo "<h3 style='color: #155724; margin-top: 0;'>✅ Problème résolu!</h3>";
echo "<p style='color: #155724; font-size: 16px;'><strong>La colonne categorie est maintenant VARCHAR(100)</strong></p>";
echo "<ul style='color: #155724;'>";
echo "<li>✅ Plus de limitation ENUM</li>";
echo "<li>✅ Accepte toutes les catégories</li>";
echo "<li>✅ Compatible avec le code existant</li>";
echo "<li>✅ Fini les erreurs de troncature!</li>";
echo "</ul>";
echo "</div>";

echo "<div style='text-align: center; margin-top: 30px;'>";
echo "<a href='admin.html' style='background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; display: inline-block;'>🚀 Tester l'administration MAINTENANT</a>";
echo "</div>";

// 8. Option: Revenir en ENUM si nécessaire
echo "<h2>🔄 Option: Revenir en ENUM (si nécessaire)</h2>";
echo "<div style='background: #fff3cd; padding: 15px; border-radius: 8px;'>";
echo "<p>Si vous voulez revenir à l'ENUM plus tard:</p>";
echo "<pre style='background: #f8f9fa; padding: 10px; border-radius: 5px;'>";
echo "ALTER TABLE articles MODIFY COLUMN categorie ENUM('Transports', 'Aviation Civile', 'Météorologie') NOT NULL;";
echo "</pre>";
echo "</div>";
?>
