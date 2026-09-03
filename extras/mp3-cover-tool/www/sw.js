// Minimaler Service Worker: cached nur die App-Shell (eigene Dateien),
// lässt alles andere (iTunes API) normal durchs Netz laufen.
// Dadurch funktioniert das Tool auch offline, aber Cover-Suche/-Download
// braucht weiterhin eine aktive Internetverbindung.

const CACHE_NAME = 'mp3-cover-tool-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './vendor/jszip.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Nur eigene, same-origin Assets aus dem Cache bedienen (cache-first).
  // Alles Cross-Origin (iTunes API) unangetastet ans Netz weiterreichen.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
