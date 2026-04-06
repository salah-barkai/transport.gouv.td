-- Script SQL pour corriger la colonne categorie
-- Exécuter ce script dans phpMyAdmin ou directement via l'API

-- 1. Voir les données actuelles qui causent l'erreur
SELECT id, titre, categorie FROM articles WHERE categorie NOT IN ('Transports', 'Aviation Civile', 'Météorologie');

-- 2. Mettre à jour les catégories invalides (exemple)
UPDATE articles SET categorie = 'Transports' WHERE categorie NOT IN ('Transports', 'Aviation Civile', 'Météorologie');

-- 3. Alternative : Étendre l'ENUM pour inclure plus de catégories
ALTER TABLE articles MODIFY COLUMN categorie ENUM(
    'Transports', 
    'Aviation Civile', 
    'Météorologie',
    'Transport',  -- Alternative sans 's'
    'Aviation',   -- Alternative sans ' Civile'
    'Meteo'      -- Alternative sans 'rologie'
) NOT NULL;
