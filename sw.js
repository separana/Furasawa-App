
self.addEventListener('install', e => {
  e.waitUntil(caches.open('furusawa').then(cache => cache.addAll(['index.html','manifest.json','data/furusawa_jp.json'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
