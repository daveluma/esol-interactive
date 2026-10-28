import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useFullscreen } from '../lib/useFullscreen';
import ThemeToggle from './ThemeToggle';

// Text size used in full screen, remembered on this device (the board).
const ZOOMS = [1, 1.2, 1.4, 1.6, 1.8, 2.1, 2.4];
const ZOOM_KEY = 'esol-board-zoom';

function savedZoom() {
  try {
    const z = Number(localStorage.getItem(ZOOM_KEY));
    return ZOOMS.includes(z) ? z : 1.4;
  } catch {
    return 1.4;
  }
}

// The sections/activities at the same level as `el` (Previous / Next move between these).
function siblingsOf(el) {
  return [...el.parentElement.children].filter((c) => c.classList.contains('collapsible'));
}

const titleOf = (el) => el?.querySelector(':scope > .collapsible-bar .collapsible-title')?.textContent.trim();

export default function Collapsible({ title, icon, meta, defaultOpen = false, className = '', children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const ref = useRef(null);
  const [zoom, setZoom] = useState(savedZoom);
  // Opened full screen from another section: open up and use the current text size.
  const onOpen = useCallback(() => {
    setOpen(true);
    setZoom(savedZoom());
  }, []);
  const { full, enter, exit, switchTo } = useFullscreen(ref, onOpen);

  const changeZoom = (step) => {
    const next = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, ZOOMS.indexOf(zoom) + step))];
    setZoom(next);
    try {
      localStorage.setItem(ZOOM_KEY, String(next));
    } catch {
      // storage unavailable — keep the size for this visit only
    }
  };

  const goFull = (e) => {
    e.stopPropagation();
    onOpen();
    enter();
  };

  // Previous / next section at this level, while in full screen.
  const siblings = full && ref.current ? siblingsOf(ref.current) : [];
  const pos = siblings.indexOf(ref.current);
  const prevEl = siblings[pos - 1];
  const nextEl = siblings[pos + 1];

  // In full screen the bar is pinned at the top; share its height (--full-bar-h)
  // so pinned content inside (e.g. a sticky chart) sits just below it.
  const barRef = useRef(null);
  useEffect(() => {
    if (!full) return undefined;
    const bar = barRef.current;
    const update = () => ref.current?.style.setProperty('--full-bar-h', `${bar.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(bar);
    return () => ro.disconnect();
  }, [full]);

  return (
    <section ref={ref} className={`collapsible ${open ? 'open' : ''} ${full ? 'is-full' : ''} ${className}`}>
      <div className="collapsible-bar" ref={barRef}>
        <button
          type="button"
          className="collapsible-header"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => !full && setOpen((o) => !o)}
        >
          {icon && <span className="collapsible-icon" aria-hidden="true">{icon}</span>}
          <span className="collapsible-title">{title}</span>
          {meta && <span className="collapsible-meta">{meta}</span>}
          {!full && <span className="chevron" aria-hidden="true">▾</span>}
        </button>
        {full ? (
          <div className="full-controls">
            {siblings.length > 1 && (
              <div className="full-nav">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => switchTo(prevEl)}
                  disabled={!prevEl}
                  aria-label={prevEl ? `Previous: ${titleOf(prevEl)}` : 'Previous'}
                  title={prevEl ? titleOf(prevEl) : undefined}
                >
                  ◀ Prev
                </button>
                <span className="full-pos">
                  {pos + 1} / {siblings.length}
                </span>
                <button
                  type="button"
                  className="btn"
                  onClick={() => switchTo(nextEl)}
                  disabled={!nextEl}
                  aria-label={nextEl ? `Next: ${titleOf(nextEl)}` : 'Next'}
                  title={nextEl ? titleOf(nextEl) : undefined}
                >
                  Next ▶
                </button>
              </div>
            )}
            <ThemeToggle />
            <button type="button" className="btn btn-ghost" onClick={() => changeZoom(-1)} disabled={zoom === ZOOMS[0]} aria-label="Smaller text">
              A−
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => changeZoom(1)} disabled={zoom === ZOOMS[ZOOMS.length - 1]} aria-label="Bigger text">
              A+
            </button>
            <button type="button" className="btn btn-exit-full" onClick={exit}>
              ✕ Exit full screen
            </button>
          </div>
        ) : (
          <button type="button" className="btn-fullscreen" onClick={goFull} aria-label="Show this in full screen" title="Full screen">
            ⛶
          </button>
        )}
      </div>
      {open && (
        <div className="collapsible-body" id={id} style={full ? { zoom, '--zoom': zoom } : undefined}>
          {children}
        </div>
      )}
    </section>
  );
}
