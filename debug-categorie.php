<?php
// Script de diagnostic avancé pour l'erreur de catégorie
require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🔍 Diagnostic Avancé - Erreur Catégorie</h1>";

// 1. Vérifier la structure exacte de la table
echo "<h2>🏗️ Structure exacte de la table</h2>";
$sql = "SHOW CREATE TABLE articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$result = $stmt->fetch();

echo "<pre style='background: #f8f9fa; padding: 15px; border-radius: 6px;'>";
echo htmlspecialchars($result['Create Table']);
echo "</pre>";

// 2. Vérifier les catégories existantes
echo "<h2>📊 Catégories actuelles dans la base</h2>";
$sql = "SELECT DISTINCT categorie FROM articles ORDER BY categorie";
$stmt = $db->prepare($sql);
$stmt->execute();
$categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo "<div style='background: #f0f8ff; padding: 10px; border-radius: 5px;'>";
foreach ($categories as $cat) {
    $valid = in_array($cat, ['Transports', 'Aviation Civile', 'Météorologie']);
    $color = $valid ? 'green' : 'red';
    $icon = $valid ? '✅' : '❌';
    echo "<div style='color: $color;'>$icon '$cat' (longueur: " . strlen($cat) . ")</div>";
}
echo "</div>";

// 3. Créer un test avec logging détaillé
echo "<h2>🧪 Test d'insertion avec logging</h2>";

// Test 1: Catégorie valide
$test_valid = [
    'titre' => 'Test catégorie valide - ' . date('H:i:s'),
    'date' => date('d/m/Y'),
    'categorie' => 'Transports',
    'resume' => 'Test avec catégorie valide',
    'contenu' => 'Contenu de test',
    'statut' => 'Brouillon'
];

echo "<h3>Test 1: Catégorie valide ('Transports')</h3>";
try {
    $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut)";
    $stmt = $db->prepare($sql);
    
    // Logger les valeurs exactes
    echo "<div style='background: #fff3cd; padding: 10px; border-radius: 5px;'>";
    echo "<strong>Valeurs envoyées :</strong><br>";
    foreach ($test_valid as $key => $value) {
        echo "$key = '$value' (longueur: " . strlen($value) . ")<br>";
    }
    echo "</div>";
    
    $stmt->execute($test_valid);
    $id1 = $db->lastInsertId();
    echo "<div style='color: green;'>✅ Insertion réussie (ID: $id1)</div>";
    $db->exec("DELETE FROM articles WHERE id = $id1");
} catch (Exception $e) {
    echo "<div style='color: red;'>❌ Erreur: " . $e->getMessage() . "</div>";
}

// Test 2: Catégorie avec espace
$test_space = [
    'titre' => 'Test avec espace - ' . date('H:i:s'),
    'date' => date('d/m/Y'),
    'categorie' => ' Transports ', // Avec espaces
    'resume' => 'Test avec espaces',
    'contenu' => 'Contenu de test',
    'statut' => 'Brouillon'
];

echo "<h3>Test 2: Catégorie avec espaces (' Transports ')</h3>";
try {
    $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut)";
    $stmt = $db->prepare($sql);
    
    echo "<div style='background: #fff3cd; padding: 10px; border-radius: 5px;'>";
    echo "<strong>Valeurs envoyées :</strong><br>";
    foreach ($test_space as $key => $value) {
        echo "$key = '" . htmlspecialchars($value) . "' (longueur: " . strlen($value) . ")<br>";
    }
    echo "</div>";
    
    $stmt->execute($test_space);
    $id2 = $db->lastInsertId();
    echo "<div style='color: green;'>✅ Insertion réussie (ID: $id2)</div>";
    $db->exec("DELETE FROM articles WHERE id = $id2");
} catch (Exception $e) {
    echo "<div style='color: red;'>❌ Erreur: " . $e->getMessage() . "</div>";
}

