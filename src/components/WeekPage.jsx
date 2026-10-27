import React from 'react';
import Collapsible from './Collapsible';
import ActivityCard from './ActivityCard';
import PowerPointSection from './PowerPointSection';
import GoodNews from './GoodNews';

function ActivityList({ activities }) {
  if (!activities?.length) {
    return <p className="empty-state">Activities for this week are coming soon.</p>;
  }
  return (
    <div className="activity-list">
      {activities.map((a, i) => (
        <ActivityCard key={`${a.type}-${i}`} activity={a} number={i + 1} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

export default function WeekPage({ week }) {
  return (
    <article className="week" key={week.id}>
      <div className="week-hero">
        <p className="week-date">{week.dateLabel}</p>
        <h2>{week.title}</h2>
        {week.subtitle && <p className="week-subtitle">{week.subtitle}</p>}
        {week.goals?.length > 0 && (
          <div className="goals">
            <h3>Today I can…</h3>
            <ul>
              {week.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Collapsible className="section section-ppt" icon="📊" title="PowerPoint" defaultOpen={false}>
        <PowerPointSection weekId={week.id} powerpoint={week.powerpoint} />
      </Collapsible>

      <Collapsible className="section section-activities" icon="🎯" title="Interactive Activities" defaultOpen>
        <ActivityList activities={week.activities} />
      </Collapsible>

      <Collapsible className="section section-practical" icon="🧰" title="Practical English — Work & Life" defaultOpen>
        {week.practical?.intro && <p className="section-intro">{week.practical.intro}</p>}
        <ActivityList activities={week.practical?.activities} />
      </Collapsible>

      {week.goodNews && (
        <Collapsible className="section section-good-news" icon="✝️" title="THE GOOD NEWS" defaultOpen>
          <GoodNews goodNews={week.goodNews} />
        </Collapsible>
      )}
    </article>
  );
}
