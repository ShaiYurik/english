const CACHE = 'voyage-v30';
const SHELL = ['./', './index.html', './manifest.webmanifest', './manifest-gil.webmanifest', './manifest-boss.webmanifest', './icon-gil-512.png', './icon-gil-192.png', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== 'notif').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first for same-origin GETs; fall back to cache when offline. Never touch the backend.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('/status.json')) return;   // always live
  e.respondWith(
    fetch(req, { cache: 'no-store' }).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});

// Daily reminder: the server sends an empty push; the text is built here.
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let name = '', icon = './icon-192.png';
    try { const c = await caches.open('notif'); const n = await c.match('name'); if (n) name = await n.text(); const ic = await c.match('icon'); if (ic) icon = await ic.text(); } catch (err) {}
    await self.registration.showNotification('לומדים בכיף', {
      body: (name ? name + ', ' : '') + 'יא אלופה! זה הזמן לתרגל קצת... 💪',
      icon, badge: icon, tag: 'daily', renotify: true, lang: 'he', dir: 'rtl', data: { url: './' }
    });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});
