import { renderHook, waitFor } from '@testing-library/react';
import { useGitHubContributions } from './useGitHubContributions';

test('reports only contribution years available for the selected user', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      2024: { Corelocked: { totalContributions: 1, weeks: [] } },
      2026: { Corelocked: { totalContributions: 2, weeks: [] } },
    }),
  }));

  const { result } = renderHook(() => useGitHubContributions(2027));

  await waitFor(() => expect(result.current.availableYears).toEqual([2026, 2024]));
  expect(result.current.error).toMatch(/No contribution data/);
});
