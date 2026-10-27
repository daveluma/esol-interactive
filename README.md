# ESOL Beginner 2

Interactive Wednesday practice for an adult ESOL class. Each week has a tab with four parts:
**PowerPoint** slides, **Interactive Activities**, **Practical English — Work & Life**, and **THE GOOD NEWS**
(verse of the week). A **Games** tab has extra practice for any day.

Built with React + Parcel. Text-to-speech uses the browser's own voices (no account or API key).

## Run it on your computer

Needs [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm start          # opens http://localhost:1234 and reloads when you save a file
```

To test the finished site exactly as it will be on GitHub Pages:

```bash
npm run preview    # builds into dist/ and serves it
```

## Put it online (GitHub Pages)

1. Push this repo to GitHub (it can be public).
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Every push to `main` builds and publishes the site
   ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).
   The address is shown under Settings → Pages (usually `https://<user>.github.io/esol-interactive/`).

Links to a week look like `…/#/2026-10-28`. The site opens on this week's Wednesday by default.

## Add the PowerPoint slides

1. Put the file in `static/powerpoints/<week id>/`, e.g. `static/powerpoints/2026-10-28/Wednesday slides.pdf`.
2. List it in the week file (`src/weeks/2026-10-28.js`):

   ```js
   powerpoint: { files: [{ file: 'Wednesday slides.pdf', label: 'Wednesday slides' }] },
   ```

A **PDF** shows inside the page everywhere. A **.pptx** can be downloaded; it can only be shown inside
the page once the site is online (Microsoft's free viewer needs a public address). Tip: add both.
Remember the site is public — only upload slides you're allowed to share.

## Add a week

1. Copy a week file in `src/weeks/` (e.g. `2026-11-04.js`) and rename it to the new Wednesday date.
2. Change `id` (same date), `tabLabel`, `tabTopic`, `dateLabel`, `title`, `goals`, activities and `goodNews`.
3. Add it to the list in [src/weeks/index.js](src/weeks/index.js).
4. Make a slides folder: `static/powerpoints/<date>/`.

## Add an activity to a week

Add an object to the week's `activities` (or `practical.activities`) list. Every activity has:

```js
{
  type: 'multipleChoice',          // which kind (see the table below)
  title: 'Read the chart',
  source: 'WB p.28',               // optional: book page
  skill: 'Comprehension check',    // optional: label
  instructions: 'Look at the chart. Choose the answer.',
  cues: ['look', 'read'],          // optional: "What do I do?" help in English + Farsi (src/lib/cues.js)
  glossary: 'location',            // optional: 'location' or 'demonstratives' word list
  // …plus the fields for that type
}
```

| type | What students do | Main fields |
|---|---|---|
| `sentenceBuilder` | Tap words in order | `items: [{ chunks, answer }]`, `hint` |
| `multipleChoice` | Choose an answer | `items: [{ question \| lines, options, answer }]`, `context`, `table` |
| `capitalFix` | Add capital letters and periods | `items: ['the books are in the cabinet']` |
| `locationScene` | Picture → "It's / They're in / on / under…" | `items: [{ object, plural, furniture, place }]`, `practiceObjects` |
| `demonstratives` | this / that / these / those | `items: [{ object, plural, near, options }]` |
| `numberChart` | Fill number blanks; Q&A | `table` (blank cell = `{ answer: 11 }`), `questions`, `context`, `hint` |
| `dictation` | Partner dictation / listen & type | `partners: { A: [...], B: [...] }` |
| `syllables` | Clap the syllables | `items: ['map', 'class·room']` |
| `storyFill` | Choose words in a story | `story: ['Layla [*is\|are] a new student.']` (`*` = correct) |
| `speakingCards` | Prompt cards for partners/stations | `cards` or `decks: [{ name, cards, frames }]`, `frames` |
| `dialogue` | Role-play with listening | `roles: { A, B }`, `lines: [['A', '…']]`, `setting`, `tryAlso` |

Objects (pictures) for scenes and games are in [src/lib/objects.js](src/lib/objects.js); furniture is in
[src/activities/Scene.jsx](src/activities/Scene.jsx). See `src/weeks/2026-10-28.js` for a full example of every type.

**New kind of activity:** make a component in `src/activities/` and register it in
[src/activities/index.js](src/activities/index.js).

**New game:** make a component in `src/games/` and add it to `GAMES` in
[src/games/GamesPage.jsx](src/games/GamesPage.jsx). Outside game sites are in `LINKS` in the same file.

## Good News GIFs

The animations in `src/assets/gifs/` are original drawings made by [scripts/make-gifs.mjs](scripts/make-gifs.mjs).
To change or add one, edit that script and run:

```bash
npm i --no-save gifenc@1.0.3 @resvg/resvg-js@2.6.2
node scripts/make-gifs.mjs
```

Use one in a week file with `new URL('../assets/gifs/<name>.gif', import.meta.url).href`.
