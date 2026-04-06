<?php
// Script de nettoyage complet des catégories
require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🧹 Nettoyage Complet des Catégories</h1>";

// 1. Afficher l'état actuel
echo "<h2>📊 État actuel des catégories</h2>";
$sql = "SELECT categorie, COUNT(*) as count FROM articles GROUP BY categorie ORDER BY count DESC";
$stmt = $db->prepare($sql);
$stmt->execute();
$current = $stmt->fetchAll();

$total_articles = 0;
foreach ($current as $row) {
    $total_articles += $row['count'];
    $valid = in_array($row['categorie'], ['Transports', 'Aviation Civile', 'Météorologie']);
    $color = $valid ? 'green' : 'red';
    $icon = $valid ? '✅' : '❌';
    echo "<div style='color: $color; margin: 5px 0;'>$icon <strong>{$row['categorie']}</strong> : {$row['count']} articles</div>";
}

echo "<div style='background: #e9ecef; padding: 10px; border-radius: 5px; margin: 10px 0;'>";
echo "<strong>Total articles:</strong> $total_articles</div>";

// 2. Nettoyage automatique
echo "<h2>🔄 Nettoyage automatique</h2>";

// Mapping intelligent des catégories
$mapping = [
    // Variations de Transports
    'Transport' => 'Transports',
    'transport' => 'Transports',
    'TRANSPORT' => 'Transports',
    ' Transports' => 'Transports',
    'Transports ' => 'Transports',
    ' Transports ' => 'Transports',
    
    // Variations de Aviation Civile
    'Aviation' => 'Aviation Civile',
    'aviation' => 'Aviation Civile',
    'AVIATION' => 'Aviation Civile',
    ' Aviation Civile' => 'Aviation Civile',
    'Aviation Civile ' => 'Aviation Civile',
    ' Aviation Civile ' => 'Aviation Civile',
    
    // Variations de Météorologie
    'Meteo' => 'Météorologie',
    'meteo' => 'Météorologie',
    'METEO' => 'Météorologie',
    'Météorologie' => 'Météorologie',
    'Météorologie ' => 'Météorologie',
    ' Météorologie' => 'Météorologie',
    ' Météorologie ' => 'Météorologie',
];

$corrected = 0;
$errors = 0;

foreach ($current as $row) {
    $old_categorie = $row['categorie'];
    
    // Si la catégorie est déjà valide, passer
    if (in_array($old_categorie, ['Transports', 'Aviation Civile', 'Météorologie'])) {
        continue;
    }
    
    // Chercher une correspondance dans le mapping
    $new_categorie = isset($mapping[$old_categorie]) ? $mapping[$old_categorie] : 'Transports';
    
    try {
        $sql = "UPDATE articles SET categorie = :new_categorie WHERE categorie = :old_categorie";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':new_categorie' => $new_categorie,
            ':old_categorie' => $old_categorie
        ]);
        
        $affected = $stmt->rowCount();
        $corrected += $affected;
        
        echo "<div style='color: green; margin: 5px 0;'>✅ $old_categorie → $new_categorie ($affected articles)</div>";
        
    } catch (Exception $e) {
        $errors++;
        echo "<div style='color: red; margin: 5px 0;'>❌ Erreur avec '$old_categorie': " . $e->getMessage() . "</div>";
    }
}

// 3. Vérifier le résultat
echo "<h2>✅ Résultat du nettoyage</h2>";
echo "<div style='background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;'>";
echo "<h3 style='color: #155724; margin-top: 0;'>Bilan :</h3>";
echo "<ul style='color: #155724;'>";
echo "<li>✅ Articles corrigés : $corrected</li>";
echo "<li>❌ Erreurs : $errors</li>";
echo "</ul>";
echo "</div>";

// 4. Afficher le nouvel état
echo "<h2>📊 Nouvel état des catégories</h2>";
$sql = "SELECT categorie, COUNT(*) as count FROM articles GROUP BY categorie ORDER BY count DESC";
$stmt = $db->prepare($sql);
$stmt->execute();
$new_state = $stmt->fetchAll();

foreach ($new_state as $row) {
    $valid = in_array($row['categorie'], ['Transports', 'Aviation Civile', 'Météorologie']);
    $color = $valid ? 'green' : 'red';
    $icon = $valid ? '✅' : '❌';
    echo "<div style='color: $color; margin: 5px 0; font-size: 16px;'>$icon <strong>{$row['categorie']}</strong> : {$row['count']} articles</div>";
}

// 5. Test final d'insertion
echo "<h2>🧪 Test final d'insertion</h2>";
$test_categories = ['Transports', 'Aviation Civile', 'Météorologie'];

foreach ($test_categories as $cat) {
    $test_article = [
        'titre' => "Test final - $cat - " . date('H:i:s'),
        'date' => date('d/m/Y'),
        'categorie' => $cat,
        'resume' => "Test de résumé pour la catégorie $cat",
        'contenu' => "Test de contenu pour vérifier que la catégorie $cat fonctionne correctement.",
        'statut' => 'Brouillon'
    ];
    
    try {
        $sql = "INSERT INTO articles (titre, date, categorie, resume, contenu, statut) VALUES (:titre, :date, :categorie, :resume, :contenu, :statut)";
        $stmt = $db->prepare($sql);
        $stmt->execute($test_article);
        
        $test_id = $db->lastInsertId();
        echo "<div style='color: green;'>✅ Test '$cat' réussi (ID: $test_id)</div>";
        
        // Nettoyer
        $db->exec("DELETE FROM articles WHERE id = $test_id");
        
    } catch (Exception $e) {
        echo "<div style='color: red;'>❌ Test '$cat' échoué: " . $e->getMessage() . "</div>";
    }
}

// 6. Instructions finales
echo "<h2>🎯 Actions finales</h2>";
echo "<div style='background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8;'>";
echo "<h3 style='color: #0c5460; margin-top: 0;'>Prochaines étapes :</h3>";
echo "<ol style='color: #0c5460;'>";
echo "<li><strong>Rafraîchir l'administration</strong> : Accédez à admin.html</li>";
echo "<li><strong>Tester la création</strong> : Créez un nouvel article</li>";
echo "<li><strong>Vérifier la catégorie</strong> : Assurez-vous qu'elle est bien sauvegardée</li>";
echo "<li><strong>Validation ajoutée</strong> : Le formulaire admin.html valide maintenant les catégories</li>";
echo "</ol>";
echo "</div>";

echo "<div style='text-align: center; margin-top: 20px;'>";
echo "<a href='admin.html' style='background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;'>🚀 Tester l'administration maintenant</a>";
echo "</div>";

// 7. Statut final
$all_valid = true;
foreach ($new_state as $row) {
    if (!in_array($row['categorie'], ['Transports', 'Aviation Civile', 'Météorologie'])) {
        $all_valid = false;
        break;
    }
}

if ($all_valid) {
    echo "<div style='background: #d4edda; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;'>";
    echo "<h2 style='color: #155724; margin: 0;'>🎉 Toutes les catégories sont maintenant valides !</h2>";
    echo "<p style='color: #155724; margin: 5px 0;'>L'erreur de sauvegarde devrait être résolue.</p>";
    echo "</div>";
}
?>
