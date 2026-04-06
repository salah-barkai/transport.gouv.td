-- Vérifier les données dans les tables
SELECT 'articles' as table_name, COUNT(*) as count FROM articles
UNION ALL
SELECT 'settings' as table_name, COUNT(*) as count FROM settings
UNION ALL  
SELECT 'users' as table_name, COUNT(*) as count FROM users
ORDER BY table_name;
