import { arrivalPosition, canWalk, destinationPath, destinationPoint, destinations, islandBounds, sectionFromLocation } from './destinations';

test('the player cannot walk off an edge or clip through an obstacle', () => {
  const obstacles = [{ x: 0, z: 0, w: 4, d: 4 }];
  expect(canWalk(arrivalPosition.x, arrivalPosition.z, obstacles)).toBe(true);
  expect(canWalk(0, 0, obstacles)).toBe(false);
  expect(canWalk(2.2, 0, obstacles)).toBe(false);
  expect(canWalk(2.4, 0, obstacles)).toBe(true);
  expect(canWalk(islandBounds.x, 0, obstacles)).toBe(false);
  expect(canWalk(0, islandBounds.z, obstacles)).toBe(false);
  expect(canWalk(islandBounds.x-2, islandBounds.z-2, obstacles)).toBe(false);
});

test('every destination has a direct route that works without walking', () => {
  destinations.forEach(destination => {
    const url = new URL(destinationPath(destination.id), 'https://portfolio.example');
    expect(sectionFromLocation(url.pathname, url.hash)).toBe(destination.id);
    const arrival = destinationPoint(destination);
    expect(canWalk(arrival.x, arrival.z, [])).toBe(true);
  });
  expect(sectionFromLocation('/cedric-joshua-palapuz', '')).toBe('about');
  expect(sectionFromLocation('/projects/pitaka/info', '')).toBe('project');
  expect(sectionFromLocation('/', '#home')).toBe('');
});
