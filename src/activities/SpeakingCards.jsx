import React, { useState } from 'react';
import SpeakButton from '../components/SpeakButton';
import { WordPictures } from '../components/SentencePicture';
import { picturesIn } from '../lib/pictures';
import { shuffle } from '../lib/objects';

// Speaking station: one prompt card at a time. Ask your partner; your partner answers.
// cards: ['Where is the clock?', { prompt: 'How many rulers are there?', model: 'There are 12 rulers.' }]
// decks (instead of cards): [{ name: 'Station 1 — Location', cards: [...] }]
// frames (optional): answer patterns shown under the card, e.g. ["It's in / on / under the ___."]

const toCard = (c) => (typeof c === 'string' ? { prompt: c } : c);

function Deck({ cards, frames }) {
  const [order, setOrder] = useState(() => shuffle(cards.map(toCard)));
  const [index, setIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const card = order[index];

  const next = () => {
    setShowModel(false);
    if (index + 1 < order.length) setIndex(index + 1);
    else {
      setOrder(shuffle(order));
      setIndex(0);
    }
  };

  const previous = () => {
    setShowModel(false);
    setIndex(index - 1);
  };

  return (
    <div className="speaking-deck">
      <div className="speaking-card">
        {card.emoji ? (
          <span className="card-emoji" aria-hidden="true">{card.emoji}</span>
        ) : (
          picturesIn(card.prompt).length > 0 && (
            <span className="card-emoji">
              <WordPictures text={card.prompt} />
            </span>
          )
        )}
        <p className="card-prompt">{card.prompt}</p>
        <SpeakButton text={card.prompt} />
      </div>
      {frames && (
        <div className="frames">
          {frames.map((f) => (
            <span key={f} className="chip">{f}</span>
          ))}
        </div>
      )}
      {card.model && (
        <div className="model-row">
          {showModel ? (
            <p className="model-answer">
              {card.model} <SpeakButton small text={card.model} />
            </p>
          ) : (
            <button type="button" className="btn btn-ghost btn-small" onClick={() => setShowModel(true)}>
              Show an example answer
            </button>
          )}
        </div>
      )}
      <div className="btn-row">
        <button type="button" className="btn btn-ghost" onClick={previous} disabled={index === 0}>
          ← Previous
        </button>
        <span className="stepper-count">
          {index + 1} / {order.length}
        </span>
        <button type="button" className="btn" onClick={next}>
          Next card →
        </button>
      </div>
    </div>
  );
}

export default function SpeakingCards({ cards, decks, frames }) {
  const all = decks ?? [{ name: null, cards, frames }];
  const [d, setD] = useState(0);
  const deck = all[d];

  return (
    <div className="speaking-cards">
      {all.length > 1 && (
        <div className="mode-tabs" role="tablist">
          {all.map((x, i) => (
            <button
              key={x.name}
              type="button"
              role="tab"
              aria-selected={d === i}
              className={`btn btn-small ${d === i ? '' : 'btn-ghost'}`}
              onClick={() => setD(i)}
            >
              {x.name}
            </button>
          ))}
        </div>
      )}
      <Deck key={d} cards={deck.cards} frames={deck.frames ?? frames} />
    </div>
  );
}
