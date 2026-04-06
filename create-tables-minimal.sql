-- Création des tables de base pour MTACMN

-- Table articles
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    titre TEXT NOT NULL,
    date TEXT NOT NULL,
    categorie TEXT NOT NULL,
    resume TEXT NOT NULL,
    contenu TEXT,
    image TEXT,
    imageKey TEXT,
    une BOOLEAN DEFAULT FALSE,
    statut TEXT DEFAULT 'Brouillon',
    vues BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table settings
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'Editeur',
    actif BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer des données de test
INSERT INTO settings (key, value) VALUES
('siteName', 'Ministère des Transports, de l''Aviation Civile et de la Météorologie Nationale'),
('email', 'contact@transports.gouv.td'),
('telephone', '+235 22 51 44 92')
ON CONFLICT (key) DO NOTHING;

INSERT INTO articles (titre, date, categorie, resume, statut) VALUES
('Test Article 1', '30 mars 2026', 'Transports', 'Article de test pour vérifier la connexion Supabase', 'Publié'),
('Test Article 2', '30 mars 2026', 'Aviation Civile', 'Deuxième article de test', 'Publié')
ON CONFLICT DO NOTHING;
