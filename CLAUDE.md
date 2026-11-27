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
- yuvik: worlds `en` (sea theme), `ar` (desert theme, Arabic) and `math` (since v74 a normal island map: track `ymx` = queue of client-side Hebrew islands `YMX` (`ymx-1..6`, from her test-prep sheets), one open at a time. The old `YM_STAGES` path is retired by the parent's request — code still in index.html but not shown).
- gil: worlds `en` (tennis theme) and `math` (client-side math islands, `mathFixedIslands`: fractions + geometry `geoIsland` on its own track `geo`).
- ariel: world `en` (shop theme: fashion mall, wallet ₪ from station scores, ₪50 coupon per great island, closet; state in `progress.mall`). Her Drive folders are created by the server on first use (`provision_`).
- shaili: world `en` (dance theme: studio stage, 10 dance levels to 'סופר רקדנית', one outfit item per great island; state in `progress.danceLv`). Server entry `auto:true` like ariel. All subjects, not only English: each lesson JSON for her needs `subject` (e.g. 'אנגלית', 'מדעים', 'היסטוריה'; taken from the upload tag `class-new subject:X`); non-English subjects are Hebrew islands (use `games`). Each subject is its own track on her map. For a general subject build: `text` {title, paras} = summary (read aloud in Hebrew), and `games`: `mc` (questions), `tf`, `pairs` (memory game), `order`. mc/tf items may carry a `hint` (shown by the 💡 button before answering; otherwise the app picks the matching summary paragraph). Add a lesson-level `terms` {term: short kid-friendly explanation} for hard words; the hint explains terms that appear in the question.
  When processing her uploads: same topic as an existing island → add the material to that island (more games/rounds), different topic → new island. Never create duplicate islands; identical uploads (same file/link) are processed once and the extra copies trashed.
If you add or remove a world on purpose, update `EXPECT` in tools/smoke.js in the same commit.

- Lesson options: `howto` (HTML rules box) + `howtoTitle`, `simple:true` (no auto read-aloud stations), `source:'אנסין'` + `order` = queued unseens track. Yuval (from 25/11): old English islands archived in Drive (subfolder 'ארכיון'); new: Present Simple + 11 queued unseens.
- Exam retake islands: lesson `source:'מבחן'`, `exam:{orig:<class score>}`, each game `pts` (sum 100) → grade card. Items can have `why2` (shown when she taps 'לא הבנתי'). Tap-to-translate uses `dict-en-he.json` (add words there when new texts need them).
- Gil: everything outside the English world is Hebrew, incl. speech (math islands `lang:'he'`).
- Conversation lessons (Talking Kids summaries etc.): lesson `source: 'שיחה'` → own track '🗣️ שיחה באנגלית' (all profiles).
- Parent report app: role `viewer` (server `VIEW_KEY` on a child entry; now only shaili). Read-only: client treats it as parent-like (no writes) and shows only `viewParent` via `viewerTopHTML`. 21:00 daily push to viewer devices (`dailyReminder` → `pushSentV:`), text from server `viewerToday_` via sw.js `todayInfo`.

- **Card limit (parent's rule, 26/11): every new island has at most 3–4 cards**, with a big focus box on top (`howto`) listing 1/2/3 what to practice from the last lesson. Use `words:[]` + `terms` (tap-to-translate still works) and `simple:true` to avoid automatic word/read-aloud cards. Exception: exam-retake islands.

## Architecture (short)
- index.html: the whole client. sw.js: network-first cache + push notifications. status.json: update flag/version.
- Backend: Google Apps Script web app (not in this repo; it holds the keys). Lesson content = JSON files in Drive.
- Extra rounds: lesson files with `roundsFor` add more rounds to an island's games (shown after 100%).
- Do not commit keys, Drive IDs of private folders, or the VAPID private key.

## Pitfall
Never write a file with `open(f,'w').write(open(f).read()...)` — the write truncates first and leaves an empty file (this emptied sw.js from v36 to v46). Read into a variable, then write.
