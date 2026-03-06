import { useState, useEffect } from 'react';

const GITHUB_API_URL = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

/**
 * Fetches GitHub contribution data for a specific year
 * @param {number} year - Year to fetch contributions for (e.g., 2024)
 * @param {string} username - GitHub username (e.g., 'Corelocked')
 * @returns {Object} { data, loading, error }
 */
export const useGitHubContributions = (year, username = 'Corelocked') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!GITHUB_TOKEN) {
      setError('GitHub token not configured. Add REACT_APP_GITHUB_TOKEN to .env');
      setLoading(false);
      return;
    }

    const fetchContributions = async () => {
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

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
          throw new Error('No contribution data found');
        }

        setData(calendar);
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [year, username]);

  return { data, loading, error };
};
