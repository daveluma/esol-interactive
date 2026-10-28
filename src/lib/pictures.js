// Finds pictures for a sentence, to support comprehension.
//  - sceneFor('The clock is on the wall.')  → { object: 'clock', plural: false, furniture: 'wall', place: 'on' }
//  - picturesIn('Are the pens in the box?')  → [pens (plural), box]
// Uses the objects in objects.js plus a few extra words below (people, places, flags…)
// that have a picture but should not appear in random practice.
import { OBJECTS } from './objects';
import { FURNITURE } from '../activities/Scene';

// key: [one, many, emoji]
const EXTRA_WORDS = {
  computer: ['computer', 'computers', '🖥️'],
  teacher: ['teacher', 'teachers', '🧑‍🏫'],
  student: ['student', 'students', '🧑‍🎓'],
  classroom: ['classroom', 'classrooms', '🏫'],
  window: ['window', 'windows', '🪟'],
  chair: ['chair', 'chairs', '🪑'],
  cabinet: ['cabinet', 'cabinets', '🗄️'],
  filingcabinet: ['filing cabinet', 'filing cabinets', '🗄️'],
  sharpener: ['pencil sharpener', 'pencil sharpeners', '✏️'],
  telephone: ['telephone', 'telephones', '☎️'],
  lastname: ['last name', 'last names', '🪪'],
  name: ['name', 'names', '🪪'],
  signature: ['signature', 'signatures', '✍️'],
  partner: ['partner', 'partners', '🤝'],
  city: ['city', 'cities', '🏙️'],
  talk: ['talk', 'talks', '💬'],
  // Countries get a globe: Windows (the classroom board) shows flag emoji as two letters.
  iran: ['Iran', 'Iran', '🌍'],
  mexico: ['Mexico', 'Mexico', '🌎'],
  elsalvador: ['El Salvador', 'El Salvador', '🌎'],
  china: ['China', 'China', '🌏'],
  colombia: ['Colombia', 'Colombia', '🌎'],
  canada: ['Canada', 'Canada', '🌎'],
  // People in the lessons.
  layla: ['Layla', 'Layla', '👩'],
  juan: ['Juan', 'Juan', '👨'],
};

// Other spellings that mean the same object.
const ALIASES = { paperclips: ['paperclip', true], paperclip: ['paperclip', false] };

// Words the scene drawings can show (Scene.jsx), with their spellings.
const FURNITURE_WORDS = {
  table: 'table', tables: 'table', desk: 'desk', desks: 'desk', chair: 'chair', chairs: 'chair',
  shelf: 'shelf', 'filing cabinet': 'cabinet', cabinet: 'cabinet', drawer: 'drawer',
  box: 'box', bag: 'bag', wall: 'wall',
};

// word (lowercase) → { key, emoji, image, plural }
const WORDS = new Map();
Object.entries(OBJECTS).forEach(([key, o]) => {
  WORDS.set(o.one.toLowerCase(), { key, emoji: o.emoji, image: o.image, plural: !!o.alwaysPlural, isObject: true });
  WORDS.set(o.many.toLowerCase(), { key, emoji: o.emoji, image: o.image, plural: true, isObject: true });
});
Object.entries(EXTRA_WORDS).forEach(([key, [one, many, emoji]]) => {
  if (!WORDS.has(one.toLowerCase())) WORDS.set(one.toLowerCase(), { key, emoji, plural: false });
  if (!WORDS.has(many.toLowerCase())) WORDS.set(many.toLowerCase(), { key, emoji, plural: one !== many });
});
Object.entries(ALIASES).forEach(([word, [key, plural]]) => {
  const o = OBJECTS[key];
  WORDS.set(word, { key, emoji: o.emoji, image: o.image, plural, isObject: true });
});

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const alternation = (words) => [...words].sort((a, b) => b.length - a.length).map(escape).join('|');
const WORD_RE = new RegExp(`\\b(${alternation(WORDS.keys())})\\b`, 'gi');
const SCENE_RE = new RegExp(
  `\\bthe (${alternation(WORDS.keys())}) (is|are) (in|on|under) the (${alternation(Object.keys(FURNITURE_WORDS))})\\b`,
  'i',
);

// Pictures for the things a text mentions, in order, each thing once.
export function picturesIn(text) {
  const seen = new Set();
  const found = [];
  for (const m of text.matchAll(WORD_RE)) {
    const w = WORDS.get(m[1].toLowerCase());
    if (w && !seen.has(w.key)) {
      seen.add(w.key);
      found.push(w);
    }
  }
  return found;
}

// A drawable "X is/are in/on/under the Y" statement. Questions get no scene: a yes/no
// question shows a claim that may be false ("Are the pens in the box?" — "No, they aren't.").
export function sceneFor(text) {
  if (/\?\s*$/.test(text)) return null;
  const m = text.match(SCENE_RE);
  if (!m) return null;
  const word = WORDS.get(m[1].toLowerCase());
  const furniture = FURNITURE_WORDS[m[4].toLowerCase()];
  const place = m[3].toLowerCase();
  if (!word?.isObject || !FURNITURE[furniture].slots[place]) return null;
  return { object: word.key, plural: m[2].toLowerCase() === 'are' || word.plural, emoji: word.emoji, image: word.image, furniture, place };
}
