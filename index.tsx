import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register the service worker from the root.
    // The server is configured to serve this file explicitly from the 'dist' folder or 'server/public' fallback.
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((registrationError) => {
        console.error('SW registration failed:', registrationError);
      });
  });
}