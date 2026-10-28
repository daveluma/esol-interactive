import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Floating "Picture search" pane: type a word, open Google Images for it in a new tab
// (Google can't be shown inside the page). SafeSearch is always on.
// It sits above full-screen sections too (z-index in styles.css), so it can be used on the board.

const SEARCH_URL = 'https://www.google.com/search';
const OPEN_KEY = 'esol-image-search-open';
const RECENT_KEY = 'esol-image-search-recent';
const MAX_RECENT = 8;

const imageUrl = (q) => `${SEARCH_URL}?tbm=isch&safe=active&q=${encodeURIComponent(q)}`;

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — works for this visit only
  }
}

export default function ImageSearch() {
  const [open, setOpen] = useState(() => load(OPEN_KEY, false));
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(() => load(RECENT_KEY, []));
  const inputRef = useRef(null);

  const toggle = (next) => {
    setOpen(next);
    save(OPEN_KEY, next);
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const remember = (q) => {
    const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    save(RECENT_KEY, next);
  };

  // The form submits natively to Google in a new tab (no popup blocker); this only records it.
  const onSubmit = (e) => {
    const q = query.trim();
    if (!q) {
      e.preventDefault();
      inputRef.current?.focus();
      return;
    }
    remember(q);
    // Clear after the browser has read the field for the submission.
    setTimeout(() => setQuery(''), 0);
  };

  const pane = open ? (
    <aside className="image-search" aria-label="Picture search">
      <div className="image-search-head">
        <strong>🔍 Picture search</strong>
        <button type="button" className="image-search-hide" onClick={() => toggle(false)} aria-label="Hide picture search">
          ✕
        </button>
      </div>
      <form action={SEARCH_URL} method="get" target="_blank" onSubmit={onSubmit} className="image-search-form">
        <input type="hidden" name="tbm" value="isch" />
        <input type="hidden" name="safe" value="active" />
        <input
          ref={inputRef}
          className="text-input"
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. stapler, hole puncher…"
          autoComplete="off"
          enterKeyHint="search"
          aria-label="What picture?"
        />
        <button type="submit" className="btn">
          Show pictures
        </button>
      </form>
      <p className="hint">Opens Google Images in a new tab. Come back to this tab when you are done.</p>
      {recent.length > 0 && (
        <div className="image-search-recent">
          {recent.map((r) => (
            <a key={r} className="chip-btn" href={imageUrl(r)} target="_blank" rel="noreferrer" onClick={() => remember(r)}>
              {r}
            </a>
          ))}
          <button type="button" className="image-search-clear" onClick={() => { setRecent([]); save(RECENT_KEY, []); }}>
            Clear
          </button>
        </div>
      )}
    </aside>
  ) : (
    <button type="button" className="image-search-tab" onClick={() => toggle(true)} aria-label="Open picture search">
      🔍 <span>Pictures</span>
    </button>
  );

  return createPortal(pane, document.body);
}
