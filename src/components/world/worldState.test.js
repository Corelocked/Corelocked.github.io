import { daylightAt, contributionStats } from './worldState';

test('automatic lighting follows local time and manual modes override it', () => {
  const at = hour => new Date(2026, 9, 13, hour);
  expect(daylightAt('auto',at(0))).toBe(0);
  expect(daylightAt('auto',at(12))).toBe(1);
  expect(daylightAt('auto',at(6))).toBeCloseTo(.5);
  expect(daylightAt('auto',at(18))).toBeCloseTo(.5);
  expect(daylightAt('day',at(0))).toBe(1);
  expect(daylightAt('night',at(12))).toBe(0);
});

test('contribution streaks stop at inactive or missing dates', () => {
  const contributionDays = [['2026-01-05',3],['2026-01-01',1],['2026-01-02',2],['2026-01-03',0],['2026-01-07',4]].map(([date,contributionCount])=>({date,contributionCount}));
  expect(contributionStats([{contributionDays}])).toEqual({active:4,best:4,longest:2});
  expect(contributionStats()).toEqual({active:0,best:0,longest:0});
});
