<?php
// Script de diagnostic et correction complet
// Accédez via http://127.0.0.1:8000/fix-complete.php

require_once 'api.php';

$database = new Database();
$db = $database->getConnection();

echo "<h1>🔧 Diagnostic et Correction Complet MTACMN</h1>";

// 1. Vérifier les catégories problématiques
echo "<h2>📊 Analyse des catégories</h2>";
$sql = "SELECT id, titre, categorie FROM articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$articles = $stmt->fetchAll();

$problematic = [];
$categories_count = [];

foreach ($articles as $article) {
    $categorie = $article['categorie'];
    $categories_count[$categorie] = ($categories_count[$categorie] ?? 0) + 1;
    
    if (!in_array($categorie, ['Transports', 'Aviation Civile', 'Météorologie'])) {
        $problematic[] = $article;
    }
}

echo "<h3>Répartition des catégories :</h3>";
foreach ($categories_count as $cat => $count) {
    $color = in_array($cat, ['Transports', 'Aviation Civile', 'Météorologie']) ? 'green' : 'red';
    echo "<div style='color: $color;'>• $cat : $count articles</div>";
}

if (!empty($problematic)) {
    echo "<h3>🔨 Correction des catégories invalides</h3>";
    
    foreach ($problematic as $article) {
        $oldCategorie = $article['categorie'];
        $newCategorie = '';
        
        // Logique de correction intelligente
        $oldLower = strtolower($oldCategorie);
        
        if (strpos($oldLower, 'transport') !== false) {
            $newCategorie = 'Transports';
        } elseif (strpos($oldLower, 'aviation') !== false) {
            $newCategorie = 'Aviation Civile';
        } elseif (strpos($oldLower, 'meteo') !== false) {
            $newCategorie = 'Météorologie';
        } else {
            $newCategorie = 'Transports'; // Par défaut
        }
        
        // Mettre à jour avec gestion d'erreur
        try {
            $sql = "UPDATE articles SET categorie = :newCategorie WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':newCategorie' => $newCategorie,
                ':id' => $article['id']
            ]);
            
            echo "<div style='color: green;'>✅ Article #{$article['id']}: '$oldCategorie' → '$newCategorie'</div>";
        } catch (Exception $e) {
            echo "<div style='color: red;'>❌ Erreur Article #{$article['id']}: " . $e->getMessage() . "</div>";
        }
    }
} else {
    echo "<h3 style='color: green;'>✅ Toutes les catégories sont déjà correctes !</h3>";
}

// 2. Vérifier la structure de la table
echo "<h2>🏗️ Vérification de la structure de la table</h2>";
$sql = "DESCRIBE articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$structure = $stmt->fetchAll();

echo "<h3>Structure actuelle :</h3>";
foreach ($structure as $column) {
    if ($column['Field'] === 'categorie') {
        echo "<div style='color: blue;'><strong>{$column['Field']}</strong>: {$column['Type']}</div>";
    }
}

// 3. Test d'insertion
echo "<h2>🧪 Test d'insertion</h2>";
$test_article = [
    'titre' => 'Article de test',
    'date' => date('d/m/Y'),
    'categorie' => 'Transports',
    'resume' => 'Test de résumé',
    'contenu' => 'Test de contenu',
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

// 4. Instructions finales
echo "<h2>📋 Instructions finales</h2>";
echo "<div style='background: #f0f8ff; padding: 15px; border-radius: 8px;'>";
echo "<h3>🔧 Étape 1 : Corriger api-client.js</h3>";
echo "<p>Dans le fichier <strong>api-client.js</strong>, remplacez toutes les occurrences de <code>this.initialized</code> par <code>this.initialized</code></p>";
echo "<p>Utilisez Ctrl+H pour remplacer tout dans le fichier.</p>";

echo "<h3>🌐 Étape 2 : Tester</h3>";
echo "<p>Après correction, accédez à : <a href='start.html'>start.html</a> et testez la sauvegarde d'articles.</p>";

echo "<h3>🔍 Étape 3 : Vérifier</h3>";
echo "<p>Utilisez la console F12 pour vérifier qu'il n'y a plus d'erreurs JavaScript.</p>";
echo "</div>";

echo "<p><a href='start.html' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>🚀 Retour au site</a></p>";
?>
