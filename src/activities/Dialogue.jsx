import React, { useState } from 'react';
import SpeakButton from '../components/SpeakButton';
import { WordPictures } from '../components/SentencePicture';
import { canSpeak, speakAll } from '../lib/speech';

// Role-play: a short conversation. Listen, then hide one part and say it yourself.
// roles: { A: 'Worker', B: 'Manager' }
// lines: [['A', 'Excuse me, where are the gloves?'], ['B', "They're on the shelf."]]
// setting (optional): 'Stockroom 📦'. tryAlso (optional): ['gloves → safety vests', ...] words to swap in.

export default function Dialogue({ roles, lines, setting, tryAlso }) {
  const [hidden, setHidden] = useState(null); // 'A' | 'B' | null
  const [revealed, setRevealed] = useState({});

  const hide = (who) => {
    setHidden(hidden === who ? null : who);
    setRevealed({});
  };

  return (
    <div className="dialogue">
      {setting && <p className="dialogue-setting">{setting}</p>}
      <ol className="dialogue-lines">
        {lines.map(([who, text], i) => {
          const isHidden = hidden === who && !revealed[i];
          return (
            <li key={i} className={`dialogue-line role-${who}`}>
              <span className="speaker">{roles[who]}</span>
              {isHidden ? (
                <button type="button" className="bubble bubble-hidden" onClick={() => setRevealed({ ...revealed, [i]: true })}>
                  Your turn — say it! <small>(tap to see)</small>
                </button>
              ) : (
                <span className="bubble">
                  <WordPictures text={text} />
                  {text} <SpeakButton small text={text} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="btn-row">
        {canSpeak && (
          <button type="button" className="btn" onClick={() => speakAll(lines.map(([, t]) => t))}>
            ▶ Play all
          </button>
        )}
        {Object.entries(roles).map(([key, name]) => (
          <button key={key} type="button" className={`btn btn-small ${hidden === key ? '' : 'btn-ghost'}`} onClick={() => hide(key)}>
            {hidden === key ? `Show ${name}` : `Hide ${name}`}
          </button>
        ))}
      </div>
      {tryAlso?.length > 0 && (
        <div className="try-also">
          <span className="muted">Practice again with:</span>
          {tryAlso.map((t) => (
            <span key={t} className="chip">
              <WordPictures text={t} plurals={false} />
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
