const CACHE_NAME = 'topbarber-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pwa-icon.png',
  '/assets/logo.PNG'
];

// Install Event - Pre-cache minimal shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass cache for Supabase API requests to ensure real-time data
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Handle local and third-party static assets
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback if network fails
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
