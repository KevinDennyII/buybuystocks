const STORAGE_KEY = 'bbs_watchlist';

const DEFAULT_SYMBOLS = [
  { symbol: 'AAPL', stance: 'Long-term', notes: '', assetType: 'stock' },
  { symbol: 'GOOG', stance: 'Long-term', notes: '', assetType: 'stock' },
  { symbol: 'NVDA', stance: 'Active', notes: '', assetType: 'stock' },
  { symbol: 'MSFT', stance: 'Long-term', notes: '', assetType: 'stock' },
  { symbol: 'TSLA', stance: 'Active', notes: '', assetType: 'stock' },
  { symbol: 'AMZN', stance: 'Long-term', notes: '', assetType: 'stock' },
  { symbol: 'CSIQ', stance: 'Active', notes: '', assetType: 'stock' },
  { symbol: 'CVS', stance: 'Long-term', notes: '', assetType: 'stock' },
  { symbol: 'ALLY', stance: 'Active', notes: '', assetType: 'stock' },
  { symbol: 'DFS', stance: 'Long-term', notes: '', assetType: 'stock' },
  { symbol: 'BABA', stance: 'Active', notes: '', assetType: 'stock' },
  { symbol: 'SOFI', stance: 'Active', notes: '', assetType: 'stock' },
];

function normalizeAssetType(assetType) {
  if (!assetType) return 'unknown';
  const normalized = assetType.toString().trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (normalized === 'mutualfund' || normalized === 'mutual_fund') return 'mutual_fund';
  if (normalized === 'etf') return 'etf';
  if (normalized === 'stock' || normalized === 'equity') return 'stock';
  if (normalized === 'otc') return 'otc';
  return 'unknown';
}

function isPennyStance(stance) {
  return (stance || '').toLowerCase().includes('penny');
}

function normalizeStanceForAssetType(stance, assetType) {
  const safeStance = stance || 'Active';
  const normalizedType = normalizeAssetType(assetType);
  if (isPennyStance(safeStance) && normalizedType !== 'otc') {
    return 'Active';
  }
  return safeStance;
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((item) => ({
      notes: '',
      name: '',
      exchange: '',
      ...item,
      symbol: (item.symbol || '').toUpperCase(),
      assetType: normalizeAssetType(item.assetType),
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

export function addToWatchlist(symbol, stance = 'Active', notes = '', details = {}) {
  const items = loadWatchlist();
  const normalizedSymbol = symbol.toUpperCase();
  if (items.some((i) => i.symbol === normalizedSymbol)) return items;
  const normalizedAssetType = normalizeAssetType(details.assetType);
  const updated = [...items, {
    symbol: normalizedSymbol,
    stance: normalizeStanceForAssetType(stance, normalizedAssetType),
    notes,
    name: details.name ?? '',
    exchange: details.exchange ?? '',
    assetType: normalizedAssetType,
  }];
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
    i.symbol === symbol
      ? { ...i, stance: normalizeStanceForAssetType(stance, i.assetType) }
      : i
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
