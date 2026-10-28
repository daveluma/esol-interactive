import React, { useState } from 'react';
import { Score, Table } from './shared';
import SpeakButton from '../components/SpeakButton';
import SentencePicture, { WordPictures } from '../components/SentencePicture';

// Generic multiple choice. Optional `context` (sentences to read) and `table` (chart to look at).
// Each question shows a picture of the things it mentions (or the item's own `emoji`).
// stickyTable: true keeps the chart pinned at the top of the screen while scrolling the questions.
// items: [{ question: 'Where are the notebooks?', options: [...], answer: 'under the table' }]
//   or   [{ lines: ['A: Is the map on the wall?', 'B: Yes, ___.'], options: ['it is', 'they are'], answer: 'it is' }]
// A "___" in a line is filled with the answer once it is correct.

function fill(line, answer) {
  return line.replace('___', answer);
}

function Item({ item, number, onResult }) {
  const [tries, setTries] = useState([]);
  const solved = tries.includes(item.answer);
  const lines = item.lines ?? [item.question];

  const choose = (opt) => {
    if (solved || tries.includes(opt)) return;
    const next = [...tries, opt];
    setTries(next);
    if (opt === item.answer) onResult(next.length === 1);
  };

  return (
    <li className={`mc-item ${solved ? 'solved' : ''}`}>
      <div className="mc-question">
        <span className="mc-num">{number}.</span>
        {item.emoji ? (
          <span className="sentence-pic word-pics" aria-hidden="true">{item.emoji}</span>
        ) : (
          <SentencePicture text={lines[0]} />
        )}
        <div>
          {lines.map((l, i) => (
            <p key={i} className={l.includes('___') ? 'has-blank' : ''}>
              {solved ? fill(l, item.answer) : l}
            </p>
          ))}
        </div>
        {solved && <SpeakButton small text={lines.map((l) => fill(l, item.answer)).join(' ')} />}
      </div>
      <div className="mc-options">
        {item.options.map((opt) => {
          const state = tries.includes(opt) ? (opt === item.answer ? 'correct' : 'wrong') : '';
          return (
            <button key={opt} type="button" className={`option ${state}`} onClick={() => choose(opt)} disabled={solved && !state}>
              <WordPictures text={opt} plurals={false} />
              {opt}
            </button>
          );
        })}
      </div>
    </li>
  );
}

export default function MultipleChoice({ items, context, table, stickyTable = false }) {
  const [results, setResults] = useState({});
  const [round, setRound] = useState(0);
  const firstTry = Object.values(results).filter(Boolean).length;
  const done = Object.keys(results).length;

  return (
    <div className="multiple-choice">
      {context && (
        <div className="context-box">
          {context.map((s) => (
            <p key={s}>
              <SentencePicture text={s} />
              {s} <SpeakButton small text={s} />
            </p>
          ))}
        </div>
      )}
      {table &&
        (stickyTable ? (
          <div className="sticky-table">
            <Table table={table} />
          </div>
        ) : (
          <Table table={table} />
        ))}
      <ol className="mc-list" key={round}>
        {items.map((item, i) => (
          <Item key={i} item={item} number={i + 1} onResult={(ok) => setResults((r) => ({ ...r, [i]: ok }))} />
        ))}
      </ol>
      {done === items.length && (
        <div className="done-row">
          <Score correct={firstTry} total={items.length} label="correct on the first try" />
          <button type="button" className="btn btn-ghost" onClick={() => { setResults({}); setRound(round + 1); }}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
