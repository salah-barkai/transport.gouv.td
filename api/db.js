// Database connection and queries for Node.js
import mysql from 'mysql2/promise';

// Connection pool (reuse connections across invocations)
let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'mtacmn',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableTimeoutError: true,
      enableSQLStatementTimeout: true,
      sqlStatementTimeout: 30000,
    });
  }
  return pool;
}

async function query(sql, values = []) {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

// ─── Users ───
export async function getUserByUsername(username) {
  const results = await query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return results[0] || null;
}

export async function getUserById(id) {
  const results = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return results[0] || null;
}

export async function createDefaultUserIfNone(defaultUsername, defaultPassword) {
  const count = await query('SELECT COUNT(*) as cnt FROM users');
  if (count[0].cnt === 0) {
    // Hash password (simple approach; use bcrypt in production)
    const hashedPassword = defaultPassword; // TODO: bcrypt.hash(defaultPassword, 10)
    await query('INSERT INTO users (username, password) VALUES (?, ?)', [defaultUsername, hashedPassword]);
  }
}

// ─── Articles ───
export async function getArticles(filters = {}) {
  let sql = 'SELECT * FROM articles WHERE 1=1';
  const params = [];
  
  if (filters.statut) {
    sql += ' AND statut = ?';
    params.push(filters.statut);
  }
  if (filters.categorie) {
    sql += ' AND categorie = ?';
    params.push(filters.categorie);
  }
  
  sql += ' ORDER BY createdAt DESC';
  
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }
  if (filters.offset) {
    sql += ' OFFSET ?';
    params.push(parseInt(filters.offset));
  }
  
  return await query(sql, params);
}

export async function getArticleById(id) {
  const results = await query('SELECT * FROM articles WHERE id = ? LIMIT 1', [id]);
  return results[0] || null;
}

export async function createArticle(data) {
  const { titre, resume, contenu, categorie, statut = 'Brouillon', imageKey } = data;
  const result = await query(
    'INSERT INTO articles (titre, resume, contenu, categorie, statut, imageKey, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [titre, resume, contenu, categorie, statut, imageKey]
  );
  return { id: result.insertId, ...data, createdAt: new Date(), updatedAt: new Date() };
}

export async function updateArticle(id, data) {
  const { titre, resume, contenu, categorie, statut, imageKey } = data;
  await query(
    'UPDATE articles SET titre = ?, resume = ?, contenu = ?, categorie = ?, statut = ?, imageKey = ?, updatedAt = NOW() WHERE id = ?',
    [titre, resume, contenu, categorie, statut, imageKey, id]
  );
  return await getArticleById(id);
}

export async function deleteArticle(id) {
  await query('DELETE FROM articles WHERE id = ?', [id]);
  return { success: true };
}

// ─── Settings ───
export async function getSetting(key) {
  const results = await query('SELECT value FROM settings WHERE key = ? LIMIT 1', [key]);
  return results[0]?.value || null;
}

export async function getSettings() {
  const results = await query('SELECT key, value FROM settings');
  const settings = {};
  results.forEach(row => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function updateSetting(key, value) {
  // Upsert
  await query('INSERT INTO settings (key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?', [key, value, value]);
  return { success: true };
}

// ─── Initialize database ───
export async function initializeDatabase() {
  try {
    // Check if tables exist; if not, create them
    const tables = await query("SHOW TABLES");
    if (tables.length === 0) {
      console.log('Creating database tables...');
      
      // Users table
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Articles table
      await query(`
        CREATE TABLE IF NOT EXISTS articles (
          id INT PRIMARY KEY AUTO_INCREMENT,
          titre VARCHAR(500) NOT NULL,
          resume TEXT,
          contenu LONGTEXT,
          categorie VARCHAR(100),
          statut VARCHAR(50),
          imageKey VARCHAR(255),
          image VARCHAR(2000),
          une BOOLEAN DEFAULT FALSE,
          vues INT DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Settings table
      await query(`
        CREATE TABLE IF NOT EXISTS settings (
          key VARCHAR(255) PRIMARY KEY,
          value LONGTEXT,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Create default admin user
      await createDefaultUserIfNone(
        process.env.ADMIN_DEFAULT_USERNAME || 'admin',
        process.env.ADMIN_DEFAULT_PASSWORD || 'admin2026'
      );
      
      console.log('✅ Database initialized');
    }
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
}
