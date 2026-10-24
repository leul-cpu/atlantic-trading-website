const CACHE_NAME = 'atlantic-v1.0.0';
const STATIC_ASSETS = [
  './',
  'index.html',
  'index.css?v=11',
  'app.js?v=11',
  'assets/logo.webp',
  'assets/atlantic.webp',
  'assets/fonts/fonts.css',
  'assets/fonts/inter-400-normal.woff2',
  'assets/fonts/playfair-display-700-normal.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and analytics
  if (event.request.method !== 'GET') return;
  if (url.origin.includes('google-analytics') || url.origin.includes('googletagmanager')) return;

  // 1. Navigation requests (HTML): Stale-While-Revalidate with network fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then(res => res || caches.match('index.html')))
    );
    return;
  }

  // 2. Product and Category JSON: Stale-While-Revalidate
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Static assets (images, fonts, CSS, JS): Cache-First
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse.ok && (url.pathname.startsWith('/assets') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.webp'))) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});
