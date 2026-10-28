import React, { useState } from 'react';

// Page zoom for the whole app (e.g. smaller on a laptop, bigger on the board): − / + buttons.
// Saved on this device; index.html applies it before the page draws.
// Full-screen sections cancel it and use their own A−/A+ size instead (see styles.css).

const KEY = 'esol-page-zoom';
// Same steps as a browser's own zoom.
export const ZOOM_LEVELS = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];

function saved() {
  try {
    const z = Number(localStorage.getItem(KEY));
    return ZOOM_LEVELS.includes(z) ? z : 100;
  } catch {
    return 100;
  }
}

function apply(percent) {
  document.documentElement.style.setProperty('--page-zoom', String(percent / 100));
  try {
    localStorage.setItem(KEY, String(percent));
  } catch {
    // storage unavailable — zoom still works for this visit
  }
}

export default function ZoomButtons() {
  const [zoom, setZoom] = useState(saved);
  const i = ZOOM_LEVELS.indexOf(zoom);

  const change = (percent) => {
    setZoom(percent);
    apply(percent);
  };

  return (
    <div className="zoom-buttons" role="group" aria-label="Page zoom">
      <button type="button" className="btn btn-ghost zoom-step" onClick={() => change(ZOOM_LEVELS[i - 1])} disabled={i === 0} aria-label="Zoom out">
        −
      </button>
      <button type="button" className="zoom-value" onClick={() => change(100)} title="Reset to 100%" aria-label={`Zoom ${zoom}%. Reset to 100%`}>
        {zoom}%
      </button>
      <button
        type="button"
        className="btn btn-ghost zoom-step"
        onClick={() => change(ZOOM_LEVELS[i + 1])}
        disabled={i === ZOOM_LEVELS.length - 1}
        aria-label="Zoom in"
      >
        +
      </button>
    </div>
  );
}
