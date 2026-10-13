import React, { useState } from 'react';
import { contributionStats } from './worldState';

export default function GitHubShowcase({ contributions, year, onYear }) {
  const { data, loading, error, availableYears } = contributions;
  const [selected, setSelected] = useState(null);
  const stats = contributionStats(data?.weeks);
  const colors = ['#d6dfc5','#abc87e','#789e4e','#547736','#314f27'];
  return <div className="world-collection contribution-showcase">
    <h1>My GitHub activity.</h1>

    <div className="contribution-toolbar"><a href="https://github.com/Corelocked" target="_blank" rel="noreferrer">@Corelocked ↗</a><label>Year <select value={year} onChange={event => { setSelected(null); onYear(Number(event.target.value)); }}>{[...new Set([year,...availableYears])].sort((a,b)=>b-a).map(value=><option key={value}>{value}</option>)}</select></label></div>
    {loading ? <p role="status">Loading activity…</p> : error ? <p role="alert">Activity for {year} is unavailable. Choose another year or <a href="https://github.com/Corelocked" target="_blank" rel="noreferrer">visit GitHub ↗</a>.</p> : <>
      <div className="contribution-stats"><div><strong>{(data?.totalContributions || 0).toLocaleString()}</strong><span>contributions</span></div><div><strong>{stats.active}</strong><span>active days</span></div><div><strong>{stats.longest}</strong><span>longest streak · days</span></div><div><strong>{stats.best}</strong><span>best day</span></div></div>
      <div className="contribution-scroll" tabIndex={0} role="region" aria-label={`Scrollable contribution calendar for ${year}`}><div className="contribution-calendar">
        {(data?.weeks || []).map((week,index)=><div className="contribution-week" key={index}>{week.contributionDays.map(day=>{
          const level = day.contributionCount === 0 ? 0 : day.contributionCount <= 2 ? 1 : day.contributionCount <= 5 ? 2 : day.contributionCount <= 9 ? 3 : 4;
          return <button key={day.date} style={{backgroundColor:colors[level],gridRow:day.weekday+1}} aria-label={`${day.date}: ${day.contributionCount} contributions`} title={`${day.date}: ${day.contributionCount} contributions`} onClick={()=>setSelected(day)} aria-pressed={selected?.date===day.date} />;
        })}</div>)}
      </div></div>
      <div className="contribution-detail"><p aria-live="polite">{selected ? `${selected.date} — ${selected.contributionCount} contribution${selected.contributionCount===1?'':'s'}` : 'Select a date.'}</p><span>Less {colors.map(color=><i key={color} style={{backgroundColor:color}} />)} More</span></div>
    </>}
    <p className="contribution-note">Saved GitHub data. Streaks are measured within the selected year.</p>
    <a className="world-text-link" href="https://github.com/Corelocked?tab=repositories" target="_blank" rel="noreferrer">My repositories ↗</a>
  </div>;
}
