// Classroom / workplace objects with an emoji picture.
// Activities look up pictures here so new weeks can reuse them.

export const OBJECTS = {
  book: { one: 'book', many: 'books', emoji: '📕' },
  pencil: { one: 'pencil', many: 'pencils', emoji: '✏️' },
  pen: { one: 'pen', many: 'pens', emoji: '🖊️' },
  ruler: { one: 'ruler', many: 'rulers', emoji: '📏' },
  notebook: { one: 'notebook', many: 'notebooks', emoji: '📓' },
  laptop: { one: 'laptop', many: 'laptops', emoji: '💻' },
  clock: { one: 'clock', many: 'clocks', emoji: '🕒' },
  globe: { one: 'globe', many: 'globes', emoji: '🌎' },
  map: { one: 'map', many: 'maps', emoji: '🗺️' },
  scissors: { one: 'scissors', many: 'scissors', emoji: '✂️', alwaysPlural: true },
  paperclip: { one: 'paper clip', many: 'paper clips', emoji: '📎' },
  marker: { one: 'marker', many: 'markers', emoji: '🖍️' },
  calculator: { one: 'calculator', many: 'calculators', emoji: '🧮' },
  calendar: { one: 'calendar', many: 'calendars', emoji: '📅' },
  dictionary: { one: 'dictionary', many: 'dictionaries', emoji: '📘' },
  stapler: { one: 'stapler', many: 'staplers', emoji: '🗜️' },
  keys: { one: 'key', many: 'keys', emoji: '🔑' },
  phone: { one: 'phone', many: 'phones', emoji: '📱' },
  bag: { one: 'bag', many: 'bags', emoji: '👜' },
  wallet: { one: 'wallet', many: 'wallets', emoji: '👛' },
  glasses: { one: 'glasses', many: 'glasses', emoji: '👓', alwaysPlural: true },
  folder: { one: 'folder', many: 'folders', emoji: '📁' },
  eraser: { one: 'eraser', many: 'erasers', emoji: '🧽' },
  notepad: { one: 'notepad', many: 'notepads', emoji: '🗒️' },
  indexcard: { one: 'index card', many: 'index cards', emoji: '📇' },
  holepuncher: { one: 'hole puncher', many: 'hole punchers', emoji: '🕳️' },
  gloves: { one: 'glove', many: 'gloves', emoji: '🧤' },
  box: { one: 'box', many: 'boxes', emoji: '📦' },
  hammer: { one: 'hammer', many: 'hammers', emoji: '🔨' },
  knife: { one: 'knife', many: 'knives', emoji: '🔪' },
  cup: { one: 'cup', many: 'cups', emoji: '☕' },
  broom: { one: 'broom', many: 'brooms', emoji: '🧹' },
  vest: { one: 'safety vest', many: 'safety vests', emoji: '🦺' },
  helmet: { one: 'hard hat', many: 'hard hats', emoji: '⛑️' },
};

export function getObject(id) {
  const o = OBJECTS[id];
  if (!o) throw new Error(`Unknown object "${id}" — add it to src/lib/objects.js`);
  return o;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
