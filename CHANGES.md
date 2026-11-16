# Changes

- v43 (2026-11-16): Yuval math, island 2 levels 3–4 made easier: smaller numbers, a 'before we start' worked-example card, and guided step-by-step solving (subtraction: opposite → same/different signs → distance → sign; missing number: choose the inverse exercise → compute) for the first 2 correct answers, then solo. Generic `learn` and `guide()` support per level.
- v42 (2026-11-16): FIX lost math progress. The math world used its own outbox/cache namespace while sharing the English server state, so switching worlds could overwrite progress. Math now shares the English namespace; loading merges progress instead of replacing it (ym, mall and other device-only keys are kept); Yuval's math progress self-heals from the session log; stale math outbox entries are dropped.
- v41 (2026-11-15): Hebrew islands get their own 'עברית' track on the map (they were queued behind the two open class islands); map layout supports 4+ tracks.
- v40 (2026-11-15): lesson files can set `"lang":"he"` for a Hebrew island (RTL text, Hebrew font, no English speech).
- v39 (2026-11-14): Yuval's math practice celebrates success: varied praise, streak messages (3/5/8 in a row), confetti bursts, level-complete and island-conquered banners, end screen with stars, record streak and next-boat hint.
- v38 (2026-11-14): parent can try Yuval's math world (test banner, intro and boat pop-ups shown, nothing saved).
- v37 (2026-11-14): Yuval's math world gets a boat path: starts on a raft, every conquered island upgrades the boat (10 vessels), super yacht only after all 8 islands + the mixed test at 80%+; intro story, upgrade pop-ups, fleet view, boat card on the map (`progress.ym.boat`, `progress.ym.intro`).
- v36 (2026-11-14): Yuval's math path is drawn as an island map (each stage an island to conquer, boat at the current one, level dots, flag when done); day plan folded below.
- v35 (2026-11-14): Yuval gets a math world: a path to the 18.11 test (8 stages + mixed test + smart review), each stage one practice card with levels, keypad answers, hints, full solutions and mistake-type diagnosis; plan by day; parent card with progress and mistake types.
- v34 (2026-11-12): Ariel's theme changed from bakery to a fashion mall: stores on the map, a wallet (₪ earned from station scores), a ₪50 coupon for every island finished at 85%+, a shop with 8 stores and a closet of bought items (`progress.mall`). New shopping-bag icon.
- v33 (2026-11-11): a game can carry `help` (a "💡 מה עושים כאן?" box above the questions, open on the first question); `fill` items show `why`.
- v32 (2026-11-11): new profile Ariel (grade 9, bakery theme, croissant icon, manifest-ariel). Lessons can hold several unseen texts (`stories`), each its own station, with `why` shown after checking. 2 class islands open at once for Ariel.
- v31 (2026-11-07): smart reminder text: the service worker asks the server how many tasks she did today (action `today`) and picks a random message: praise (≥ half the goal), a small push (some), or "time to practice" (none). Server: push permission granted, duplicate subscriptions per phone removed.
- v30 (2026-11-07): reading-with-teacher no longer paints words ahead of the reader red (alignment can't jump >3 words ahead); removed the "תרגום מילים" button (tapping a word already translates); reminder card hides right after enabling; test shows push error codes.
- v29 (2026-11-07): Gil daily story track (📖 סיפור יומי): one part a day from a Drive lesson file with `dailyStory`, tap a word for its Hebrew meaning, "תרגום מילים" list, comprehension questions; counts as a task.
- v28 (2026-11-07): safe deploys via git (this file, CLAUDE.md, tools/smoke.js); "the app is updating" banner and
  automatic refresh to a new version when not in the middle of an exercise (status.json); daily push reminder
  Sun–Thu 18:00 ("<name>, יא אלופה! זה הזמן לתרגל קצת... 💪"), enable button for the girls, test button in Boss.
- v27 (2026-11-07): restored Gil's math world and the single "attach file" upload button (overwritten by v25).
- v25 (2026-11-07): coach report shows today only (best shown as "שיא"); extra rounds after 100%.
- 2026-11-06 (other session): Gil math world (fractions / mixed numbers); upload screen single button.
- v24 (2026-11-04): odd-one-out explanations; memory game = 100% on completion.
- v23 (2026-11-04): daily goal by tasks; Gil two courts + replay court; themed headings.
- v22 (2026-11-03): reads via POST with GET fallback, auto-reconnect, connection test.
