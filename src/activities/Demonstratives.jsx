import React, { useState } from 'react';
import { Stepper, Feedback } from './shared';
import SpeakButton from '../components/SpeakButton';
import ObjectPicture from '../components/ObjectPicture';
import { OBJECTS, pick } from '../lib/objects';
import { article, nounFor } from '../lib/grammar';

// This is / That is / These are / Those are. A hand points at objects near or far.
// items: [{ object: 'holepuncher', near: true, options: ['This is', 'That is'] }, { object: 'eraser', plural: true, near: false }]
// options are optional (default: all four). practiceObjects: ids for "More practice".

const FORMS = [
  { label: 'This is', near: true, plural: false },
  { label: 'That is', near: false, plural: false },
  { label: 'These are', near: true, plural: true },
  { label: 'Those are', near: false, plural: true },
];

function formFor(near, plural) {
  return FORMS.find((f) => f.near === near && f.plural === plural).label;
}

function Grid({ highlight }) {
  const cell = (near, plural) => {
    const word = formFor(near, plural).split(' ')[0].toLowerCase();
    return <td className={highlight === formFor(near, plural) ? 'hl' : ''}>{word}</td>;
  };
  return (
    <table className="demo-grid">
      <thead>
        <tr>
          <th />
          <th>Near 👇</th>
          <th>Far 👉</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>One</th>
          {cell(true, false)}
          {cell(false, false)}
        </tr>
        <tr>
          <th>More than one</th>
          {cell(true, true)}
          {cell(false, true)}
        </tr>
      </tbody>
    </table>
  );
}

function DemoQuestion({ item }) {
  const noun = nounFor(item.object, item.plural);
  const answer = formFor(item.near, noun.plural);
  const options = item.options ?? FORMS.map((f) => f.label);
  const [choice, setChoice] = useState(null);
  const status = choice ? (choice === answer ? 'correct' : 'wrong') : null;
  const sentence = `${answer} ${noun.plural ? '' : `${article(noun.name)} `}${noun.name}.`;

  const emojis = Array.from({ length: noun.plural ? 3 : 1 }, (_, i) => (
    <ObjectPicture key={i} emoji={noun.emoji} image={noun.image} />
  ));

  return (
    <div className="demo-question">
      <div className={`demo-stage ${item.near ? 'near' : 'far'}`} role="img" aria-label={sentence}>
        <span className="demo-hand" aria-hidden="true">👉</span>
        <span className="demo-objects">{emojis}</span>
      </div>
      <p className="prompt muted">{noun.name}</p>
      <div className="choice-row">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`option ${choice === o ? (o === answer ? 'correct' : 'wrong') : ''}`}
            onClick={() => setChoice(o)}
          >
            {o} …
          </button>
        ))}
      </div>
      <Feedback status={status}>
        {status === 'correct' ? (
          <>
            {sentence} <SpeakButton small text={sentence} />
          </>
        ) : (
          'Is it near or far? One, or more than one?'
        )}
      </Feedback>
      <Grid highlight={status === 'correct' ? answer : null} />
    </div>
  );
}

function randomItem(objectIds) {
  return { object: pick(objectIds), plural: Math.random() < 0.5, near: Math.random() < 0.5 };
}

export default function Demonstratives({ items = [], practiceObjects }) {
  const objectIds = practiceObjects ?? Object.keys(OBJECTS);
  const [list, setList] = useState(() => (items.length ? items : [randomItem(objectIds)]));
  const [index, setIndex] = useState(0);

  const more = () => {
    setList([...list, randomItem(objectIds)]);
    setIndex(list.length);
  };

  return (
    <div className="demonstratives">
      <Stepper index={index} total={list.length} onPrev={() => setIndex(index - 1)} onNext={() => setIndex(index + 1)} />
      <DemoQuestion key={index} item={list[index]} />
      {index === list.length - 1 && (
        <button type="button" className="btn btn-ghost" onClick={more}>
          ➕ More practice
        </button>
      )}
    </div>
  );
}
