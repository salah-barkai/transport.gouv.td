// Authentication endpoint
import { enableCors, parseBody, createSession, getSession, deleteSession, setCookieHeader, getSessionIdFromCookie, clearSessionCookie } from './middleware.js';
import { getUserByUsername, getUserById } from './db.js';

export default async function handler(req, res) {
  // Enable CORS
  if (enableCors(req, res)) return;

  const method = req.method.toUpperCase();
  const path = req.url.split('?')[0];

  try {
    if (path === '/api/auth' && method === 'POST') {
      // Login
      const body = await parseBody(req);
      const { username, password } = body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
      }

      const user = await getUserByUsername(username);
      if (!user || user.password !== password) { // TODO: use bcrypt.compare
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const { sessionId, csrfToken } = createSession(user.id, user.username);
      setCookieHeader(res, sessionId);

      res.status(200).json({
        success: true,
        csrf_token: csrfToken,
        user: { id: user.id, username: user.username },
      });
    } else if (path === '/api/auth/status' && method === 'GET') {
      // Check auth status
      const sessionId = getSessionIdFromCookie(req);
      const session = sessionId ? getSession(sessionId) : null;

      if (!session) {
        return res.status(200).json({ authenticated: false });
      }

      const user = await getUserById(session.userId);
      res.status(200).json({
        authenticated: true,
        user: { id: user.id, username: user.username },
      });
    } else if (path === '/api/auth/logout' && method === 'GET') {
      // Logout
      const sessionId = getSessionIdFromCookie(req);
      if (sessionId) {
        deleteSession(sessionId);
      }
      clearSessionCookie(res);

      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: err.message });
  }
}
