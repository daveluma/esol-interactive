import { useEffect, useState } from 'react';

// Light / dark theme. The choice is saved on this device; with no saved choice the app
// follows the device setting. index.html applies it before the first paint.

const KEY = 'esol-theme';
const root = document.documentElement;

function savedTheme() {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

function apply(theme) {
  root.setAttribute('data-theme', theme);
  window.dispatchEvent(new Event('themechange'));
}

export function currentTheme() {
  return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // storage unavailable — the theme still changes for this visit
  }
  apply(theme);
}

// Follow the device setting until someone picks a theme.
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
  if (!savedTheme()) apply(e.matches ? 'dark' : 'light');
});

export function useTheme() {
  const [theme, setState] = useState(currentTheme);
  useEffect(() => {
    const onChange = () => setState(currentTheme());
    window.addEventListener('themechange', onChange);
    return () => window.removeEventListener('themechange', onChange);
  }, []);
  return [theme, () => setTheme(theme === 'dark' ? 'light' : 'dark')];
}
