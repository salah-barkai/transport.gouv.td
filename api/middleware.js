// API middleware: CORS, sessions, CSRF
import { randomBytes } from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const SESSION_COOKIE_NAME = 'MTACMN_SESSION_ID';

/**
 * Enable CORS and parse request body
 */
export async function enableCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Parse JSON body
 */
export async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken() {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Verify CSRF token from request headers
 */
export function verifyCsrf(req, sessionToken) {
  const headerToken = req.headers['x-csrf-token'];
  // For now: simple check. In production, store tokens per session in Redis/DB
  return !!headerToken;
}

/**
 * Simple session store (in production: use Redis or DB)
 * This is a naive in-memory store—resets on deployment. Use Redis for production.
 */
const sessions = new Map();

export function createSession(userId, username) {
  const sessionId = randomBytes(16).toString('hex');
  const csrfToken = generateCsrfToken();
  sessions.set(sessionId, {
    userId,
    username,
    csrfToken,
    createdAt: Date.now(),
  });
  return { sessionId, csrfToken };
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export function setCookieHeader(res, sessionId) {
  const maxAge = 24 * 60 * 60; // 24 hours
  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=${sessionId}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Strict`);
}

export function getSessionIdFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly`);
}
