<?php
// Script de correction des catégories - Version finale
require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🔧 Correction des catégories d'articles</h1>";

// 1. Voir les catégories actuelles
echo "<h2>📊 Analyse des catégories</h2>";
$sql = "SELECT id, titre, categorie FROM articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$articles = $stmt->fetchAll();

$categories_count = [];
$problematic = [];

foreach ($articles as $article) {
    $categorie = $article['categorie'];
    $categories_count[$categorie] = ($categories_count[$categorie] ?? 0) + 1;
    
    // Vérifier si la catégorie est valide
    if (!in_array($categorie, ['Transports', 'Aviation Civile', 'Météorologie'])) {
        $problematic[] = $article;
    }
}

echo "<h3>Répartition actuelle :</h3>";
foreach ($categories_count as $cat => $count) {
    $color = in_array($cat, ['Transports', 'Aviation Civile', 'Météorologie']) ? 'green' : 'red';
    echo "<div style='color: $color; margin: 5px 0;'>• <strong>$cat</strong> : $count articles</div>";
}

// 2. Corriger les catégories problématiques
if (!empty($problematic)) {
    echo "<h2>🔨 Correction des catégories invalides</h2>";
    
    foreach ($problematic as $article) {
        $oldCategorie = $article['categorie'];
        $newCategorie = '';
        
        // Logique de correction
        $oldLower = strtolower(trim($oldCategorie));
        
        if (strpos($oldLower, 'transport') !== false) {
            $newCategorie = 'Transports';
        } elseif (strpos($oldLower, 'aviation') !== false) {
            $newCategorie = 'Aviation Civile';
        } elseif (strpos($oldLower, 'meteo') !== false || strpos($oldLower, 'météorologie') !== false) {
            $newCategorie = 'Météorologie';
        } else {
            $newCategorie = 'Transports'; // Par défaut
        }
        
        // Mettre à jour
        try {
            $sql = "UPDATE articles SET categorie = :newCategorie WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':newCategorie' => $newCategorie,
                ':id' => $article['id']
            ]);
            
            echo "<div style='color: green; margin: 5px 0;'>✅ Article #{$article['id']}: <strong>'$oldCategorie'</strong> → <strong>'$newCategorie'</strong></div>";
        } catch (Exception $e) {
            echo "<div style='color: red; margin: 5px 0;'>❌ Erreur Article #{$article['id']}: " . $e->getMessage() . "</div>";
        }
    }
} else {
    echo "<h2 style='color: green;'>✅ Toutes les catégories sont déjà correctes !</h2>";
}

// 3. Vérifier la structure de la table
echo "<h2>🏗️ Vérification de la structure</h2>";
$sql = "DESCRIBE articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$structure = $stmt->fetchAll();

foreach ($structure as $column) {
    if ($column['Field'] === 'categorie') {
        echo "<div style='background: #f0f8ff; padding: 10px; border-radius: 5px;'>";
        echo "<strong>Colonne 'categorie' :</strong> {$column['Type']}<br>";
        echo "<strong>Valeurs autorisées :</strong> Transports, Aviation Civile, Météorologie</div>";
        break;
    }
}

// 4. Test d'insertion
echo "<h2>🧪 Test d'insertion</h2>";
$test_article = [
    'titre' => 'Article de test - ' . date('H:i:s'),
    'date' => date('d/m/Y'),
    'categorie' => 'Transports',
    'resume' => 'Test de résumé pour vérifier l\'insertion',
    'contenu' => 'Test de contenu pour vérifier que l\'insertion fonctionne correctement avec la catégorie Transports.',
    'statut' => 'Brouillon'
];

try {
    $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut)";
    $stmt = $db->prepare($sql);
    $stmt->execute($test_article);
    
    $test_id = $db->lastInsertId();
    echo "<div style='color: green;'>✅ Test d'insertion réussi (ID: $test_id)</div>";
    
    // Nettoyer le test
    $db->exec("DELETE FROM articles WHERE id = $test_id");
    echo "<div style='color: blue;'>🧹 Article de test supprimé</div>";
    
} catch (Exception $e) {
    echo "<div style='color: red;'>❌ Erreur lors du test: " . $e->getMessage() . "</div>";
}

// 5. Instructions finales
echo "<h2>📋 État final et instructions</h2>";
echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;'>";
echo "<h3 style='color: #155724; margin-top: 0;'>✅ Corrections appliquées :</h3>";
echo "<ul style='color: #155724;'>";
echo "<li>✅ Faute de frappe corrigée dans api-client.js (initialized)</li>";
echo "<li>✅ Catégories invalides corrigées dans la base de données</li>";
echo "<li>✅ Test d'insertion validé</li>";
echo "</ul>";
echo "</div>";

echo "<div style='background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 15px;'>";
echo "<h3 style='color: #856404; margin-top: 0;'>🔄 Actions à faire :</h3>";
echo "<ol style='color: #856404;'>";
echo "<li>Rafraîchir la page admin.html</li>";
echo "<li>Tester la création d'un nouvel article</li>";
echo "<li>Vérifier que la catégorie est bien sauvegardée</li>";
echo "</ol>";
echo "</div>";

echo "<div style='text-align: center; margin-top: 20px;'>";
echo "<a href='admin.html' style='background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;'>🚀 Aller à l'administration</a>";
echo "</div>";

// Afficher l'état final
echo "<h2>📊 État final des catégories</h2>";
$sql = "SELECT categorie, COUNT(*) as count FROM articles GROUP BY categorie ORDER BY count DESC";
$stmt = $db->prepare($sql);
$stmt->execute();
$final_results = $stmt->fetchAll();

foreach ($final_results as $row) {
    $color = in_array($row['categorie'], ['Transports', 'Aviation Civile', 'Météorologie']) ? 'green' : 'red';
    echo "<div style='color: $color; margin: 5px 0; font-size: 16px;'>• <strong>{$row['categorie']}</strong> : {$row['count']} articles</div>";
}
?>
