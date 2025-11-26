import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Safely expose environment variables to the client
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'service-worker.js', // Match the server.js routing

      // Manifest Configuration
      manifest: {
        name: 'Rick Beacham Portfolio',
        short_name: 'RBeacham',
        description: 'High-Performance Portfolio PWA.',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      // Runtime Caching for Google Fonts
      workbox: {
        runtimeCaching: [
          {
            // Cache Google Fonts Stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache Google Fonts Files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200], // 0 covers opaque responses (CORS)
              },
            },
          },
        ],
      },
    }),
  ],
  // Explicitly point to the server/public directory for static assets
  publicDir: 'server/public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});