import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from './App';

jest.mock('./components/Header', () => () => null);
jest.mock('./components/ResponsivePhone', () => () => null);
jest.mock('./components/SeoManager', () => () => null);
jest.mock('./components/StarryBackground', () => () => null);

test('renders the not-found route', async () => {
  render(
    <MemoryRouter
      initialEntries={['/missing-page']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppContent />
    </MemoryRouter>
  );

  await act(async () => {});
  expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});
