const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src', 'data', 'projects.js'), 'utf8');
const projectPaths = [...source.matchAll(/\bslug:\s*'([^']+)'/g)]
  .map((match) => `/projects/${match[1]}/info`);
const pages = [
  ['/', 'weekly', '1.0'],
  ['/cedric-joshua-palapuz', 'monthly', '0.9'],
  ['/projects', 'weekly', '0.9'],
  ...projectPaths.map((url) => [url, 'monthly', '0.8']),
  ['/contact', 'monthly', '0.7'],
  ['/support', 'monthly', '0.6'],
];

const urls = pages.map(([url, changefreq, priority]) => `  <url>
    <loc>https://corelocked.github.io${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap);
console.log(`Generated sitemap with ${pages.length} URLs.`);
