# ESOL Beginner 2 — Build Progress & Handoff

Last updated: 2026-10-27. The app is **partly built and does not compile yet** (missing files listed below).
To continue in a new Claude Code session: "Read docs/PROGRESS.md and docs/Adult_ESOL_Unit2_EF_LLM_Brief.md, then continue building."

## The request (from the user)

- React web app bundled with **Parcel**, deployable to a **public GitHub Pages** site, plus a local version for testing.
- App name: **ESOL Beginner 2**. Adult ESOL class (mostly Spanish speakers; 1 Portuguese, 1 French, 1 Farsi — the Farsi speaker needs the most support).
- Modular: a **tab per week**, interactive activities, ESL games ("CPA ESL games" — still need to ask what "CPA" means), all easy to add to.
- **Wednesday only** (Monday = learning, Wednesday = doing/saying). No Monday tabs.
- Each week tab, in this order:
  1. Collapsible **"PowerPoint"** section — slide files the user drops into a folder.
  2. **Interactive activities** (main section).
  3. **Practical use cases** (work / daily life).
  4. **"THE GOOD NEWS"** — Bible verse of the week + a couple of animated GIFs.
- Weeks and verses:
  - Wed 10/28 (week of 10/26) — John 15:5 — **full content for this one first (class is 10/28)**
  - Wed 11/4 (week of 11/2) — Philippians 4:6-7
  - Wed 11/11 — Psalm 107:1
  - Wed 11/18 (user wrote 11/16, which is a Monday) — Psalm 100:4-5
- Source for 10/28: `Temp PPT.pptx.pdf` (Unit 2 Lesson E&F Wednesday slides) and `docs/Adult_ESOL_Unit2_EF_LLM_Brief.md`.
  **The PDF is not in the repo** — add it to `static/powerpoints/2026-10-28/` (also the .pptx if wanted). The answer keys from it are copied below so work can continue without it.

## Done

| File | What it is |
|---|---|
| `package.json` | Parcel 2.12.0, React 18.3.1, `parcel-reporter-static-files-copy` 1.5.3. Scripts: `start` (localhost:1234), `build` (`--public-url ./` for Pages), `preview`, `clean`. |
| `.parcelrc` | Adds the static-files-copy reporter (copies `static/` → `dist/`). |
| `src/index.html`, `src/index.jsx`, `src/App.jsx` | Shell: header, week tabs + Games tab, hash routing (`#/2026-10-28`, `#/games`). Defaults to `defaultWeekId()` from `src/weeks`. |
| `src/lib/useHashRoute.js` | Hash router (no server rewrites needed on Pages). |
| `src/lib/speech.js` | `speak(text)` via browser speechSynthesis, `canSpeak`. |
| `src/lib/cues.js` | `CUES` (English + Farsi procedural cues, verbatim from the brief) and `GLOSSARY.location` / `GLOSSARY.demonstratives`. |
| `src/lib/objects.js` | `OBJECTS` (id → one/many/emoji/alwaysPlural), `getObject`, `shuffle`, `pick`. |
| `src/components/Collapsible.jsx` | Generic collapsible section. |
| `src/components/WeekPage.jsx` | Renders the 4 sections in order. Reads `week.powerpoint`, `week.activities`, `week.practical.{intro,activities}`, `week.goodNews`, `week.goals`. |
| `src/components/ActivityCard.jsx` | Collapsible card per activity; looks up `ACTIVITY_TYPES[activity.type]` from `src/activities/index.js`; shows `title`, `skill`, `source`, `instructions`, TaskHelp (`cues`, `glossary`). |
| `src/components/PowerPointSection.jsx` | Lists `week.powerpoint.files` from `powerpoints/<weekId>/`. PDF → iframe embed. PPTX → download; embed via Office Online viewer only when not on localhost. |
| `src/components/GoodNews.jsx` | Verse card (`reference`, `version`, `text` lines), `keyWords`, `translations` (`{lang,label,reference,text,rtl}`), `gifs` (`{src,alt,caption}`). |
| `src/components/SpeakButton.jsx`, `TaskHelp.jsx` | 🔊 button; "What do I do? · راهنما" Farsi cue panel. |
| `src/activities/shared.jsx` | `Stepper`, `Feedback`, `Score`, `Table`. |
| `src/activities/SentenceBuilder.jsx` | Tap chunks in order to unscramble. Props: `items: [{chunks, answer}]`, `hint: [..]`. |
| `src/activities/MultipleChoice.jsx` | Props: `items: [{question}|{lines with '___'}, options, answer]`, optional `context` (sentences) and `table` (`{caption, columns, rows}`). |
| `src/activities/CapitalFix.jsx` | Tap word to capitalize, tap end to add period. Props: `items: ['the books are in the cabinet', ...]`. |
| `src/activities/Scene.jsx` | SVG furniture scene. `FURNITURE` types: table, desk, chair, shelf, cabinet, drawer, box, bag, wall (each lists supported `slots`: in/on/under). `<Scene furniture place emoji count label />`. |
| `docs/Adult_ESOL_Unit2_EF_LLM_Brief.md` | The lesson brief. |
| `static/powerpoints/<weekId>/` | Folders for slides (2026-10-28, 2026-11-04, 2026-11-11, 2026-11-18). |

