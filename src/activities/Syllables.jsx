import React, { useState } from 'react';
import { Score } from './shared';
import SpeakButton from '../components/SpeakButton';
import { WordPictures } from '../components/SentencePicture';

// Pronunciation: clap once for each syllable.
// items: ['map', 'class·room', 'tel·e·phone']  — the dots mark the syllables (the answer).

function WordCard({ split, onResult }) {
  const parts = split.split('·');
  const word = parts.join('');
  const [claps, setClaps] = useState(0);
  const [status, setStatus] = useState(null);

  const check = () => {
    const ok = claps === parts.length;
    setStatus(ok ? 'correct' : 'wrong');
    onResult(ok);
  };

  return (
    <li className={`syllable-card ${status ?? ''}`}>
      <div className="syllable-word">
        <WordPictures text={word} plurals={false} />
        <strong>{status === 'correct' ? parts.join(' · ') : word}</strong>
        <SpeakButton small text={word} />
      </div>
      <div className="clap-row">
        <button
          type="button"
          className="btn btn-clap"
          onClick={() => {
            setClaps(claps + 1);
            setStatus(null);
          }}
          aria-label={`Clap. Claps so far: ${claps}`}
        >
          👏
        </button>
        <span className="clap-count" aria-live="polite">
          {claps}
        </span>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => { setClaps(0); setStatus(null); }} aria-label="Reset claps">
          ↺
        </button>
        <button type="button" className="btn btn-small" onClick={check} disabled={claps === 0}>
          Check
        </button>
      </div>
      {status === 'wrong' && <p className="feedback feedback-wrong">🔁 Listen and clap again.</p>}
    </li>
  );
}

export default function Syllables({ items }) {
  const [results, setResults] = useState({});
  const correct = Object.values(results).filter(Boolean).length;
  return (
    <div className="syllables">
      <ul className="syllable-grid">
        {items.map((s, i) => (
          <WordCard key={s} split={s} onResult={(ok) => setResults((r) => ({ ...r, [i]: ok }))} />
        ))}
      </ul>
      {Object.keys(results).length > 0 && <Score correct={correct} total={items.length} />}
    </div>
  );
}
