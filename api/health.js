// Health check and database initialization endpoint
import { initializeDatabase } from './db.js';

export default async function handler(req, res) {
  try {
    await initializeDatabase();
    res.status(200).json({ status: 'ok', message: 'Database ready' });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}
