// Post-deploy smoke test for the LIVE site (or a local URL).
// Usage: NODE_PATH=$(npm root -g) node tools/smoke.js [baseUrl]
// The backend is mocked, so no real keys are needed. Fails (exit 1) if a world or the map is missing.
const { chromium } = require('playwright');
const BASE = (process.argv[2] || 'https://shaiyurik.github.io/english/').replace(/\/?$/, '/');
const lesson = { id: 'smoke', name: 'בדיקה', source: 'כיתה', created: '2026-01-01', words: [{ en: 'cat', he: 'חתול' }, { en: 'dog', he: 'כלב' }, { en: 'sun', he: 'שמש' }, { en: 'sea', he: 'ים' }], games: [{ kind: 'pairs', title: 'זיכרון', pairs: [['cat', 'חתול'], ['dog', 'כלב']] }] };
const prof = {
  yuvik: { child: 'yuvik', name: 'יוביק', grade: 'ז׳', features: { zoom: true, cal: true, camera: true, readtext: true }, world: 'en', worlds: [{ id: 'en', label: 'אנגלית' }, { id: 'ar', label: 'ערבית' }] },
  gil: { child: 'gil', name: 'גיל', grade: 'ה׳', features: { zoom: false, cal: true, camera: true, readtext: true }, world: 'en', worlds: [{ id: 'en', label: 'אנגלית' }] }
};
// what each girl must have. Update this list when a world is added or removed on purpose.
const EXPECT = { yuvik: ['en', 'ar'], gil: ['en', 'math'] };
(async () => {
  const b = await chromium.launch(); let fail = 0;
  const status = await (await fetch(BASE + 'status.json?t=' + Date.now())).json().catch(() => null);
  const html = await (await fetch(BASE + 'index.html?t=' + Date.now())).text();
  const ver = (html.match(/APP_VERSION='([^']+)'/) || [])[1];
  console.log('version index=' + ver + ' status=' + (status && status.version) + ' updating=' + (status && status.updating));
  if (!status || String(status.version) !== ver) { console.log('FAIL: status.json version does not match index.html'); fail++; }
  for (const kid of ['yuvik', 'gil']) {
    for (const w of EXPECT[kid]) {
      const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, serviceWorkers: 'block' });
      await ctx.addInitScript(([k, w]) => { localStorage.setItem('voy:world:' + k, JSON.stringify(w)); }, [kid, w]);
      const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
      const body = JSON.stringify({ ok: true, role: 'child', profile: { ...prof[kid], world: w === 'ar' ? 'ar' : 'en' }, state: { progress: { xp: 1, best: {}, unlocked: 1, fleetIntro: 1, caravanIntro: 1 }, classwords: [], zoom: [], sessions: [], lessons: [lesson], pendingPhotos: 0 } });
      await page.route('https://script.google.com/**', r => r.fulfill({ contentType: 'application/json', body: r.request().method() === 'GET' || JSON.parse(r.request().postData()).action === 'load' ? body : '{"ok":true}' }));
      await page.route('**/status.json*', r => r.fulfill({ contentType: 'application/json', body: '{"updating":false}' }));
      await page.goto(BASE + 'index.html#k=SMOKE-' + kid); await page.waitForTimeout(2500);
      const r = await page.evaluate(() => ({ world: WORLD, worlds: (typeof worldsOf === 'function' ? worldsOf() : (S.profile.worlds || [])).map(x => x.id), isl: document.querySelectorAll('g.isl').length }));
      const ok = r.world === w && EXPECT[kid].every(x => r.worlds.includes(x)) && r.isl > 0 && !errors.length;
      console.log((ok ? 'OK  ' : 'FAIL') + ` ${kid}/${w}: world=${r.world} worlds=${r.worlds} islands=${r.isl} errors=${JSON.stringify(errors)}`);
      if (!ok) fail++; await ctx.close();
    }
  }
  await b.close(); process.exit(fail ? 1 : 0);
})();
