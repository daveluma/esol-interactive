import React from 'react';
import Collapsible from '../components/Collapsible';
import MemoryMatch from './MemoryMatch';
import IsAreSort from './IsAreSort';
import LocationScene from '../activities/LocationScene';
import Demonstratives from '../activities/Demonstratives';

// Extra practice that is not tied to one week. To add a game: make a component and add it to GAMES.

const CLASSROOM = ['book', 'pencil', 'pen', 'ruler', 'notebook', 'laptop', 'clock', 'globe', 'scissors', 'paperclip', 'marker', 'calculator', 'calendar', 'dictionary', 'stapler', 'eraser', 'map', 'holepuncher'];
const EVERYDAY = ['keys', 'phone', 'bag', 'wallet', 'glasses', 'folder', 'cup', 'gloves', 'box', 'hammer', 'knife', 'broom'];

const GAMES = [
  { id: 'memory', icon: '🃏', title: 'Memory match — classroom words', render: () => <MemoryMatch objectIds={CLASSROOM} /> },
  { id: 'memory-life', icon: '🃏', title: 'Memory match — everyday things', render: () => <MemoryMatch objectIds={EVERYDAY} /> },
  { id: 'is-are', icon: '⚡', title: 'Quick sort: is or are?', render: () => <IsAreSort /> },
  { id: 'where', icon: '📍', title: 'Where is it? (random pictures)', render: () => <LocationScene practiceObjects={[...CLASSROOM, ...EVERYDAY]} /> },
  { id: 'this-that', icon: '👉', title: 'This / that / these / those (random)', render: () => <Demonstratives practiceObjects={[...CLASSROOM, ...EVERYDAY]} /> },
];

// Free outside sites for adult learners. Add more here.
const LINKS = [
  { href: 'https://www.usalearns.org/', name: 'USA Learns', note: 'Free English course for adults, with video.' },
  { href: 'https://learnenglish.britishcouncil.org/', name: 'British Council LearnEnglish', note: 'Grammar and vocabulary games and exercises.' },
  { href: 'https://www.gamestolearnenglish.com/', name: 'Games to Learn English', note: 'Vocabulary and sentence games.' },
  { href: 'https://www.eslgamesplus.com/', name: 'ESL Games Plus', note: 'Grammar and vocabulary games.' },
  { href: 'https://www.manythings.org/', name: 'ManyThings.org', note: 'Quizzes, word games and listening practice.' },
];

export default function GamesPage() {
  return (
    <article className="week games">
      <div className="week-hero">
        <p className="week-date">Any day</p>
        <h2>Games &amp; extra practice</h2>
        <p className="week-subtitle">Practice at home or in class. Every game makes new questions each time.</p>
      </div>

      {GAMES.map((g) => (
        <Collapsible key={g.id} className="section" icon={g.icon} title={g.title}>
          {g.render()}
        </Collapsible>
      ))}

      <Collapsible className="section" icon="🌐" title="More English games online">
        <ul className="link-list">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noreferrer">
                {l.name} ↗
              </a>
              <small>{l.note}</small>
            </li>
          ))}
        </ul>
      </Collapsible>
    </article>
  );
}
