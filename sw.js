// sw.js — netwerk-first voor icons en data, simpele cache voor de rest
const CACHE = 'furusawa-v3';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// icons/ en data/ NOOIT uit cache: altijd live van het netwerk
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('/icons/') || url.pathname.includes('/data/')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Overige assets: cache-first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
      return resp;
    }))
  );
});
