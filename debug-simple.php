<?php
echo "<h2>Debug Simple</h2>";

// Test 1: PHP fonctionne
echo "<p>✅ PHP fonctionne</p>";

// Test 2: Fichier config accessible
if (file_exists('config.php')) {
    echo "<p>✅ config.php trouvé</p>";
    require_once 'config.php';
    echo "<p>✅ config.php chargé</p>";
    echo "<p>DB_NAME: " . DB_NAME . "</p>";
    echo "<p>DB_USER: " . DB_USER . "</p>";
} else {
    echo "<p>❌ config.php NON trouvé</p>";
}

// Test 3: Extension MySQL
if (extension_loaded('pdo_mysql')) {
    echo "<p>✅ PDO MySQL disponible</p>";
} else {
    echo "<p>❌ PDO MySQL NON disponible</p>";
}

// Test 4: Connexion base
try {
    require_once 'config.php';
    $pdo = new PDO("mysql:host=localhost;dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
    echo "<p>✅ Connexion MySQL réussie</p>";
} catch (Exception $e) {
    echo "<p>❌ Erreur MySQL: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><a href='index-n0c.html'>Tester le site</a></p>";
?>
