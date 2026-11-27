const CACHE = 'voyage-v80';
const SHELL = ['./', './index.html', './manifest.webmanifest', './manifest-app.webmanifest', './manifest-gil.webmanifest', './manifest-ariel.webmanifest', './manifest-shaili.webmanifest', './manifest-report.webmanifest', './dict-en-he.json', './icon-shaili-192.png', './icon-shaili-512.png', './icon-ariel-192.png', './icon-ariel-512.png', './manifest-boss.webmanifest', './icon-gil-512.png', './icon-gil-192.png', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

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

// Daily reminder: the server sends an empty push. The text is chosen here by how much she practiced today.
const MSG = {
  done: ['{n}, איזו אלופה! 💪 כבר תרגלת היום יפה מאוד', 'כל הכבוד {n}! 🎉 עבודה מעולה היום', '{n}, את על גל! 🌊 עוד משימה קטנה ואת מסיימת בגדול',
         '{n}, גאים בך! ⭐ ההתמדה שלך עושה פלאים', 'וואו {n}! 🚀 רואים שאת משקיעה', '{n}, את כוכבת! 🌟 עוד קצת ואת שוברת שיאים'],
  some: ['{n}, התחלת מעולה! 💪 עוד משימה או שתיים?', '{n}, יופי שהתחלת היום 🙌 בואי נוסיף עוד קצת', '{n}, את בדרך! 🏃‍♀️ עוד תרגיל קטן ואת באמצע היעד',
         'היי {n} 😊 עוד 5 דקות של תרגול ואת מתקדמת יפה', '{n}, כבר עשית צעד ראשון 👣 בואי נעשה עוד אחד', '{n}, עוד קצת מאמץ ותרגישי כמה זה שווה ⭐'],
  none: ['{n}, יא אלופה! זה הזמן לתרגל קצת... 💪', '{n}, המשימות של היום מחכות לך 😊 בואי נתרגל קצת', 'היי {n}! 📚 יש לך כמה דקות לתרגול?',
         '{n}, עוד לא תרגלת היום 😊 משימה אחת קטנה?', '{n}, 10 דקות של תרגול ואת מסודרת להיום 💪', '{n}, בואי נשמור על הרצף! 🔥 משימה קטנה אחת']
};
function levelOf(j) { if (!j || !j.ok) return 'none'; return j.tasks >= Math.ceil((j.goal || 4) / 2) ? 'done' : j.tasks > 0 ? 'some' : 'none'; }
async function todayInfo() {
  try {
    const c = await caches.open('notif'); const r = await c.match('api'); if (!r) return null;
    const { api, key } = JSON.parse(await r.text()); if (!api || !key) return null;
    const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 6000);
    const res = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, action: 'today' }), signal: ac.signal });
    clearTimeout(t); return await res.json();
  } catch (err) { return null; }
}
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let name = '', icon = './icon-192.png';
    try { const c = await caches.open('notif'); const n = await c.match('name'); if (n) name = await n.text(); const ic = await c.match('icon'); if (ic) icon = await ic.text(); } catch (err) {}
    let role = ''; try { const c = await caches.open('notif'); const r = await c.match('role'); if (r) role = await r.text(); } catch (err) {}
    const j = await todayInfo();
    if (role === 'viewer' && !(j && j.report)) { await self.registration.showNotification('הדוח של ' + (name || 'היום'), { body: 'לחצו כדי לראות מה נעשה היום', icon, badge: icon, tag: 'report', lang: 'he', dir: 'rtl', data: { url: './' } }); return; }
    if (j && j.report) { await self.registration.showNotification(j.title || 'הדוח היומי', { body: j.report, icon, badge: icon, tag: 'report', renotify: true, lang: 'he', dir: 'rtl', data: { url: './' } }); return; }
    const lvl = levelOf(j); const list = MSG[lvl]; let body = list[Math.floor(Math.random() * list.length)];
    body = name ? body.replace(/\{n\}/g, name) : body.replace(/\{n\},?\s*/g, '').replace(/\s*\{n\}/g, '');
    await self.registration.showNotification('לומדים בכיף', { body, icon, badge: icon, tag: 'daily', renotify: true, lang: 'he', dir: 'rtl', data: { url: './' } });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});
