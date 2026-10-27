import React, { useState } from 'react';
import SpeakButton from './SpeakButton';

export default function GoodNews({ goodNews }) {
  const { reference, version, text, translations = [], keyWords = [], gifs = [] } = goodNews;
  const [lang, setLang] = useState(null);
  const shown = translations.find((t) => t.lang === lang);

  return (
    <div className="good-news">
      <div className="verse-card">
        <p className="verse-ref">
          {reference} {version && <span className="verse-version">({version})</span>}
        </p>
        <blockquote className="verse-text">
          {text.map((line, i) => (
            <span key={i} className="verse-line">
              {line}
            </span>
          ))}
        </blockquote>
        <SpeakButton text={text.join(' ')} label="Listen to the verse" />
      </div>

      {keyWords.length > 0 && (
        <div className="key-words">
          <h4>Key words</h4>
          <ul>
            {keyWords.map((k) => (
              <li key={k.word}>
                <span className="kw-emoji" aria-hidden="true">{k.emoji}</span>
                <strong>{k.word}</strong>
                <SpeakButton text={k.word} small />
                {k.meaning && <small>{k.meaning}</small>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {translations.length > 0 && (
        <div className="translations">
          <h4>In your language</h4>
          <div className="btn-row">
            {translations.map((t) => (
              <button
                key={t.lang}
                type="button"
                className={`btn btn-small ${lang === t.lang ? '' : 'btn-ghost'}`}
                onClick={() => setLang(lang === t.lang ? null : t.lang)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {shown && (
            <div className="translation" lang={shown.lang} dir={shown.rtl ? 'rtl' : 'ltr'}>
              <p className="verse-ref">{shown.reference}</p>
              {shown.text.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {gifs.length > 0 && (
        <div className="gif-row">
          {gifs.map((g) => (
            <figure key={g.src}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              {g.caption && <figcaption>{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
