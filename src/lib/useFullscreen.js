import { useEffect, useState } from 'react';

// Puts one element in full screen (for the classroom touch board) and back.
// Uses the browser's Fullscreen API; if that is missing or blocked, falls back to
// a CSS overlay that fills the window (the component adds the `is-full` class).

const fsElement = () => document.fullscreenElement ?? document.webkitFullscreenElement ?? null;

export function useFullscreen(ref) {
  const [full, setFull] = useState(false);
  const [overlay, setOverlay] = useState(false); // true when using the CSS fallback

  useEffect(() => {
    const onChange = () => setFull(fsElement() === ref.current);
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, [ref]);

  // Esc closes the fallback overlay too (the real full screen handles Esc itself).
  useEffect(() => {
    if (!overlay) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOverlay(false);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('has-overlay');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('has-overlay');
    };
  }, [overlay]);

  const enter = async () => {
    const el = ref.current;
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (request) {
      try {
        await request.call(el);
        return;
      } catch {
        // blocked (e.g. inside a frame) — use the overlay instead
      }
    }
    setOverlay(true);
  };

  const exit = () => {
    if (overlay) setOverlay(false);
    else if (fsElement()) (document.exitFullscreen ?? document.webkitExitFullscreen).call(document);
  };

  return { full: full || overlay, overlay, enter, exit };
}
