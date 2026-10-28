import React, { useState } from 'react';

// Page zoom for the whole app (e.g. smaller on a laptop, bigger on the board).
// Saved on this device; index.html applies it before the page draws.
// Full-screen sections cancel it and use their own A−/A+ size instead (see styles.css).

const KEY = 'esol-page-zoom';
const MIN = 50;
const MAX = 200;
const STEP = 10;

function saved() {
  try {
    const z = Number(localStorage.getItem(KEY));
    return z >= MIN && z <= MAX ? z : 100;
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

export default function ZoomSlider() {
  const [zoom, setZoom] = useState(saved);

  const change = (percent) => {
    setZoom(percent);
    apply(percent);
  };

  return (
    <div className="zoom-slider">
      <span className="zoom-icon" aria-hidden="true">🔍−</span>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={zoom}
        onChange={(e) => change(Number(e.target.value))}
        aria-label="Page zoom"
        aria-valuetext={`${zoom}%`}
      />
      <span className="zoom-icon" aria-hidden="true">🔍+</span>
      <button type="button" className="zoom-value" onClick={() => change(100)} title="Reset to 100%" aria-label={`Zoom ${zoom}%. Reset to 100%`}>
        {zoom}%
      </button>
    </div>
  );
}
