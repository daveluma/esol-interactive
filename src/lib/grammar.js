// Small English helpers shared by activities.
import { getObject } from './objects';

export function article(word) {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

export function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// { name: 'books', plural: true, emoji, image } for an object id, using the plural form when asked
// (or always, for words like "scissors").
export function nounFor(objectId, plural) {
  const o = getObject(objectId);
  const isPlural = plural || !!o.alwaysPlural;
  return { name: isPlural ? o.many : o.one, plural: isPlural, emoji: o.emoji, image: o.image };
}
