// Settings endpoint
import { enableCors, parseBody, getSession, getSessionIdFromCookie } from './middleware.js';
import { getSettings, updateSetting } from './db.js';

function requireAuth(req, res) {
  const sessionId = getSessionIdFromCookie(req);
  const session = sessionId ? getSession(sessionId) : null;
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}

export default async function handler(req, res) {
  // Enable CORS
  if (enableCors(req, res)) return;

  const method = req.method.toUpperCase();

  try {
    if (method === 'GET') {
      // Get all settings (public)
      const settings = await getSettings();
      res.status(200).json(settings);
    } else if (method === 'PUT') {
      // Update setting (requires auth)
      const session = requireAuth(req, res);
      if (!session) return;

      const body = await parseBody(req);
      const { key, value } = body;

      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value required' });
      }

      await updateSetting(key, value);
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Settings error:', err);
    res.status(500).json({ error: err.message });
  }
}
