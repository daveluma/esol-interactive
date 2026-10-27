import React, { useState } from 'react';
import { Feedback } from './shared';
import SpeakButton from '../components/SpeakButton';

// Accuracy check: tap a word to make its first letter a CAPITAL, tap the end to add a period.
// items: ['the books are in the cabinet', ...]  (write them without the capital and period)

function cap(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function FixItem({ sentence, number }) {
  const words = sentence.split(' ');
  const [caps, setCaps] = useState(() => words.map(() => false));
  const [period, setPeriod] = useState(false);
  const [status, setStatus] = useState(null);

  const toggle = (i) => {
    setCaps(caps.map((c, j) => (j === i ? !c : c)));
    setStatus(null);
  };
  const check = () => {
    const ok = caps[0] && caps.slice(1).every((c) => !c) && period;
    setStatus(ok ? 'correct' : 'wrong');
  };
  const correct = `${cap(sentence)}.`;

  let tip = '';
  if (status === 'wrong') {
    if (!caps[0]) tip = 'The first letter is a capital letter.';
    else if (caps.slice(1).some(Boolean)) tip = 'Only the first word needs a capital here.';
    else tip = 'Add a period at the end.';
  }

  return (
    <li className={`fix-item ${status ?? ''}`}>
      <span className="mc-num">{number}.</span>
      <div className="fix-sentence">
        {words.map((w, i) => (
          <button key={i} type="button" className={`fix-word ${caps[i] ? 'capped' : ''}`} onClick={() => toggle(i)}>
            {caps[i] ? cap(w) : w}
          </button>
        ))}
        <button
          type="button"
          className={`fix-period ${period ? 'on' : ''}`}
          onClick={() => { setPeriod(!period); setStatus(null); }}
          aria-label={period ? 'Remove period' : 'Add period'}
        >
          {period ? '.' : '◻'}
        </button>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-small" onClick={check}>Check</button>
        {status === 'correct' && <SpeakButton small text={correct} />}
      </div>
      <Feedback status={status}>{status === 'correct' ? correct : tip}</Feedback>
    </li>
  );
}

export default function CapitalFix({ items }) {
  return (
    <ol className="fix-list">
      {items.map((s, i) => (
        <FixItem key={s} sentence={s} number={i + 1} />
      ))}
    </ol>
  );
}
