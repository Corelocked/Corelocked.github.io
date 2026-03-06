import React from 'react';
import './ContributionHeatmap.css';

const getContributionLevel = (count) => {
  if (count <= 0) return 'none';
  if (count <= 2) return 'low';
  if (count <= 5) return 'mid';
  if (count <= 9) return 'high';
  return 'max';
};

const ContributionHeatmap = ({ weeks = [], totalContributions = 0, year, loading, error }) => {
  if (loading) {
    return (
      <div className="phone-heatmap-state" role="status" aria-live="polite">
        Loading contributions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="phone-heatmap-state error" role="alert">
        <span>{error}</span>
        <a href="https://github.com/Corelocked" target="_blank" rel="noreferrer">
          View on GitHub
        </a>
      </div>
    );
  }

  if (!Array.isArray(weeks) || weeks.length === 0) {
    return (
      <div className="phone-heatmap-state" role="status" aria-live="polite">
        No contribution data found for {year}.
      </div>
    );
  }

  const monthByWeek = weeks.map((week, index) => {
    const currentWeekDate = week?.contributionDays?.[0]?.date;
    if (!currentWeekDate) return '';

    const currentMonth = new Date(currentWeekDate).toLocaleDateString('en-US', { month: 'short' });
    if (index === 0) return currentMonth;

    const previousWeekDate = weeks[index - 1]?.contributionDays?.[0]?.date;
    if (!previousWeekDate) return currentMonth;

    const previousMonth = new Date(previousWeekDate).toLocaleDateString('en-US', { month: 'short' });
    return currentMonth !== previousMonth ? currentMonth : '';
  });

  return (
    <div className="phone-heatmap" aria-label={`GitHub contributions for ${year}`}>
      <div className="phone-heatmap-months" aria-hidden="true">
        {monthByWeek.map((label, index) => (
          <span key={`month-${index}`}>{label}</span>
        ))}
      </div>

      <div className="phone-heatmap-grid-wrap">
        <div className="phone-heatmap-grid" role="img" aria-label={`${totalContributions} contributions in ${year}`}>
          {weeks.map((week, weekIndex) => (
            <div className="phone-heatmap-week" key={`week-${weekIndex}`}>
              {week.contributionDays.map((day) => {
                const level = getContributionLevel(day.contributionCount);
                const dateLabel = new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <button
                    key={day.date}
                    type="button"
                    className={`phone-heatmap-day ${level}`}
                    title={`${dateLabel}: ${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`}
                    aria-label={`${dateLabel} - ${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="phone-heatmap-footer">
        <span>{totalContributions.toLocaleString()} contributions</span>
        <div className="phone-heatmap-legend" aria-hidden="true">
          <span>Less</span>
          <i className="phone-heatmap-day none" />
          <i className="phone-heatmap-day low" />
          <i className="phone-heatmap-day mid" />
          <i className="phone-heatmap-day high" />
          <i className="phone-heatmap-day max" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionHeatmap;
