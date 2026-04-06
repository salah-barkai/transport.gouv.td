import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Chemins relatifs : fonctionne à la racine du domaine et dans un sous-dossier (hébergement mutualisé).
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      // Permet d'utiliser l'admin sur :5173 avec backend PHP local.
      '/api.php': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
