import React from 'react';
import { WordPictures } from '../components/SentencePicture';

// Shows "Item 3 of 8" with previous / next buttons.
export function Stepper({ index, total, onPrev, onNext, canNext = true }) {
  return (
    <div className="stepper">
      <button type="button" className="btn btn-ghost btn-small" onClick={onPrev} disabled={index === 0}>
        ← Back
      </button>
      <span className="stepper-count">
        {index + 1} / {total}
      </span>
      <button type="button" className="btn btn-small" onClick={onNext} disabled={!canNext || index === total - 1}>
        Next →
      </button>
    </div>
  );
}

export function Feedback({ status, children }) {
  if (!status) return null;
  return (
    <p className={`feedback feedback-${status}`} role="status">
      {status === 'correct' ? '✅ ' : status === 'wrong' ? '🔁 ' : ''}
      {children}
    </p>
  );
}

export function Score({ correct, total, label = 'correct' }) {
  return (
    <p className="score">
      <strong>{correct}</strong> / {total} {label}
    </p>
  );
}

export function Table({ table }) {
  return (
    <div className="table-wrap">
      {table.caption && <p className="table-caption">{table.caption}</p>}
      <table className="data-table">
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>
                  {typeof cell === 'string' && <WordPictures text={cell} plurals={false} />}
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
