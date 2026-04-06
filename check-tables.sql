-- Vérifier si les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('articles', 'settings', 'users', 'article_logs')
ORDER BY table_name;
