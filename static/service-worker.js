const CACHE_NAME = 'noctutrack-v1';
const urlsToCache = [
  '/',
  '/static/css/styles.css',
  '/static/js/script.js',
  '/static/img/icon-192x192.png',
  '/static/img/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
