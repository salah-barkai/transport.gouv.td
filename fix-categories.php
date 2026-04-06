<?php
// Script de correction des catégories d'articles
// Placez ce fichier dans votre projet et accédez-y via http://127.0.0.1:8000/fix-categories.php

require_once 'api.php';

// Connexion à la base
$database = new Database();
$db = $database->getConnection();

echo "<h2>🔧 Correction des catégories d'articles</h2>";

// 1. Voir les catégories problématiques
echo "<h3>📊 Catégories actuelles</h3>";
$sql = "SELECT id, titre, categorie FROM articles";
$stmt = $db->prepare($sql);
$stmt->execute();
$articles = $stmt->fetchAll();

$problematic = [];
foreach ($articles as $article) {
    $categorie = $article['categorie'];
    echo "<div>Article #{$article['id']}: '{$categorie}'</div>";
    
    if (!in_array($categorie, ['Transports', 'Aviation Civile', 'Météorologie'])) {
        $problematic[] = $article;
    }
}

// 2. Corriger les catégories problématiques
if (!empty($problematic)) {
    echo "<h3>🔨 Correction des catégories invalides</h3>";
    
    foreach ($problematic as $article) {
        $oldCategorie = $article['categorie'];
        $newCategorie = '';
        
        // Logique de correction
        if (stripos($oldCategorie, 'transport') !== false) {
            $newCategorie = 'Transports';
        } elseif (stripos($oldCategorie, 'aviation') !== false) {
            $newCategorie = 'Aviation Civile';
        } elseif (stripos($oldCategorie, 'meteo') !== false) {
            $newCategorie = 'Météorologie';
        } else {
            $newCategorie = 'Transports'; // Par défaut
        }
        
        // Mettre à jour
        $sql = "UPDATE articles SET categorie = :newCategorie WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':newCategorie' => $newCategorie,
            ':id' => $article['id']
        ]);
        
        echo "<div>✅ Article #{$article['id']}: '{$oldCategorie}' → '{$newCategorie}'</div>";
    }
    
    echo "<h3>✅ Correction terminée !</h3>";
} else {
    echo "<h3>✅ Toutes les catégories sont correctes !</h3>";
}

// 3. Afficher le résultat final
echo "<h3>📋 État final</h3>";
$sql = "SELECT categorie, COUNT(*) as count FROM articles GROUP BY categorie";
$stmt = $db->prepare($sql);
$stmt->execute();
$results = $stmt->fetchAll();

foreach ($results as $row) {
    echo "<div>{$row['categorie']}: {$row['count']} articles</div>";
}

echo "<p><a href='start.html'>🚀 Retour au site</a></p>";
?>
