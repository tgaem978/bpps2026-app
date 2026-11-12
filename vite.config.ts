import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  // Portal Kemas Kini: semasa `npm run dev`, /api/* dihantar ke `npm run dev:api` (wrangler dev, port 8787).
  server: { proxy: { '/api': 'http://127.0.0.1:8787' } },
});
