const CACHE = 'entries-v3';
const ASSETS = [
    './',
    './config/app_config.json',
    './config/report_config.json',
    './config/user_config.json',
    './js/theme.js',
    './ui/confirm_dialog.js',
    './ui/theme_button.js',
    './index.html',
    './manifest.json',
    './icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET')
      return;

  event.respondWith(
    fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(event.request, copy));
      return res;
    }).catch(() => caches.match(event.request))
  );
});
