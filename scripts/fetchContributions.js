// scripts/fetchContributions.js
// Run with: node scripts/fetchContributions.js
// Expects env var: GITHUB_TOKEN (or pass via env at runtime)

const fs = require('fs');
const path = require('path');

const GITHUB_API_URL = 'https://api.github.com/graphql';
const token = process.env.GITHUB_TOKEN || process.env.CONTRIB_PAT;
const username = process.env.GITHUB_USERNAME || 'Corelocked';
const yearsEnv = process.env.CONTRIB_YEARS || '2024,2025,2026';
const years = yearsEnv.split(',').map((y) => y.trim());

if (!token) {
  console.error('Missing GITHUB_TOKEN or CONTRIB_PAT environment variable. Aborting.');
  process.exit(1);
}

async function fetchForYear(year) {
  const startDate = `${year}-01-01T00:00:00Z`;
  const endDate = `${year}-12-31T23:59:59Z`;
  const query = `query { user(login: "${username}") { contributionsCollection(from: "${startDate}", to: "${endDate}") { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date weekday } } } } } }`;

  const res = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'fetch-contributions-script'
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message || JSON.stringify(json.errors));
  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error('No contribution data returned');
  return calendar;
}

(async () => {
  try {
    const out = {};
    for (const year of years) {
      console.log('Fetching', year);
      const calendar = await fetchForYear(year);
      out[year] = out[year] || {};
      out[year][username] = calendar;
    }

    const outPath = path.join(process.cwd(), 'public', 'contributions.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', outPath);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
