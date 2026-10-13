export function daylightAt(mode, date = new Date()) {
  if (mode === 'day') return 1;
  if (mode === 'night') return 0;
  const hour = date.getHours() + date.getMinutes() / 60;
  return Math.max(0, Math.min(1, 0.5 + Math.sin((hour - 6) / 24 * Math.PI * 2) * 2));
}

export function contributionStats(weeks = []) {
  const days = weeks.flatMap(week => week.contributionDays || []).slice().sort((a,b) => a.date.localeCompare(b.date));
  let longest = 0, streak = 0, previous = '';
  for (const day of days) {
    const consecutive = previous && Date.parse(day.date) - Date.parse(previous) === 86400000;
    streak = day.contributionCount > 0 ? (consecutive ? streak + 1 : 1) : 0;
    longest = Math.max(longest, streak);
    previous = day.date;
  }
  return { active: days.filter(day => day.contributionCount > 0).length, best: Math.max(0,...days.map(day => day.contributionCount)), longest };
}
