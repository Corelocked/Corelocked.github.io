import { neighbors, plantCreepers, revealTiles, matchesBlueprint, blueprints } from './arcadeRules';

test('every first dig and its neighbors are safe with exactly ten creepers', () => {
  for (let first=0;first<64;first++) {
    const mines=plantCreepers(first,()=>.5);
    expect(mines.size).toBe(10);
    expect([first,...neighbors(first)].some(index=>mines.has(index))).toBe(false);
  }
  expect(neighbors(0)).toEqual([1,8,9]);
  expect(neighbors(63)).toEqual([54,55,62]);
});

test('flood reveal preserves flags and never reveals creepers', () => {
  const mines=new Set([63]),flags=new Set([1]),prior=new Set([0]);
  const revealed=revealTiles(0,mines,new Set(),flags);
  expect(revealed.size).toBe(62);
  expect(revealed.has(1)).toBe(false);
  expect(revealed.has(63)).toBe(false);
  expect(revealTiles(1,mines,prior,flags)).toEqual(prior);
  expect(prior.size).toBe(1);
});

test('crafting requires an exact pattern, including empty slots', () => {
  for (const {pattern} of blueprints) {
    expect(matchesBlueprint([...pattern],pattern)).toBe(true);
    expect(matchesBlueprint(pattern.slice(1),pattern)).toBe(false);
    expect(matchesBlueprint(pattern.map((v,i)=>i===0?(v+1)%5:v),pattern)).toBe(false);
  }
});
