import React, { useState } from 'react';
import { Feedback } from './shared';
import SpeakButton from '../components/SpeakButton';

// A chart with number blanks to fill in, plus optional questions with model answers.
// table: { caption, columns: [...], rows: [['Classroom 1', 3, 2, { answer: 11 }, 6], ...] }
//   a cell written as { answer: n } becomes a number box.
// context (optional): sentences to read first. hint (optional): e.g. 'Add the numbers.'
// questions (optional): [{ question: 'Where are the calculators?', answer: "They're in the drawer." }]

const isBlank = (cell) => cell && typeof cell === 'object' && 'answer' in cell;

function ChartTable({ table }) {
  const [values, setValues] = useState({});
  const [checked, setChecked] = useState(false);
  const blanks = table.rows.flatMap((row, r) => row.map((cell, c) => (isBlank(cell) ? `${r}-${c}` : null))).filter(Boolean);
  const cellOk = (key, cell) => Number(values[key]) === cell.answer;
  const allOk = table.rows.every((row, r) => row.every((cell, c) => !isBlank(cell) || cellOk(`${r}-${c}`, cell)));

  return (
    <div className="table-wrap">
      {table.caption && <p className="table-caption">{table.caption}</p>}
      <table className="data-table number-chart">
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                const key = `${r}-${c}`;
                if (!isBlank(cell)) return <td key={c}>{cell}</td>;
                const state = checked ? (cellOk(key, cell) ? 'correct' : 'wrong') : '';
                return (
                  <td key={c}>
                    <input
                      className={`num-input ${state}`}
                      type="number"
                      inputMode="numeric"
                      aria-label={`${row[0]} — ${table.columns[c]}`}
                      value={values[key] ?? ''}
                      onChange={(e) => {
                        setValues({ ...values, [key]: e.target.value });
                        setChecked(false);
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {blanks.length > 0 && (
        <>
          <div className="btn-row">
            <button type="button" className="btn" onClick={() => setChecked(true)}>
              Check
            </button>
          </div>
          {checked && (
            <Feedback status={allOk ? 'correct' : 'wrong'}>
              {allOk ? 'All correct!' : 'Not yet — check the red boxes. Add the numbers again.'}
            </Feedback>
          )}
        </>
      )}
    </div>
  );
}

function QuestionItem({ q, number }) {
  const [shown, setShown] = useState(false);
  return (
    <li className="qa-item">
      <p>
        <span className="mc-num">{number}.</span> {q.question} <SpeakButton small text={q.question} />
      </p>
      {shown ? (
        <p className="model-answer">
          {q.answer} <SpeakButton small text={q.answer} />
        </p>
      ) : (
        <button type="button" className="btn btn-ghost btn-small" onClick={() => setShown(true)}>
          Say your answer, then check
        </button>
      )}
    </li>
  );
}

export default function NumberChart({ table, context, hint, questions }) {
  return (
    <div className="number-chart-activity">
      {context && (
        <div className="context-box">
          {context.map((s) => (
            <p key={s}>
              {s} <SpeakButton small text={s} />
            </p>
          ))}
        </div>
      )}
      {hint && <p className="hint-box">💡 {hint}</p>}
      <ChartTable table={table} />
      {questions?.length > 0 && (
        <ol className="qa-list">
          {questions.map((q, i) => (
            <QuestionItem key={q.question} q={q} number={i + 1} />
          ))}
        </ol>
      )}
    </div>
  );
}
