import React, { useState } from 'react';
import { Feedback } from './shared';
import SpeakButton from '../components/SpeakButton';
import { WordPictures } from '../components/SentencePicture';

// Read a short story and choose the correct word for each blank.
// story: ['Layla [*is|are] a new student.', '[My|*Her] last name is Azari.', ...]
//   [a|b] is a blank; * marks the correct option.

function parse(line) {
  return line.split(/(\[[^\]]+\])/).filter(Boolean).map((part) => {
    if (!part.startsWith('[')) return part;
    const raw = part.slice(1, -1).split('|');
    return { options: raw.map((o) => o.replace(/^\*/, '')), answer: raw.find((o) => o.startsWith('*')).slice(1) };
  });
}

export default function StoryFill({ title, story }) {
  const lines = story.map(parse);
  const blanks = lines.flat().filter((p) => typeof p === 'object');
  const [choices, setChoices] = useState({});
  const [checked, setChecked] = useState(false);

  const fullText = lines.map((parts) => parts.map((p) => (typeof p === 'object' ? p.answer : p)).join('')).join(' ');
  const allOk = blanks.every((b, i) => choices[i] === b.answer);
  let n = -1;

  return (
    <div className="story-fill">
      {title && <h4 className="story-title">{title}</h4>}
      <p className="story-text">
        {lines.map((parts, li) => (
          <span key={li} className="story-line">
            <WordPictures text={parts.map((p) => (typeof p === 'object' ? p.answer : p)).join('')} />
            {parts.map((p, pi) => {
              if (typeof p !== 'object') return <span key={pi}>{p}</span>;
              n += 1;
              const i = n;
              const state = checked ? (choices[i] === p.answer ? 'correct' : 'wrong') : '';
              return (
                <span key={pi} className={`blank-choice ${state}`}>
                  {p.options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      className={`blank-option ${choices[i] === o ? 'selected' : ''}`}
                      onClick={() => {
                        setChoices({ ...choices, [i]: o });
                        setChecked(false);
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </span>
              );
            })}{' '}
          </span>
        ))}
      </p>
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => setChecked(true)} disabled={Object.keys(choices).length < blanks.length}>
          Check
        </button>
        <SpeakButton text={fullText} label="Listen to the story" />
      </div>
      {checked && (
        <Feedback status={allOk ? 'correct' : 'wrong'}>
          {allOk ? 'All correct! Read the story aloud.' : 'Not yet — look at the red words. One (is) or more than one (are)?'}
        </Feedback>
      )}
    </div>
  );
}
