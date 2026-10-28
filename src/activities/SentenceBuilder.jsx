import React, { useState } from 'react';
import { Stepper, Feedback } from './shared';
import SpeakButton from '../components/SpeakButton';
import SentencePicture from '../components/SentencePicture';

// Tap the word groups in order to build a sentence (unscramble).
// items: [{ chunks: ['the books', 'Are', 'the cabinet', 'in', '?'], answer: 'Are the books in the cabinet?' }]

function join(parts) {
  return parts.join(' ').replace(/\s+([.?!,])/g, '$1');
}

function SentenceItem({ item }) {
  const [used, setUsed] = useState([]); // indexes of chunks in the order tapped
  const [status, setStatus] = useState(null);
  const built = join(used.map((i) => item.chunks[i]));

  const add = (i) => {
    setUsed([...used, i]);
    setStatus(null);
  };
  const remove = (pos) => {
    setUsed(used.filter((_, p) => p !== pos));
    setStatus(null);
  };
  const check = () => setStatus(built === item.answer ? 'correct' : 'wrong');

  return (
    <div className="sentence-item">
      <div className={`answer-line ${status ?? ''}`} aria-live="polite">
        {used.length === 0 && <span className="placeholder">Tap the words below…</span>}
        {used.map((i, pos) => (
          <button key={pos} type="button" className="tile tile-placed" onClick={() => remove(pos)}>
            {item.chunks[i]}
          </button>
        ))}
      </div>

      <div className="tile-bank">
        {item.chunks.map((chunk, i) =>
          used.includes(i) ? (
            <span key={i} className="tile tile-ghost">{chunk}</span>
          ) : (
            <button key={i} type="button" className={`tile ${/^[.?]$/.test(chunk) ? 'tile-punct' : ''}`} onClick={() => add(i)}>
              {chunk}
            </button>
          ),
        )}
      </div>

      <div className="btn-row">
        <button type="button" className="btn" onClick={check} disabled={used.length !== item.chunks.length}>
          Check
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => { setUsed([]); setStatus(null); }}>
          Start again
        </button>
        {status === 'correct' && <SpeakButton text={item.answer} />}
      </div>

      <Feedback status={status}>
        {status === 'correct'
          ? item.answer
          : 'Not yet. Check the word order. Is it a question (?) or a statement (.)?'}
      </Feedback>
    </div>
  );
}

export default function SentenceBuilder({ items, hint }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="sentence-builder">
      {hint && (
        <div className="hint-box">
          {hint.map((h) => (
            <p key={h}>{h}</p>
          ))}
        </div>
      )}
      <Stepper
        index={index}
        total={items.length}
        onPrev={() => setIndex(index - 1)}
        onNext={() => setIndex(index + 1)}
      />
      <div className="picture-prompt">
        <SentencePicture text={items[index].answer} />
        <p className="scrambled">{items[index].chunks.join(' / ')}</p>
      </div>
      <SentenceItem key={index} item={items[index]} />
    </div>
  );
}
