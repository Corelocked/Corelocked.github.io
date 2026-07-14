const puppeteer = require('puppeteer');

const baseUrl = process.env.AUDIT_URL || 'http://127.0.0.1:4173';
const pages = ['/', '/projects', '/contact', '/support', '/projects/lakbay/info'];
const viewports = [
  [320, 568],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1920, 1080],
  [2560, 1080],
  [1280, 600],
];

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const failures = [];

  for (const [width, height] of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width, height });

    for (const path of pages) {
      await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle0' });
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
      const result = await page.evaluate(() => {
        const visible = (element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return !element.closest('[aria-hidden="true"]')
            && style.display !== 'none'
            && style.visibility !== 'hidden'
            && Number(style.opacity) !== 0
            && rect.width
            && rect.height
            && rect.right > 0
            && rect.bottom > 0
            && rect.left < innerWidth
            && rect.top < innerHeight;
        };
        const smallControls = innerWidth <= 768
          ? [...document.querySelectorAll('a, button, input, textarea, select')]
              .filter(visible)
              .filter((element) => {
                const rect = element.getBoundingClientRect();
                return rect.width < 24 || rect.height < 24;
              })
              .slice(0, 5)
              .map((element) => `${element.tagName.toLowerCase()}.${element.className || '(no-class)'}`)
          : [];
        const smallFormText = innerWidth <= 768
          ? [...document.querySelectorAll('input, textarea, select')]
              .filter(visible)
              .filter((element) => parseFloat(getComputedStyle(element).fontSize) < 16)
              .map((element) => element.name || element.id || element.tagName.toLowerCase())
          : [];
        const describe = (element) => {
          const id = element.id ? `#${element.id}` : '';
          const className = typeof element.className === 'string' && element.className
            ? `.${element.className.trim().split(/\s+/).join('.')}`
            : '';
          return `${element.tagName.toLowerCase()}${id}${className}`;
        };
        const hasName = (element) => Boolean(
          element.getAttribute('aria-label')
          || element.getAttribute('aria-labelledby')
          || element.getAttribute('title')
          || element.textContent.trim()
          || element.querySelector('img[alt]:not([alt=""])')
        );
        const duplicateIds = [...document.querySelectorAll('[id]')]
          .map((element) => element.id)
          .filter((id, index, ids) => id && ids.indexOf(id) !== index);
        const a11yIssues = [
          ...[...document.querySelectorAll('img:not([alt])')].map((element) => `missing alt: ${describe(element)}`),
          ...[...document.querySelectorAll('button, a[href]')]
            .filter((element) => !element.closest('[aria-hidden="true"]') && !hasName(element))
            .map((element) => `missing accessible name: ${describe(element)}`),
          ...[...document.querySelectorAll('input:not([type="hidden"]), textarea, select')]
            .filter((element) => !element.closest('[aria-hidden="true"]'))
            .filter((element) => !(element.labels && element.labels.length)
              && !element.getAttribute('aria-label')
              && !element.getAttribute('aria-labelledby')
              && !element.getAttribute('title'))
            .map((element) => `missing form label: ${describe(element)}`),
          ...[...new Set(duplicateIds)].map((id) => `duplicate id: #${id}`),
          ...(document.documentElement.lang ? [] : ['missing document language']),
          ...(document.querySelectorAll('h1').length === 1 ? [] : [`expected one h1, found ${document.querySelectorAll('h1').length}`]),
        ];
        return {
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
          smallControls,
          smallFormText,
          a11yIssues,
        };
      });
      if (result.content > result.viewport + 1) {
        failures.push(`${width}x${height} ${path}: ${result.content}px content in ${result.viewport}px viewport`);
      }
      if (result.smallControls.length) {
        failures.push(`${width}x${height} ${path}: undersized controls ${result.smallControls.join(', ')}`);
      }
      if (result.smallFormText.length) {
        failures.push(`${width}x${height} ${path}: form text below 16px ${result.smallFormText.join(', ')}`);
      }
      if (result.a11yIssues.length) {
        failures.push(`${width}x${height} ${path}: ${result.a11yIssues.slice(0, 8).join('; ')}`);
      }
    }

    await page.close();
  }

  await browser.close();
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log(`Responsive and accessibility audit passed: ${viewports.length} viewports x ${pages.length} pages.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
