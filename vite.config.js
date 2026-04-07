import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { cpSync } from 'node:fs'

// https://vitejs.dev/config/
export default defineConfig({
  // Chemins relatifs : fonctionne à la racine du domaine et dans un sous-dossier (hébergement mutualisé).
  base: './',
  build: {
    rollupOptions: {
      // Génère aussi la page admin en plus du front principal.
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    proxy: {
      // Permet d'utiliser l'admin sur :5173 avec backend PHP local.
      '/api.php': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  // Copie les fichiers statiques legacy dans dist pour Vercel.
  // - database.js est requis par admin.html
  // - image/ contient les photos locales utilisées par le site
  plugins: [
    react(),
    {
      name: 'copy-legacy-static-files',
      closeBundle() {
        try {
          cpSync(resolve(__dirname, 'database.js'), resolve(__dirname, 'dist', 'database.js'))
        } catch {}

        try {
          cpSync(resolve(__dirname, 'runtime-config.js'), resolve(__dirname, 'dist', 'runtime-config.js'))
        } catch {}

        try {
          cpSync(resolve(__dirname, 'image'), resolve(__dirname, 'dist', 'image'), { recursive: true })
        } catch {}
      },
    },
  ],
})
