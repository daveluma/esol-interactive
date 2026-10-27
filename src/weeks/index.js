// All weeks, one file each. To add a week: copy a week file, change it, and add it to this list.
// The id is the Wednesday date (YYYY-MM-DD); it is also the URL (#/2026-10-28) and the slides folder name.
import w20261028 from './2026-10-28';
import w20261104 from './2026-11-04';
import w20261111 from './2026-11-11';
import w20261118 from './2026-11-18';

export const WEEKS = [w20261028, w20261104, w20261111, w20261118].sort((a, b) => a.id.localeCompare(b.id));

function todayId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// This week's Wednesday (today's, or the next one); after the last week, the last week.
export function defaultWeekId() {
  const today = todayId();
  return (WEEKS.find((w) => w.id >= today) ?? WEEKS[WEEKS.length - 1]).id;
}
