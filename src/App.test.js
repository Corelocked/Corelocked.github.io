import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from './App';

jest.mock('./components/SeoManager', () => () => null);
jest.mock('./components/world/createVoxelWorld', () => () => ({ dispose: jest.fn(), pause: jest.fn(), start: jest.fn() }));
jest.mock('./hooks/useGitHubContributions', () => ({ useGitHubContributions: () => ({ data:null,loading:false,error:null,availableYears:[] }) }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});

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
  expect(screen.getByRole('heading', { level:1, name: /page not found/i })).toBeInTheDocument();
});

test('visitors can reach projects directly from the portfolio menu without entering 3D', async () => {
  render(<MemoryRouter initialEntries={['/#guide']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppContent /></MemoryRouter>);
  await act(async () => {});
  fireEvent.click(screen.getByRole('link', { name: /open projects/i }));
  expect(await screen.findByRole('heading', { level:1, name: /my work/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /pitaka/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Mobile App' }));
  expect(screen.queryByRole('heading', { name: /nebuladm/i })).not.toBeInTheDocument();
});

test('project field notes retain the route slug', async () => {
  render(<MemoryRouter initialEntries={['/projects/pitaka/info']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppContent /></MemoryRouter>);
  expect(await screen.findByRole('heading', { level: 1, name: 'Pitaka' })).toBeInTheDocument();
});

test('inventory switches lighting and chat accepts portfolio questions', async () => {
  render(<MemoryRouter initialEntries={['/#inventory']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppContent /></MemoryRouter>);
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', {name:/night/i}));
  expect(document.querySelector('main')).toHaveAttribute('data-lighting','night');
  expect(localStorage.getItem('portfolio-world-lighting')).toBe('night');
  fireEvent.click(screen.getByRole('button',{name:/close portfolio/i}));
  fireEvent.keyDown(window,{code:'KeyT'});
  const input=screen.getByRole('textbox',{name:/message the portfolio assistant/i});
  fireEvent.change(input,{target:{value:'GitHub contributions'}});
  fireEvent.click(screen.getByRole('button',{name:/send/i}));
  expect(within(screen.getByRole('log')).getByRole('link',{name:/github activity/i})).toHaveAttribute('href','/#github');
  fireEvent.change(input,{target:{value:'/clear'}});
  fireEvent.click(screen.getByRole('button',{name:/send/i}));
  expect(screen.getByText(/chat cleared/i)).toBeInTheDocument();
});

test('introduces Cedric and keeps the pause screen minimal', async () => {
  render(<MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppContent /></MemoryRouter>);
  await act(async () => {});
  expect(screen.getByRole('heading',{name:/I design the interface/i})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/let me show you/i}));
  fireEvent.click(screen.getByRole('button',{name:'Pause'}));
  expect(screen.getByRole('button',{name:'Continue'})).toBeInTheDocument();
  expect(screen.getByRole('heading',{name:/Let me show you more/i})).toBeInTheDocument();
  expect(screen.queryByText(/breather|your adventure/i)).not.toBeInTheDocument();
});
