import React, { useState } from 'react';
import Scene, { FURNITURE } from './Scene';
import { Stepper, Feedback } from './shared';
import SpeakButton from '../components/SpeakButton';
import { OBJECTS, pick } from '../lib/objects';
import { nounFor } from '../lib/grammar';

// Look at the picture and answer "Where is / Where are the ___?"
// items: [{ object: 'calendar', furniture: 'wall', place: 'on' }, { object: 'stapler', plural: true, furniture: 'table', place: 'on' }]
// practiceObjects (optional): object ids for the "More practice" random generator.

const PLACES = ['in', 'on', 'under'];
// Random practice skips the wall: "The laptop is on the wall" would be strange.
const RANDOM_FURNITURE = Object.keys(FURNITURE).filter((f) => f !== 'wall');

function randomItem(objectIds) {
  const furniture = pick(RANDOM_FURNITURE);
  return {
    object: pick(objectIds),
    plural: Math.random() < 0.5,
    furniture,
    place: pick(Object.keys(FURNITURE[furniture].slots)),
  };
}

function SceneQuestion({ item }) {
  const noun = nounFor(item.object, item.plural);
  const [pronoun, setPronoun] = useState(null);
  const [place, setPlace] = useState(null);
  const [status, setStatus] = useState(null);

  const where = FURNITURE[item.furniture].label;
  const question = `Where ${noun.plural ? 'are' : 'is'} the ${noun.name}?`;
  const short = `${noun.plural ? "They're" : "It's"} ${item.place} the ${where}.`;
  const full = `The ${noun.name} ${noun.plural ? 'are' : 'is'} ${item.place} the ${where}.`;

  const check = () => {
    const ok = pronoun === (noun.plural ? "They're" : "It's") && place === item.place;
    setStatus(ok ? 'correct' : 'wrong');
  };

  let tip = '';
  if (status === 'wrong') {
    if (pronoun !== (noun.plural ? "They're" : "It's"))
      tip = noun.plural ? 'More than one → They’re.' : 'One thing → It’s.';
    else tip = 'Look again: in, on, or under?';
  }

  return (
    <div className="location-question">
      <Scene
        furniture={item.furniture}
        place={item.place}
        emoji={noun.emoji}
        image={noun.image}
        count={noun.plural ? 3 : 1}
        label={full}
      />
      <p className="prompt">
        {question} <SpeakButton small text={question} />
      </p>
      <div className="choice-row">
        {["It's", "They're"].map((p) => (
          <button key={p} type="button" className={`option ${pronoun === p ? 'selected' : ''}`} onClick={() => { setPronoun(p); setStatus(null); }}>
            {p}
          </button>
        ))}
        <span className="choice-gap" />
        {PLACES.map((p) => (
          <button key={p} type="button" className={`option ${place === p ? 'selected' : ''}`} onClick={() => { setPlace(p); setStatus(null); }}>
            {p}
          </button>
        ))}
        <span className="choice-tail">the {where}.</span>
      </div>
      <div className="btn-row">
        <button type="button" className="btn" onClick={check} disabled={!pronoun || !place}>
          Check
        </button>
        {status === 'correct' && <SpeakButton text={`${short} ${full}`} />}
      </div>
      <Feedback status={status}>
        {status === 'correct' ? (
          <>
            {short} <span className="muted">· {full}</span>
          </>
        ) : (
          tip
        )}
      </Feedback>
    </div>
  );
}

export default function LocationScene({ items = [], practiceObjects }) {
  const objectIds = practiceObjects ?? Object.keys(OBJECTS);
  const [list, setList] = useState(() => (items.length ? items : [randomItem(objectIds)]));
  const [index, setIndex] = useState(0);

  const more = () => {
    setList([...list, randomItem(objectIds)]);
    setIndex(list.length);
  };

  return (
    <div className="location-scene">
      <Stepper index={index} total={list.length} onPrev={() => setIndex(index - 1)} onNext={() => setIndex(index + 1)} />
      <SceneQuestion key={index} item={list[index]} />
      {index === list.length - 1 && (
        <button type="button" className="btn btn-ghost" onClick={more}>
          ➕ More practice
        </button>
      )}
    </div>
  );
}
