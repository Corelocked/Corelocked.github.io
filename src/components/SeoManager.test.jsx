import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeoManager from './SeoManager';

test('canonicalizes project demos to their indexable case study', async () => {
  render(
    <MemoryRouter
      initialEntries={['/projects/blogshark']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SeoManager />
    </MemoryRouter>
  );

  const caseStudyUrl = 'https://corelocked.github.io/projects/blogshark/info';

  await waitFor(() => {
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', caseStudyUrl);
  });

  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute('content', caseStudyUrl);

  const graph = JSON.parse(document.getElementById('seo-route-jsonld').textContent);
  const software = graph.find((entry) => entry['@type'] === 'SoftwareApplication');
  const source = graph.find((entry) => entry['@type'] === 'SoftwareSourceCode');

  expect(software.url).toBe(caseStudyUrl);
  expect(software.creator['@id']).toBe('https://corelocked.github.io/#person');
  expect(source.codeRepository).toBe('https://github.com/Corelocked/dywebFinals.git');
  expect(source.programmingLanguage).toEqual(['JavaScript', 'CSS']);
});
