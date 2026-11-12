# לומדים בכיף — rules for any session that changes this app

This repo is the live app (GitHub Pages: https://shaiyurik.github.io/english/). Two daughters use it every day.
More than one conversation may work on it, so **never overwrite someone else's work**.

## Deploying (mandatory)
1. `git pull --rebase` **before** editing and again before pushing. Never upload files through the GitHub web UI
   (that replaces whole files and silently drops other sessions' changes — this already deleted Gil's math world once).
2. Make the change. Bump the version in **three** places together: `APP_VERSION` in index.html, `CACHE` in sw.js,
   and `"version"` in status.json.
3. Run the local tests, then `NODE_PATH=$(npm root -g) node tools/smoke.js http://localhost:PORT/` against a local copy.
4. Commit with a clear message, add a line to CHANGES.md, `git push`.
5. ~1 minute later check the live site: `node tools/smoke.js` (if this machine can reach github.io), otherwise fetch
   index.html / sw.js / status.json through the browser and compare their SHA-256 with the committed files.
   If anything is wrong, `git revert` and push immediately.
6. If the change needs the Apps Script server too: first push status.json with `"updating": true`
   (the app shows "האפליקציה מתעדכנת"), deploy the server, then push the client with `"updating": false`.

## What must always exist (tools/smoke.js checks it)
- yuvik: worlds `en` (sea theme) and `ar` (desert theme, Arabic).
- gil: worlds `en` (tennis theme) and `math` (client-side math islands, `mathFixedIslands`).
- ariel: world `en` (shop theme: fashion mall, wallet ₪ from station scores, ₪50 coupon per great island, closet; state in `progress.mall`). Her Drive folders are created by the server on first use (`provision_`).
If you add or remove a world on purpose, update `EXPECT` in tools/smoke.js in the same commit.

## Architecture (short)
- index.html: the whole client. sw.js: network-first cache + push notifications. status.json: update flag/version.
- Backend: Google Apps Script web app (not in this repo; it holds the keys). Lesson content = JSON files in Drive.
- Extra rounds: lesson files with `roundsFor` add more rounds to an island's games (shown after 100%).
- Do not commit keys, Drive IDs of private folders, or the VAPID private key.
