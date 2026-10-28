import React, { useEffect, useState } from 'react';
import { OBJECTS, shuffle } from '../lib/objects';
import { speak } from '../lib/speech';
import ObjectPicture from '../components/ObjectPicture';

// Vocabulary memory: find the picture and the word that match.

const PAIRS = 6;

function newDeck(objectIds) {
  const chosen = shuffle(objectIds).slice(0, PAIRS);
  return shuffle(
    chosen.flatMap((id) => [
      { key: `${id}-pic`, id, face: OBJECTS[id].emoji, image: OBJECTS[id].image, kind: 'pic' },
      { key: `${id}-word`, id, face: OBJECTS[id].one, kind: 'word' },
    ]),
  );
}

export default function MemoryMatch({ objectIds = Object.keys(OBJECTS) }) {
  const [deck, setDeck] = useState(() => newDeck(objectIds));
  const [open, setOpen] = useState([]); // up to 2 indexes
  const [matched, setMatched] = useState([]); // object ids
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (open.length !== 2) return undefined;
    const [a, b] = open.map((i) => deck[i]);
    if (a.id === b.id) {
      setMatched((m) => [...m, a.id]);
      speak(OBJECTS[a.id].one);
      setOpen([]);
      return undefined;
    }
    const t = setTimeout(() => setOpen([]), 900);
    return () => clearTimeout(t);
  }, [open, deck]);

  const flip = (i) => {
    if (open.length === 2 || open.includes(i) || matched.includes(deck[i].id)) return;
    if (open.length === 1) setMoves(moves + 1);
    setOpen([...open, i]);
  };

  const restart = () => {
    setDeck(newDeck(objectIds));
    setOpen([]);
    setMatched([]);
    setMoves(0);
  };

  const won = matched.length === PAIRS;

  return (
    <div className="memory">
      <div className="memory-grid">
        {deck.map((card, i) => {
          const up = open.includes(i) || matched.includes(card.id);
          return (
            <button
              key={card.key}
              type="button"
              className={`memory-card ${up ? 'up' : ''} ${matched.includes(card.id) ? 'matched' : ''} memory-${card.kind}`}
              onClick={() => flip(i)}
              aria-label={up ? (card.image ? `Picture of a ${OBJECTS[card.id].one}` : card.face) : 'Hidden card'}
            >
              {up ? <ObjectPicture emoji={card.face} image={card.image} /> : '?'}
            </button>
          );
        })}
      </div>
      <div className="btn-row">
        <span className="stepper-count">Turns: {moves}</span>
        {won && <span className="feedback feedback-correct">✅ All pairs found!</span>}
        <button type="button" className="btn btn-ghost" onClick={restart}>
          New game
        </button>
      </div>
    </div>
  );
}
