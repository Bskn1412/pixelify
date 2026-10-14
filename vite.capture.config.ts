/**
 * Throwaway Vite config used ONLY by scripts/capture-blog-images.mjs.
 * Mirrors the project config but uses an isolated dep-optimization cache
 * (node_modules/.vite-capture) so it never disturbs a user-run dev server
 * that may be sharing node_modules/.vite.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  cacheDir: 'node_modules/.vite-capture',
  server: {
    port: 3100,
    strictPort: true,
  },
});
