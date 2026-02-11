
const CACHE_NAME = 'fyc-v1.4-cache';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Caches assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Cleans up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Cache-first falling back to network strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // We want to cache everything from esm.sh to ensure React works offline
  const isEsmSh = event.request.url.includes('esm.sh');
  const isCdn = event.request.url.includes('cdn.tailwindcss.com') || event.request.url.includes('fonts.googleapis.com');

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((networkResponse) => {
          // Cache fonts, scripts, and shell assets dynamically
          if (isEsmSh || isCdn || event.request.mode === 'navigate') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback for navigation requests when offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
