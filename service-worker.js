const CACHE_NAME = 'penitenciaria-static-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/layout.css',
  './css/components.css',
  './css/responsive.css',
  './js/seed-data.js',
  './js/utils.js',
  './js/validation.js',
  './js/storage.js',
  './js/navigation.js',
  './js/dashboard.js',
  './js/expedientes.js',
  './js/seguimiento.js',
  './js/actividades.js',
  './js/usuarios.js',
  './js/app.js',
  './assets/icons/icon.svg',
  './assets/images/placeholder.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS).catch(function (err) {
        console.warn('SW cache addAll error', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_NAME) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Do not cache API or data endpoints; only static navigations/assets.
  const url = new URL(req.url);
  // Limit to same origin
  if (url.origin !== self.location.origin) return;
  // Never cache JSON data files (would expose demonstration data in shared cache)
  if (url.pathname.endsWith('.json') && url.pathname.indexOf('/data/') !== -1) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      const fetchPromise = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, clone); });
        }
        return res;
      }).catch(function () {
        // offline fallback
        if (req.destination === 'document') {
          return caches.match('./index.html');
        }
        return cached;
      });
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});