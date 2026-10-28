import React from 'react';
import Scene from '../activities/Scene';
import ObjectPicture from './ObjectPicture';
import { picturesIn, sceneFor } from '../lib/pictures';

// A picture of what a sentence says: a small scene for "The clock is on the wall.",
// otherwise the things it mentions (two of them for a plural). Nothing if no picture is known.
export default function SentencePicture({ text, scene = true }) {
  const s = scene ? sceneFor(text) : null;
  if (s) {
    return (
      <span className="sentence-pic sentence-scene" aria-hidden="true">
        <Scene furniture={s.furniture} place={s.place} emoji={s.emoji} image={s.image} count={s.plural ? 3 : 1} label="" />
      </span>
    );
  }
  return <WordPictures text={text} />;
}

// Small inline pictures for the things a phrase mentions ("pens and pencils" → 🖊️🖊️ ✏️✏️).
export function WordPictures({ text, plurals = true }) {
  const pics = picturesIn(text);
  if (!pics.length) return null;
  return (
    <span className="sentence-pic word-pics" aria-hidden="true">
      {pics.map((p) => (
        <span key={p.key} className="word-pic">
          {Array.from({ length: plurals && p.plural ? 2 : 1 }, (_, i) => (
            <ObjectPicture key={i} emoji={p.emoji} image={p.image} />
          ))}
        </span>
      ))}
    </span>
  );
}
