import seed from '../data/highscores.json';

const KEY = 'portfolio_highscores_v1';

function readStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...seed };
    const parsed = JSON.parse(raw);
    return { ...seed, ...parsed };
  } catch (e) {
    return { ...seed };
  }
}

export function getHighscore(gameKey) {
  const store = readStore();
  return store[gameKey] ?? 0;
}

export function setHighscore(gameKey, value) {
  try {
    const store = readStore();
    store[gameKey] = Math.max(store[gameKey] ?? 0, value);
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch (e) {
    // ignore
  }
}

export function resetHighscores() {
  try {
    localStorage.setItem(KEY, JSON.stringify(seed));
  } catch (e) {}
}
