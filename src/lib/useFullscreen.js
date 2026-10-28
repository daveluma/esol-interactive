import { useEffect, useState } from 'react';

// Full screen for one section or activity (for the classroom touch board).
// The browser goes full screen for the whole page, and the chosen element is shown as a
// fixed layer on top of it (the component adds the `is-full` class). Moving to the
// previous/next section just moves that layer, so the browser never leaves full screen.
// If the browser refuses full screen, the layer still fills the window.

const OPEN_EVENT = 'fullscreen-open';

const fsElement = () => document.fullscreenElement ?? document.webkitFullscreenElement ?? null;

export function useFullscreen(ref, onOpen) {
  const [full, setFull] = useState(false);

  // Another section handed full screen to this one (Previous / Next).
  useEffect(() => {
    const el = ref.current;
    const onHandOver = () => {
      onOpen?.();
      setFull(true);
    };
    el.addEventListener(OPEN_EVENT, onHandOver);
    return () => el.removeEventListener(OPEN_EVENT, onHandOver);
  }, [ref, onOpen]);

  useEffect(() => {
    if (!full) return undefined;
    ref.current.scrollTop = 0;
    // Browser left full screen (Esc, F11…) → close the layer too.
    const onChange = () => !fsElement() && setFull(false);
    // Esc when the browser had refused full screen.
    const onKey = (e) => e.key === 'Escape' && !fsElement() && setFull(false);
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('has-overlay');
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('has-overlay');
    };
  }, [full, ref]);

  const enter = async () => {
    setFull(true);
    if (fsElement()) return;
    const root = document.documentElement;
    const request = root.requestFullscreen ?? root.webkitRequestFullscreen;
    try {
      await request?.call(root);
    } catch {
      // blocked (e.g. inside a frame) — the layer still fills the window
    }
  };

  const exit = () => {
    setFull(false);
    if (fsElement()) (document.exitFullscreen ?? document.webkitExitFullscreen).call(document);
    // Land on the section that was showing.
    requestAnimationFrame(() => ref.current?.scrollIntoView({ block: 'start' }));
  };

  // Show another section full screen instead of this one.
  const switchTo = (el) => {
    setFull(false);
    el.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return { full, enter, exit, switchTo };
}
