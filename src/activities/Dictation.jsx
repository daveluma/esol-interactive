import React, { useMemo, useState } from 'react';
import { Feedback } from './shared';
import SpeakButton from '../components/SpeakButton';
import { speak } from '../lib/speech';
import { shuffle } from '../lib/objects';

// Partner dictation (information gap) + "listen and type".
// partners: { A: ['The computer is on the desk.', ...], B: ['The laptop is on the desk.', ...] }
// Partner mode: I read MY sentences aloud; I write my PARTNER's sentences, then check.

// Words that may be written two ways.
const SAME_WORDS = [[/\bpaperclips\b/g, 'paper clips']];

function words(s) {
  let t = s.toLowerCase().replace(/[.?!,]/g, ' ');
  SAME_WORDS.forEach(([re, to]) => {
    t = t.replace(re, to);
  });
  return t.split(/\s+/).filter(Boolean).join(' ');
}

function compare(typed, target) {
  const t = typed.trim();
  return {
    wordsOk: words(t) === words(target),
    capitalOk: /^[A-Z]/.test(t),
    periodOk: t.endsWith(target.slice(-1)),
  };
}

function resultFor(typed, target) {
  if (!typed.trim()) return { status: null, tip: '' };
  const r = compare(typed, target);
  if (r.wordsOk && r.capitalOk && r.periodOk) return { status: 'correct', tip: target };
  const tips = [];
  if (!r.wordsOk) tips.push('Check the words.');
  if (!r.capitalOk) tips.push('Start with a capital letter.');
  if (!r.periodOk) tips.push(`End with ${target.endsWith('?') ? 'a question mark (?)' : 'a period (.)'}.`);
  return { status: 'wrong', tip: tips.join(' ') };
}

function WriteBox({ target, number }) {
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(false);
  const { status, tip } = checked ? resultFor(typed, target) : { status: null, tip: '' };

  return (
    <li className="dictation-item">
      <span className="mc-num">{number}.</span>
      <div className="dictation-body">
        <input
          className={`text-input ${status ?? ''}`}
          type="text"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          value={typed}
          onChange={(e) => {
            setTyped(e.target.value);
            setChecked(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && setChecked(true)}
          placeholder="Write the sentence…"
        />
        <div className="btn-row">
          <button type="button" className="btn btn-small" onClick={() => setChecked(true)} disabled={!typed.trim()}>
            Check
          </button>
        </div>
        <Feedback status={status}>{status === 'correct' ? 'Correct!' : tip}</Feedback>
        {status === 'wrong' && <p className="muted small">Answer: {target}</p>}
      </div>
    </li>
  );
}

function PartnerMode({ partners }) {
  const [me, setMe] = useState(null);
  const other = me === 'A' ? 'B' : 'A';

  if (!me) {
    return (
      <div className="partner-pick">
        <p>Who are you?</p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setMe('A')}>
            I am Student A
          </button>
          <button type="button" className="btn" onClick={() => setMe('B')}>
            I am Student B
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-mode">
      <div className="btn-row">
        <span className="chip chip-skill">Student {me}</span>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => setMe(null)}>
          Change
        </button>
      </div>
      <h4>1. Read your sentences to your partner</h4>
      <ol className="read-list">
        {partners[me].map((s) => (
          <li key={s}>
            {s} <SpeakButton small text={s} />
          </li>
        ))}
      </ol>
      <h4>2. Listen to your partner. Write their sentences.</h4>
      <ol className="dictation-list">
        {partners[other].map((s, i) => (
          <WriteBox key={`${other}-${i}`} target={s} number={i + 1} />
        ))}
      </ol>
      <p className="hint">3. Check: capital letter at the start? Period at the end?</p>
    </div>
  );
}

function ListenMode({ partners }) {
  const all = useMemo(() => shuffle([...partners.A, ...partners.B]), [partners]);
  const [index, setIndex] = useState(0);
  const target = all[index];

  return (
    <div className="listen-mode">
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => speak(target)}>
          🔊 Listen
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => speak(target, { rate: 0.6 })}>
          🐢 Slow
        </button>
        <span className="stepper-count">
          {index + 1} / {all.length}
        </span>
      </div>
      <ol className="dictation-list" start={index + 1}>
        <WriteBox key={index} target={target} number={index + 1} />
      </ol>
      <div className="btn-row">
        <button type="button" className="btn btn-small" onClick={() => setIndex((index + 1) % all.length)}>
          Next sentence →
        </button>
      </div>
    </div>
  );
}

export default function Dictation({ partners }) {
  const [mode, setMode] = useState('partner');
  return (
    <div className="dictation">
      <div className="mode-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'partner'} className={`btn btn-small ${mode === 'partner' ? '' : 'btn-ghost'}`} onClick={() => setMode('partner')}>
          👥 Partner dictation
        </button>
        <button type="button" role="tab" aria-selected={mode === 'listen'} className={`btn btn-small ${mode === 'listen' ? '' : 'btn-ghost'}`} onClick={() => setMode('listen')}>
          🎧 Listen &amp; type (alone)
        </button>
      </div>
      {mode === 'partner' ? <PartnerMode partners={partners} /> : <ListenMode partners={partners} />}
    </div>
  );
}
