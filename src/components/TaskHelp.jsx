import React, { useEffect, useState } from 'react';
import { CUES, GLOSSARY, HELP_LANGS } from '../lib/cues';

// "What do I do?" panel: short English task cues with a home-language bridge.
// The chosen language (or "all") is remembered on this device and shared by every panel.

const LANG_KEY = 'esol-help-lang';
const DEFAULT_LANG = 'fa';

function savedLang() {
  try {
    const l = localStorage.getItem(LANG_KEY);
    return l === 'all' || HELP_LANGS.some((h) => h.code === l) ? l : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function useHelpLang() {
  const [lang, setLang] = useState(savedLang);
  useEffect(() => {
    const onChange = () => setLang(savedLang());
    window.addEventListener('helplangchange', onChange);
    return () => window.removeEventListener('helplangchange', onChange);
  }, []);
  const choose = (l) => {
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      // storage unavailable — only this panel changes
    }
    setLang(l);
    window.dispatchEvent(new Event('helplangchange'));
  };
  return [lang, choose];
}

function Translations({ entry, langs }) {
  return langs.map((h) => (
    <span key={h.code} className={`cue-tr cue-${h.code}`} lang={h.code} dir={h.rtl ? 'rtl' : 'ltr'}>
      {entry[h.code]}
    </span>
  ));
}

export default function TaskHelp({ cues = [], glossary }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useHelpLang();
  if (!cues.length && !glossary) return null;
  const words = glossary ? GLOSSARY[glossary] : null;
  const shown = lang === 'all' ? HELP_LANGS : HELP_LANGS.filter((h) => h.code === lang);
  const label = lang === 'all' ? null : shown[0];

  return (
    <div className="task-help">
      <button type="button" className="btn btn-ghost btn-small" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide task help' : 'What do I do?'}
        {label && (
          <span lang={label.code} dir={label.rtl ? 'rtl' : 'ltr'}>
            · {label.help}
          </span>
        )}
      </button>
      {open && (
        <div className={`task-help-body ${lang === 'all' ? 'all-langs' : ''}`}>
          <div className="help-langs" role="group" aria-label="Language">
            {HELP_LANGS.map((h) => (
              <button
                key={h.code}
                type="button"
                lang={h.code}
                className={`chip-btn ${lang === h.code ? 'on' : ''}`}
                aria-pressed={lang === h.code}
                onClick={() => setLang(h.code)}
              >
                {h.label}
              </button>
            ))}
            <button type="button" className={`chip-btn ${lang === 'all' ? 'on' : ''}`} aria-pressed={lang === 'all'} onClick={() => setLang('all')}>
              All
            </button>
          </div>
          <ul className="cue-list">
            {cues.map((key) => {
              const cue = CUES[key];
              if (!cue) return null;
              return (
                <li key={key}>
                  <span className="cue-en">{cue.en}</span>
                  <Translations entry={cue} langs={shown} />
                </li>
              );
            })}
          </ul>
          {words && (
            <ul className="glossary">
              {words.map((w) => (
                <li key={w.en}>
                  <strong>{w.en}</strong>
                  <Translations entry={w} langs={shown} />
                  {w.note && <small>{w.note}</small>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
