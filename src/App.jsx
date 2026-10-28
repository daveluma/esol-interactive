import React, { useEffect } from 'react';
import { WEEKS, defaultWeekId } from './weeks';
import { useHashRoute } from './lib/useHashRoute';
import WeekPage from './components/WeekPage';
import GamesPage from './games/GamesPage';
import OptionsMenu from './components/OptionsMenu';
import ImageSearch from './components/ImageSearch';

const GAMES_ID = 'games';
const logoUrl = new URL('./assets/covlife-logo.png', import.meta.url).href;

export default function App() {
  const [route, navigate] = useHashRoute();
  const week = WEEKS.find((w) => w.id === route);
  const current = route === GAMES_ID ? GAMES_ID : week ? week.id : null;

  useEffect(() => {
    if (!current) navigate(defaultWeekId());
  }, [current]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">🌐︎</span>
          <div>
            <h1>ESOL Beginner 2</h1>
            <p className="brand-sub">Wednesday practice · Do it · Say it · Use it</p>
          </div>
          <OptionsMenu weeks={WEEKS} current={current} gamesId={GAMES_ID} />
        </div>
      </header>

      <main className="main">
        {current === GAMES_ID && <GamesPage />}
        {week && <WeekPage week={week} />}
      </main>

      <footer className="site-footer">
        <span>ESOL Beginner 2 ·</span>
        <a href="https://www.covlife.org/" target="_blank" rel="noreferrer" className="footer-logo">
          <img src={logoUrl} alt="Covenant Life Church" />
        </a>
      </footer>
      <ImageSearch />
    </div>
  );
}
