import React from 'react';
import { useTheme } from '../lib/theme';

// Switches between light and dark. The label names the mode you switch TO.
export default function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const toDark = theme === 'light';
  return (
    <button
      type="button"
      className="btn btn-ghost btn-theme"
      onClick={toggle}
      aria-label={toDark ? 'Switch to dark mode' : 'Switch to light mode'}
      title={toDark ? 'Dark mode' : 'Light mode'}
    >
      {toDark ? '🌙' : '☀️'}
    </button>
  );
}
