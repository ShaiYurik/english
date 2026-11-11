# Changes

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
