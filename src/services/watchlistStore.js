const STORAGE_KEY = 'bbs_watchlist';

const DEFAULT_SYMBOLS = [
  { symbol: 'AAPL', stance: 'Long-term', notes: '' },
  { symbol: 'GOOG', stance: 'Long-term', notes: '' },
  { symbol: 'NVDA', stance: 'Active', notes: '' },
  { symbol: 'MSFT', stance: 'Long-term', notes: '' },
  { symbol: 'TSLA', stance: 'Active', notes: '' },
  { symbol: 'AMZN', stance: 'Long-term', notes: '' },
  { symbol: 'CSIQ', stance: 'Active', notes: '' },
  { symbol: 'CVS', stance: 'Long-term', notes: '' },
  { symbol: 'ALLY', stance: 'Active', notes: '' },
  { symbol: 'DFS', stance: 'Long-term', notes: '' },
  { symbol: 'BABA', stance: 'Active', notes: '' },
  { symbol: 'SOFI', stance: 'Active', notes: '' },
];

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((item) => ({
      notes: '',
      ...item,
    }));
  } catch {
    return null;
  }
}

function write(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function loadWatchlist() {
  return read() ?? DEFAULT_SYMBOLS.map((s) => ({ ...s }));
}

export function saveWatchlist(items) {
  write(items);
}

export function addToWatchlist(symbol, stance = 'Active', notes = '') {
  const items = loadWatchlist();
  if (items.some((i) => i.symbol === symbol)) return items;
  const updated = [...items, { symbol: symbol.toUpperCase(), stance, notes }];
  write(updated);
  return updated;
}

export function removeFromWatchlist(symbol) {
  const items = loadWatchlist();
  const updated = items.filter((i) => i.symbol !== symbol);
  write(updated);
  return updated;
}

export function updateStance(symbol, stance) {
  const items = loadWatchlist();
  const updated = items.map((i) =>
    i.symbol === symbol ? { ...i, stance } : i
  );
  write(updated);
  return updated;
}

export function updateNotes(symbol, notes) {
  const items = loadWatchlist();
  const updated = items.map((i) =>
    i.symbol === symbol ? { ...i, notes } : i
  );
  write(updated);
  return updated;
}

export function moveItem(fromIndex, toIndex) {
  const items = loadWatchlist();
  if (fromIndex < 0 || fromIndex >= items.length) return items;
  if (toIndex < 0 || toIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  write(next);
  return next;
}

export function isInWatchlist(symbol) {
  const items = loadWatchlist();
  return items.some((i) => i.symbol === symbol);
}

export function resetWatchlist() {
  const fresh = DEFAULT_SYMBOLS.map((s) => ({ ...s }));
  write(fresh);
  return fresh;
}