// Test 3: Catégorie invalide
$test_invalid = [
    'titre' => 'Test catégorie invalide - ' . date('H:i:s'),
    'date' => date('d/m/Y'),
    'categorie' => 'Transport', // Sans 's'
    'resume' => 'Test avec catégorie invalide',
    'contenu' => 'Contenu de test',
    'statut' => 'Brouillon'
];

echo "<h3>Test 3: Catégorie invalide ('Transport')</h3>";
try {
    $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut)";
    $stmt = $db->prepare($sql);
    
    echo "<div style='background: #fff3cd; padding: 10px; border-radius: 5px;'>";
    echo "<strong>Valeurs envoyées :</strong><br>";
    foreach ($test_invalid as $key => $value) {
        echo "$key = '$value' (longueur: " . strlen($value) . ")<br>";
    }
    echo "</div>";
    
    $stmt->execute($test_invalid);
    $id3 = $db->lastInsertId();
    echo "<div style='color: green;'>✅ Insertion réussie (ID: $id3)</div>";
    $db->exec("DELETE FROM articles WHERE id = $id3");
} catch (Exception $e) {
    echo "<div style='color: red;'>❌ Erreur: " . $e->getMessage() . "</div>";
}

// 4. Vérifier les logs MySQL récents
echo "<h2>📋 Logs MySQL récents</h2>";
try {
    $sql = "SHOW WARNINGS";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $warnings = $stmt->fetchAll();
    
    if (!empty($warnings)) {
        echo "<div style='background: #f8d7da; padding: 10px; border-radius: 5px;'>";
        foreach ($warnings as $warning) {
            echo "<div><strong>Warning:</strong> {$warning['Message']}</div>";
        }
        echo "</div>";
    } else {
        echo "<div style='color: green;'>✅ Aucun warning MySQL</div>";
    }
} catch (Exception $e) {
    echo "<div style='color: orange;'>⚠️ Impossible d'afficher les warnings: " . $e->getMessage() . "</div>";
}

// 5. Solution proposée
echo "<h2>💡 Solution recommandée</h2>";
echo "<div style='background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8;'>";
echo "<h3 style='color: #0c5460; margin-top: 0;'>Pour corriger définitivement :</h3>";
echo "<ol style='color: #0c5460;'>";
echo "<li><strong>Nettoyer les catégories existantes</strong> : Exécuter le script fix-categories-final.php</li>";
echo "<li><strong>Valider les données en entrée</strong> : Ajouter validation dans admin.html</li>";
echo "<li><strong>Utiliser uniquement les 3 valeurs exactes</strong> : 'Transports', 'Aviation Civile', 'Météorologie'</li>";
echo "</ol>";
echo "</div>";

// 6. Script de nettoyage immédiat
echo "<h2>🧹 Nettoyage immédiat</h2>";
echo "<form method='post'>";
echo "<button type='submit' name='cleanup' style='background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;'>🧹 Nettoyer toutes les catégories invalides</button>";
echo "</form>";

if (isset($_POST['cleanup'])) {
    echo "<h3>🔄 Nettoyage en cours...</h3>";
    
    // Nettoyer toutes les catégaires invalides
    $sql = "UPDATE articles SET categorie = 'Transports' WHERE categorie NOT IN ('Transports', 'Aviation Civile', 'Météorologie')";
    $stmt = $db->prepare($sql);
    $affected = $stmt->execute();
    
    echo "<div style='color: green;'>✅ $affected articles corrigés</div>";
    
    // Vérifier le résultat
    $sql = "SELECT categorie, COUNT(*) as count FROM articles GROUP BY categorie";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll();
    
    echo "<h4>📊 Nouvelle répartition :</h4>";
    foreach ($results as $row) {
        echo "<div style='color: green;'>• {$row['categorie']}: {$row['count']} articles</div>";
    }
}

echo "<div style='text-align: center; margin-top: 20px;'>";
echo "<a href='admin.html' style='background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;'>🚀 Tester l'administration</a>";
echo "</div>";
?>
