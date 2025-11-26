import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Trust Google Cloud Proxy (Critical for HTTPS origin matching)
app.set('trust proxy', true);

// Use process.cwd() to reliably find the dist folder in containerized environments
const distPath = path.join(process.cwd(), 'dist');
// Update fallback to the new specific folder structure: /server/public
const publicPath = path.join(process.cwd(), 'server', 'public');

console.log(`Serving static files from: ${distPath}`);
console.log(`Fallback static files from: ${publicPath}`);

// CRITICAL: Explicitly serve service-worker.js to ensure correct headers and avoid
// "Script origin does not match" errors caused by redirects or wrong MIME types.
app.get('/service-worker.js', (req, res) => {
  const distSW = path.join(distPath, 'service-worker.js');
  const publicSW = path.join(publicPath, 'service-worker.js');
  
  const headers = {
    'Content-Type': 'application/javascript',
    'Service-Worker-Allowed': '/',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  // Try serving from dist (build output) first
  res.sendFile(distSW, { headers }, (err) => {
    if (err) {
      console.log('SW not found in dist, trying server/public fallback...');
      // Fallback to source file if build failed to copy
      res.sendFile(publicSW, { headers }, (err2) => {
        if (err2) {
          console.error('Service Worker not found in either location');
          res.status(404).send('Service Worker not found');
        }
      });
    }
  });
});

// Serve static assets from 'dist'
app.use(express.static(distPath));

// Fallback static assets from 'server/public'
app.use(express.static(publicPath));

// SPA Fallback: Serve index.html for non-asset requests
app.get('*', (req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        console.error("Dist index.html not found, trying root...");
        res.sendFile(path.join(process.cwd(), 'index.html'), (err2) => {
            if (err2) {
                console.error("Failed to serve index.html:", err2);
                res.status(500).send("Server Error");
            }
        });
      }
    });
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});