import React, { useState } from 'react';
import { Score } from '../activities/shared';
import { OBJECTS, pick } from '../lib/objects';
import { nounFor } from '../lib/grammar';
import { speak } from '../lib/speech';
import ObjectPicture from '../components/ObjectPicture';

// Quick sort: is or are? Ten sentences per round.

const ROUND = 10;
const PLACES = ['on the desk', 'in the drawer', 'under the table', 'in the cabinet', 'on the shelf', 'in the bag'];

function newSentence(objectIds) {
  const noun = nounFor(pick(objectIds), Math.random() < 0.5);
  return { noun, place: pick(PLACES) };
}

export default function IsAreSort({ objectIds = Object.keys(OBJECTS) }) {
  const [item, setItem] = useState(() => newSentence(objectIds));
  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null); // 'correct' | 'wrong'
  const answer = item.noun.plural ? 'are' : 'is';
  const sentence = `The ${item.noun.name} ${answer} ${item.place}.`;
  const finished = count === ROUND;

  const choose = (verb) => {
    if (result) return;
    const ok = verb === answer;
    setResult(ok ? 'correct' : 'wrong');
    if (ok) setScore(score + 1);
    speak(sentence);
  };

  const next = () => {
    setCount(count + 1);
    setItem(newSentence(objectIds));
    setResult(null);
  };

  if (finished) {
    return (
      <div className="is-are">
        <Score correct={score} total={ROUND} />
        <button type="button" className="btn" onClick={() => { setCount(0); setScore(0); }}>
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="is-are">
      <p className="stepper-count">
        {count + 1} / {ROUND} · Score: {score}
      </p>
      <p className="is-are-emoji" aria-hidden="true">
        {Array.from({ length: item.noun.plural ? 3 : 1 }, (_, i) => (
          <ObjectPicture key={i} emoji={item.noun.emoji} image={item.noun.image} />
        ))}
      </p>
      <p className="is-are-sentence">
        The {item.noun.name} <span className={`blank ${result ?? ''}`}>{result ? answer : '___'}</span> {item.place}.
      </p>
      <div className="choice-row choice-big">
        {['is', 'are'].map((v) => (
          <button key={v} type="button" className="option" onClick={() => choose(v)} disabled={!!result}>
            {v}
          </button>
        ))}
      </div>
      {result && (
        <div className="btn-row">
          <span className={`feedback feedback-${result}`}>
            {result === 'correct' ? '✅ Yes!' : `🔁 ${item.noun.plural ? 'More than one → are' : 'One → is'}`}
          </span>
          <button type="button" className="btn" onClick={next}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
