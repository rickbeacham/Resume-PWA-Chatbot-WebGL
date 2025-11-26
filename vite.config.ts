import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Explicitly point to the server/public directory for static assets.
  // Vite will copy files from 'server/public' (like service-worker.js) to the root of 'dist/' during build.
  publicDir: 'server/public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});