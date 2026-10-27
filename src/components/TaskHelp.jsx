import React, { useState } from 'react';
import { CUES, GLOSSARY } from '../lib/cues';

// "What do I do?" panel: short English task cues with a Farsi bridge.
export default function TaskHelp({ cues = [], glossary }) {
  const [open, setOpen] = useState(false);
  if (!cues.length && !glossary) return null;
  const words = glossary ? GLOSSARY[glossary] : null;

  return (
    <div className="task-help">
      <button type="button" className="btn btn-ghost btn-small" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide task help' : 'What do I do?'} <span lang="fa" dir="rtl">· راهنما</span>
      </button>
      {open && (
        <div className="task-help-body">
          <ul className="cue-list">
            {cues.map((key) => {
              const cue = CUES[key];
              if (!cue) return null;
              return (
                <li key={key}>
                  <span className="cue-en">{cue.en}</span>
                  <span className="cue-fa" lang="fa" dir="rtl">{cue.fa}</span>
                </li>
              );
            })}
          </ul>
          {words && (
            <ul className="glossary">
              {words.map((w) => (
                <li key={w.en}>
                  <strong>{w.en}</strong>
                  <span lang="fa" dir="rtl">{w.fa}</span>
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
