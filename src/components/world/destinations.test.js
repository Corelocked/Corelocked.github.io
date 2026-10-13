import { canWalk, destinationPath, destinations, sectionFromLocation } from './destinations';

test('the player cannot walk off an edge or clip through an obstacle', () => {
  const obstacles = [{ x: 0, z: -3, w: 4, d: 4 }];
  expect(canWalk(0, 12, obstacles)).toBe(true);
  expect(canWalk(0, -3, obstacles)).toBe(false);
  expect(canWalk(2.2, -3, obstacles)).toBe(false);
  expect(canWalk(2.4, -3, obstacles)).toBe(true);
  expect(canWalk(23, 0, obstacles)).toBe(false);
  expect(canWalk(0, 22, obstacles)).toBe(false);
  expect(canWalk(21, 20, obstacles)).toBe(false);
});

test('every destination has a direct route that works without walking', () => {
  destinations.forEach(destination => {
    const url = new URL(destinationPath(destination.id), 'https://portfolio.example');
    expect(sectionFromLocation(url.pathname, url.hash)).toBe(destination.id);
    expect(canWalk(destination.x, destination.z + 5.4, [])).toBe(true);
  });
  expect(sectionFromLocation('/cedric-joshua-palapuz', '')).toBe('about');
  expect(sectionFromLocation('/projects/pitaka/info', '')).toBe('project');
  expect(sectionFromLocation('/', '#home')).toBe('');
});
