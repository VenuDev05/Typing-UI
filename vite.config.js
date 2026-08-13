import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies /api calls to the Express backend so the
// frontend can call fetch('/api/...') without CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
