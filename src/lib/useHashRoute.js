import { useEffect, useState } from 'react';

// Hash-based routing (#/2026-10-28, #/games) so the site works on GitHub Pages
// without any server-side rewrite rules.
function readHash() {
  return window.location.hash.replace(/^#\/?/, '');
}

export function useHashRoute() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (next) => {
    window.location.hash = `/${next}`;
  };

  return [route, navigate];
}
