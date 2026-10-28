import React, { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import ZoomButtons from './ZoomButtons';

// "☰ Menu" in the header: week tabs, Games, page zoom and light/dark, tucked away.
// Picking a week or Games closes it; zoom and theme leave it open. Esc or a tap outside closes it.
export default function OptionsMenu({ weeks, current, gamesId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close after navigating (also covers the browser's back button).
  useEffect(() => setOpen(false), [current]);

  const tab = (id, date, topic) => (
    <a
      key={id}
      href={`#/${id}`}
      className={`tab ${current === id ? 'active' : ''}`}
      aria-current={current === id ? 'page' : undefined}
      onClick={() => setOpen(false)}
    >
      <span className="tab-date">{date}</span>
      <span className="tab-topic">{topic}</span>
    </a>
  );

  return (
    <div className="options-menu" ref={ref}>
      <button
        type="button"
        className="btn btn-ghost options-toggle"
        aria-expanded={open}
        aria-controls="options-panel"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? '✕' : '☰'} <span>Menu</span>
      </button>
      {open && (
        <div className="options-panel" id="options-panel">
          <h2 className="options-heading">Weeks</h2>
          <nav className="options-tabs" aria-label="Weeks">
            {weeks.map((w) => tab(w.id, w.tabLabel, w.tabTopic))}
            {tab(gamesId, 'Games', 'Extra practice')}
          </nav>
          <h2 className="options-heading">View</h2>
          <div className="options-view">
            <ZoomButtons />
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