**Small pending fix:** in `Scene.jsx` the cabinet's open doors use `skewY` transforms — replace those two `<rect>`s with
`<path d="M95 44 L70 54 L70 196 L95 200 Z" />` and `<path d="M225 44 L250 54 L250 196 L225 200 Z" />` (fill WOOD).

## To do (in order)

1. `src/styles.css` — clean adult look, large tap targets, mobile friendly, CSS vars used by Scene: `--wood --wood-dark --metal --inside --wall --floor --cardboard --cardboard-dark --bag --bag-dark`. Class names used so far: see the components (app, site-header, tabs/tab/tab-date/tab-topic, collapsible*, chip, btn/btn-ghost/btn-small/btn-speak, tile*, answer-line, option correct/wrong, mc-*, fix-*, feedback-*, scene, data-table, good-news/verse-*, gif-row, task-help/cue-*, glossary, hint, empty-state, stepper...).
2. Remaining activity components + `src/activities/index.js` registry (`export const ACTIVITY_TYPES = { sentenceBuilder, multipleChoice, capitalFix, locationScene, demonstratives, numberChart, dictation, syllables, storyFill, speakingCards, dialogue }`):
   - `LocationScene` — uses `Scene`; ask "Where is/are the ___?"; student picks [It's | They're] + [in | on | under]; then shows full sentence + 🔊; "more practice" random generator.
   - `Demonstratives` — hand 👉 + object near/far, one/many; pick This is / That is / These are / Those are; 2×2 Near/Far × One/More grid highlights.
   - `NumberChart` — table with number inputs for blanks; "add the numbers" hint; follow-up "How many…?" model answers.
   - `Dictation` — partner A/B mode (hide partner's sentences) + "listen & type" mode with capital/period feedback (accept "paperclips" = "paper clips").
   - `Syllables` — 👏 clap counter per word, check.
   - `StoryFill` — inline two-option blanks, check, read aloud.
   - `SpeakingCards` — random prompt cards (station practice), optional model answer reveal.
   - `Dialogue` — practical role-plays: lines with 🔊, "play all", hide-B-lines for role-play.
3. `src/weeks/index.js` (`WEEKS` sorted, `defaultWeekId()` = today's/next Wednesday's week else last) and one file per week:
   `{ id, tabLabel, tabTopic, dateLabel, title, subtitle, goals, powerpoint: { files: [{ file, label }] }, activities: [...], practical: { intro, activities }, goodNews }`.
   GIFs imported with `new URL('../assets/gifs/x.gif', import.meta.url).href`.
4. `src/games/GamesPage.jsx` + games (vocab memory match, is/are quick sort) + an `external links` list for outside ESL game sites.
5. GIFs in `src/assets/gifs/` — 2 per verse, original (drawn with Python Pillow), e.g. vine growing / grapes appearing (John 15:5); calm/peace + prayer (Phil 4:6-7); sunrise + "forever" (Ps 107:1); gates opening + generations (Ps 100:4-5).
6. `.github/workflows/deploy.yml` — build with `npm ci && npm run build`, `actions/upload-pages-artifact` (path `dist`), `actions/deploy-pages`. In repo Settings → Pages, set Source = GitHub Actions.
7. README: run locally, deploy, where to drop PowerPoints, how to add a week / activity / game.
8. `npm run build` and fix errors; run locally and check each activity.

Note: npm 11 blocked install scripts for `@parcel/watcher`, `@swc/core`, `msgpackr-extract` (warnings only). If Parcel fails, run `npm approve-scripts` for them.

## Verses (Good News)

- **John 15:5** (from the PPT — use exactly):
  - EN: I am the vine. You are the branches. / If you remain joined to me, and I to you, / you will bear a lot of fruit.
  - ES (Juan 15:5): Yo soy la vid, vosotros los sarmientos; / el que permanece en mí y yo en él, / ese da mucho fruto.
  - FR (Jean 15:5): Je suis le cep, vous êtes les sarments. / Celui qui demeure en moi / et en qui je demeure porte beaucoup de fruit.
  - PT (João 15:5): Eu sou a videira, e vocês são os ramos. / Quem está unido comigo e eu com ele, / esse dá muito fruto.
  - FA (یوحنا/جان 15:5, RTL): من تاک هستم و شما شاخه‌ها. آنکه در من می‌ماند و من در او، میوهٔ بسیار می‌آورد زیرا که جدا از من هیچ نمی‌توانید کرد.
- **Philippians 4:6-7** (NIV): Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.
- **Psalm 107:1** (NIV): Give thanks to the LORD, for he is good; his love endures forever.
- **Psalm 100:4-5** (NIV): Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name. For the LORD is good and his love endures forever; his faithfulness continues through all generations.
- Translations for the later verses: not added yet — ask the user (they may provide them in their PPTs).

## 10/28 content — answer keys from the PPT

Skip notes in the deck: **Skip ML E3**; ML p.33 A marked **Skip**; ML p.36 A marked **Read / Skip** (B and C have arrows → do them).

**WB p.26 — Write sentences (sentenceBuilder).** Hint: first letter CAPITALISED; add `.` or `?`.
1. Where / the / books / are / ? → Where are the books?
2. The clock / is / the wall / on / . → The clock is on the wall.
3. the books / Are / the cabinet / in / ? → Are the books in the cabinet?
4. are / The pencils / the desk / on / . → The pencils are on the desk.
5. the ruler / the notebook / Is / under / ? → Is the ruler under the notebook?
6. is / the laptop / Where / ? → Where is the laptop?
7. The notebook / the desk / on / is / . → The notebook is on the desk.
8. in / the drawer / Is / the stapler / ? → Is the stapler in the drawer?

**WB p.27 ex 2 — Circle the correct words (it is / they are).**
1. Is the map on the wall? → Yes, it is. 2. Are the pens in the box? → No, they aren't. 3. Is the notebook on the table? → Yes, it is. 4. Is the ruler on the desk? → No, it isn't. 5. Is the laptop on the table? → Yes, it is. 6. Are the desks in the classroom? → Yes, they are. 7. Is the whiteboard on the wall? → Yes, it is. 8. Is the dictionary under the desk? → No, it isn't.

**WB p.27 ex 3 — Add capital letters and periods (capitalFix).**
the classroom is ready for the students / the books are in the cabinet / the map is on the wall / the clock is on the filing cabinet / the pencils are on the table / the laptop is on the table / the markers are in the drawer / the calculators are under the desks

**Conversation cards (slide 5):** Where is the pencil sharpener? / Where is the board? / Where are the books? / Where is the clock? / Where is the teacher? / Where are the students? / Where are the markers? / Where are the erasers?

**ML p.33 (A is Skip).** B: Draw your classroom. C: Write eight sentences about your classroom (example: The clock is on the wall.). Location sentences from A for scenes: The calendar is on the wall. The ruler is in the drawer. The staplers are on the table. The books are in the cabinet. The clock is on the desk. The globe is under the shelf.

**COL p.15/16 — Partner dictation** (use the worksheet text, slide 12):
- Student A reads: The computer is on the desk. / The notepads are on the cabinet. / The hole puncher is under the book. / The paper clips are in the cabinet. / The stapler is in the drawer. / The index cards are on the table. / The eraser is under the table. / The dictionary is on the chair.
- Student B reads: The laptop is on the desk. / The paper clips are on the cabinet. / The computer is under the window. / The markers are in the cabinet. / The notebook is in the drawer. / The scissors are under the chair. / The stapler is on the table. / The index cards are under the desk.
- C: Check your partner's sentences. Are the capital letters and periods correct?

**WB p.28 — Chart + questions.** Chart (item / quantity / location): notebooks 15 under the table; laptops 1 on the desk; calculators 3 on the table; rulers 2 in the drawer; pens 30 in the cabinet; pencils 30 in the cabinet; books 30 under the table.
1. Where are the notebooks? (under the table / in the drawer / in the cabinet / on the desk) → under the table
2. What's on the desk? (a notebook / a laptop / a ruler / a pencil) → a laptop
3. What are in the cabinet? (laptops and rulers / pens and books / notebooks and pencils / pens and pencils) → pens and pencils
4. How many laptops are on the desk? (1 / 2 / 3 / 15) → 1
5. What are under the table? (notebooks and laptops / rulers and books / notebooks and rulers / notebooks and books) → notebooks and books
6. What are on the table? (books / laptops / notebooks / calculators) → calculators
7. Where are the rulers? (in the cabinet / in the drawer / on the desk / under the table) → in the drawer
8. How many notebooks are under the table? (1 / 3 / 15 / 30) → 15

**WB p.29 — This is / That is / These are / Those are** (near = next to the hand):
1. This is a hole puncher (This is / That is) 2. Those are erasers (That is / Those are) 3. These are markers (This is / These are) 4. That is a calculator (That is / This is) 5. That is a notepad (This is / That is) 6. Those are index cards (That is / Those are) 7. Those are rulers (These are / Those are) 8. That is a stapler (That is / Those are) 9. This is a laptop (This is / These are) 10. These are paper clips (Those are / These are)

**Pg. 29 — Demonstrate this/that/these/those (bag game):** Put objects in a bag; take one out; ask "Hector, are these your keys?" — "No, those aren't my keys." / "Fen, are these your keys?" — "Yes, those are my keys." Then: "That's my pencil." — "Here you are."

**ML p.36.** A (read): 1. The calculators are in the drawer. 2. The pencil sharpeners are on the shelf. 3. The rulers are in the cabinet. 4. The stapler is on the desk. 5. The dictionary is under the table.
Classroom Inventory: calculators 8 in the drawer; pencil sharpeners 2 on the shelf; rulers 12 in the cabinet; stapler 1 on the desk; dictionary 1 under the table.
B: 1. Where are the calculators? → They're in the drawer. 2. Where is the stapler? → It's on the desk. 3. How many rulers are in the cabinet? → There are 12 rulers in the cabinet. 4. Where is the dictionary? → It's under the table.
C (School Inventory — "Explain: add the numbers"): columns Pencils / Computers / Calculators / Dictionaries.
Classroom 1: 3 / 2 / **11** / 6 · Classroom 2: 2 / 3 / 9 / 3 · Classroom 3: 0 / 1 / 5 / **12** · Total: 5 / **6** / 25 / 21 (bold = blanks).

**Review p.157 / 30-1 — Listening** ("Read sentences: pg. 157"): 1. What is Juan's last name? (a. Perez ✓ / b. Cruz) 2. Where is he from? (a. Mexico / b. El Salvador ✓) 3. What is his apartment number? (a. 1324 / b. 10 ✓) 4. What is his zip code? (a. 94548 / b. 94321 ✓) 5. What is his area code? (a. 213 ✓ / b. 555) 6. What is his telephone number? (a. 555-6301 ✓ / b. 555-0133). Talk with a partner; use complete sentences.

**30-2 — Grammar: "A New Student"** (storyFill): Layla [is/are → **is**] a new student. [My/Her → **Her**] last name is Azari. She [is/are → **is**] from Iran. She [is/are → **is**] a good student. Her pencils and a notebook [is/are → **are**] on her desk. A dictionary is [in/at → **in**] her bag. Her classmates [isn't/aren't → **aren't**] in the classroom now.
B — Unscramble: from / Where / Layla / is / ? → Where is Layla from? · her / What's / name / last / ? → What's her last name? · good / she / a / student / Is / ? → Is she a good student? · in / bag / What / is / her / ? → What is in her bag? Then ask and answer with a partner.

**31-1 — Pronunciation: syllables** (clap once per syllable):
1: map, books, box, clock, pens, chair, desk · 2: classroom, middle, partner, whiteboard, ruler, notebook, pencil · 3: telephone, initial, signature, computer, sharpener, calendar, eraser.
31-2 C: from 1, China 2, student 2, name 1, Colombia 4, Canada 3, talk 1, city 2.

## Practical (work & life) ideas for 10/28

Workplace role-plays with the same language: stockroom ("Excuse me, where are the gloves?" "They're on the shelf."), restaurant kitchen ("Where is the knife?" "It's in the drawer."), lost & found ("Are these your keys?" "Yes, those are my keys."), office ("Is the stapler on the desk?" "No, it isn't. It's in the drawer."), inventory count ("How many boxes are there?" "There are 12 boxes."), plus a workplace supply-room chart quiz.
