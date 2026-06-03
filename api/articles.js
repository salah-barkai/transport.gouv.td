// Articles endpoint
import { enableCors, parseBody, getSession, getSessionIdFromCookie } from './middleware.js';
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from './db.js';

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
  const pathMatch = req.url.match(/^\/api\/articles(?:\/(\d+))?/);
  const id = pathMatch?.[1];

  try {
    if (!pathMatch) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (method === 'GET') {
      // Get articles (public)
      const url = new URL(req.url, 'http://localhost');
      const filters = {
        statut: url.searchParams.get('statut') || undefined,
        categorie: url.searchParams.get('categorie') || undefined,
        limit: url.searchParams.get('limit') || undefined,
        offset: url.searchParams.get('offset') || undefined,
      };

      if (id) {
        const article = await getArticleById(id);
        if (!article) {
          return res.status(404).json({ error: 'Article not found' });
        }
        return res.status(200).json(article);
      }

      const articles = await getArticles(filters);
      res.status(200).json(articles);
    } else if (method === 'POST' && !id) {
      // Create article (requires auth)
      const session = requireAuth(req, res);
      if (!session) return;

      const body = await parseBody(req);
      const article = await createArticle(body);
      res.status(201).json({ success: true, article });
    } else if (method === 'PUT' && id) {
      // Update article (requires auth)
      const session = requireAuth(req, res);
      if (!session) return;

      const body = await parseBody(req);
      const article = await updateArticle(id, body);
      res.status(200).json({ success: true, article });
    } else if (method === 'DELETE' && id) {
      // Delete article (requires auth)
      const session = requireAuth(req, res);
      if (!session) return;

      await deleteArticle(id);
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Articles error:', err);
    res.status(500).json({ error: err.message });
  }
}
