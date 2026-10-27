import React, { useEffect } from 'react';
import { WEEKS, defaultWeekId } from './weeks';
import { useHashRoute } from './lib/useHashRoute';
import WeekPage from './components/WeekPage';
import GamesPage from './games/GamesPage';

const GAMES_ID = 'games';

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
          <span className="brand-mark" aria-hidden="true">🍇</span>
          <div>
            <h1>ESOL Beginner 2</h1>
            <p className="brand-sub">Wednesday practice · Do it · Say it · Use it</p>
          </div>
        </div>
        <nav className="tabs" aria-label="Weeks">
          {WEEKS.map((w) => (
            <a
              key={w.id}
              href={`#/${w.id}`}
              className={`tab ${current === w.id ? 'active' : ''}`}
              aria-current={current === w.id ? 'page' : undefined}
            >
              <span className="tab-date">{w.tabLabel}</span>
              <span className="tab-topic">{w.tabTopic}</span>
            </a>
          ))}
          <a
            href={`#/${GAMES_ID}`}
            className={`tab tab-games ${current === GAMES_ID ? 'active' : ''}`}
            aria-current={current === GAMES_ID ? 'page' : undefined}
          >
            <span className="tab-date">Games</span>
            <span className="tab-topic">Extra practice</span>
          </a>
        </nav>
      </header>

      <main className="main">
        {current === GAMES_ID && <GamesPage />}
        {week && <WeekPage week={week} />}
      </main>

      <footer className="site-footer">ESOL Beginner 2 · Wednesday class · 6:30–8:15 PM</footer>
    </div>
  );
}
