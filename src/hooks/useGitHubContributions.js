import { useState, useEffect } from 'react';

const GITHUB_API_URL = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

/**
 * Attempts to load contribution data from a prebuilt JSON file first (generated at build time).
 * Falls back to calling the GitHub GraphQL API only when a local token is available (dev).
 */
export const useGitHubContributions = (year, username = 'Corelocked') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const isPrerender = typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';

    if (isPrerender) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    const fetchFromStatic = async () => {
      try {
        setLoading(true);
        const res = await fetch('/contributions.json');
        if (!res.ok) return false;
        const json = await res.json();
        const entry = json?.[String(year)]?.[username];
        if (entry && mounted) {
          setData(entry);
          setLoading(false);
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    };

    const fetchFromGitHub = async () => {
      if (!GITHUB_TOKEN) {
        setError('GitHub token not configured. Add REACT_APP_GITHUB_TOKEN to .env for local development.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const startDate = `${year}-01-01T00:00:00Z`;
        const endDate = `${year}-12-31T23:59:59Z`;
        const query = `
          query {
            user(login: "${username}") {
              contributionsCollection(from: "${startDate}", to: "${endDate}") {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      weekday
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(GITHUB_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const result = await response.json();
        if (result.errors) throw new Error(result.errors[0].message);
        const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) throw new Error('No contribution data found');
        if (mounted) setData(calendar);
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    (async () => {
      const usedStatic = await fetchFromStatic();
      if (!usedStatic) await fetchFromGitHub();
    })();

    return () => {
      mounted = false;
    };
  }, [year, username]);

  return { data, loading, error };
};
