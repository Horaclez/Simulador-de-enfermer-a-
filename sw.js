// Service worker: guarda la app para usarla sin conexión.
// Cuando cambies index.html, sube el número de VERSION para que los usuarios reciban la actualización.
const VERSION = 'sim-enfermeria-v1';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const copia = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); return res;
  }).catch(() => caches.match('./index.html'))));
});
