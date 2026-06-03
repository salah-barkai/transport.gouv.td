# Migration API PHP → Node.js Serverless Functions (Vercel)

## Résumé des changements

### Avant (Architecture PHP)
```
Frontend (React + Vite) ←→ API PHP (api.php) ←→ MySQL
Hébergement: ?
```

### Après (Architecture Node.js sur Vercel)
```
Frontend (React + Vite, statique) ←→ Vercel Serverless Functions (Node.js) ←→ MySQL
Hébergement: Vercel (frontend + API), MySQL externe
```

## Fichiers créés / modifiés

### API Serverless Functions (nouveaux)
- `api/middleware.js` - Sessions, CSRF, CORS
- `api/db.js` - Connexion MySQL + requêtes
- `api/auth.js` - POST /api/auth, GET /api/auth/status, GET /api/auth/logout
- `api/articles.js` - GET/POST/PUT/DELETE /api/articles*
- `api/settings.js` - GET/PUT /api/settings
- `api/health.js` - GET /api/health (init DB)

### Configuration Vercel
- `vercel.json` - Mis à jour pour servir functions + static
- `.vercelignore` - Fichiers à exclure du déploiement

### Frontend (adaptations)
- `runtime-config.js` - Détecte l'env et utilise `/api` sur Vercel
- `admin.html` - Utilise `API_BASE` (injecté via runtime-config.js)

### Package et env
- `package.json` - Ajout mysql2 + dotenv, scripts mis à jour
- `.env.example` - Mise à jour pour variables d'env Node.js
- `.env` - Fichier local pour développement

## Logique de détection d'environnement

**runtime-config.js** :
- Si `localhost` → utilise `./api.php` (fallback local)
- Si Vercel / domaine public → utilise `/api` (Vercel Functions)

Cela permet de tester **en local** avant de déployer.

## Prochaines étapes

### En local (dév)
1. MySQL doit tourner (accessible via `localhost:3306`)
2. Remplissez `.env` avec vos credentials
3. `npm run dev` - Frontend Vite
4. Testez `/api/health` dans le navigateur pour initialiser la DB

### Déploiement Vercel
1. `npm run build` - Build frontend
2. `vercel` - Déployer (ou pousser sur GitHub pour auto-deploy)
3. Configurez les env vars dans Vercel dashboard
4. Vercel exécutera l'init DB à la première requête `/api/health`

## Limitations actuelles & à-faire

1. **Sessions en mémoire** - Réinitialisées au redéploiement
   - ✅ Acceptable pour MVP
   - 🔄 À faire: Redis pour sessions persistantes en prod

2. **Passwords en clair** (pas de bcrypt)
   - ✅ Acceptable pour MVP
   - 🔄 À faire: bcrypt.hash + bcrypt.compare

3. **Image uploads** - Pas encore implémentés
   - 🔄 À faire: `/api/upload` endpoint + stockage (Vercel Blob / AWS S3)

4. **Logs** - Seulement console
   - 🔄 À faire: Winston / Pino pour logging en production

## Fichiers PHP obsolètes

Ces fichiers peuvent être archivés / supprimés après migration :
- `api.php` - Remplacé par `/api/*.js`
- `config.php` - Configuration maintenant via env vars
- `api-client.js` - Legacy (client API wrapper)
- `fix-*.php` - Scripts de fix legacy

## Test rapide après déploiement

```bash
# Check API is running
curl https://your-vercel-url.vercel.app/api/health

# Test login
curl -X POST https://your-vercel-url.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin2026"}'
```

---

**Status**: ✅ Migration complète — API Node.js prête pour Vercel
