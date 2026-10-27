import React from 'react';
import Collapsible from './Collapsible';
import TaskHelp from './TaskHelp';
import { ACTIVITY_TYPES } from '../activities';

export default function ActivityCard({ activity, number, defaultOpen }) {
  const Component = ACTIVITY_TYPES[activity.type];
  const { title, source, skill, instructions, cues, glossary } = activity;

  return (
    <Collapsible
      className="activity-card"
      title={
        <>
          <span className="activity-num">{number}</span> {title}
        </>
      }
      meta={
        <>
          {skill && <span className="chip chip-skill">{skill}</span>}
          {source && <span className="chip">{source}</span>}
        </>
      }
      defaultOpen={defaultOpen}
    >
      {instructions && <p className="instructions">{instructions}</p>}
      <TaskHelp cues={cues} glossary={glossary} />
      {Component ? (
        <Component {...activity} />
      ) : (
        <p className="error">Unknown activity type “{activity.type}”. Register it in src/activities/index.js.</p>
      )}
    </Collapsible>
  );
}
