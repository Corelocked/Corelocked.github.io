import { useEffect, useState } from 'react';

export const useGitHubContributions = (year, username = 'Corelocked') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/contributions.json');
        if (!response.ok) throw new Error(`Contribution data request failed: ${response.status}`);

        const json = await response.json();
        const years = Object.keys(json || {})
          .filter((key) => json[key]?.[username])
          .map(Number)
          .filter(Number.isInteger)
          .sort((a, b) => b - a);
        if (!cancelled) setAvailableYears(years);
        const entry = json?.[String(year)]?.[username];
        if (!entry) throw new Error(`No contribution data for ${username} in ${year}`);

        if (!cancelled) setData(entry);
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [year, username]);

  return { data, loading, error, availableYears };
};
