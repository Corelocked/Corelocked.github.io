export const MINE_SIZE = 8;
export const CREEPER_COUNT = 10;

export function neighbors(index, size = MINE_SIZE) {
  const cells = [];
  for (let y=-1;y<=1;y++) for (let x=-1;x<=1;x++) {
    const row=Math.floor(index/size)+y, col=index%size+x;
    if ((x || y) && row>=0 && col>=0 && row<size && col<size) cells.push(row*size+col);
  }
  return cells;
}

export function plantCreepers(first, random = Math.random) {
  const safe = new Set([first,...neighbors(first)]);
  const candidates = Array.from({length:MINE_SIZE*MINE_SIZE},(_,i)=>i).filter(i=>!safe.has(i));
  for (let i=candidates.length-1;i>0;i--) {
    const j=Math.floor(random()*(i+1));
    [candidates[i],candidates[j]]=[candidates[j],candidates[i]];
  }
  return new Set(candidates.slice(0,CREEPER_COUNT));
}

export function revealTiles(first, mines, revealed, flags) {
  const result=new Set(revealed), pending=[first];
  while (pending.length) {
    const index=pending.pop();
    if (result.has(index) || flags.has(index) || mines.has(index)) continue;
    result.add(index);
    const around=neighbors(index);
    if (!around.some(cell=>mines.has(cell))) pending.push(...around);
  }
  return result;
}

export const blueprints = [
  {name:'Trail lantern',pattern:[0,2,0,2,3,2,0,2,0]},
  {name:'Garden gate',pattern:[1,0,1,1,1,1,1,0,1]},
  {name:'Explorer’s compass',pattern:[0,3,0,3,4,3,0,3,0]},
  {name:'Diamond pick',pattern:[4,4,4,0,1,0,0,1,0]},
];

export function matchesBlueprint(grid, pattern) {
  return grid.length===pattern.length && grid.every((value,index)=>value===pattern[index]);
}
