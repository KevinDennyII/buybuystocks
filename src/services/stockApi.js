/**
 * Stock API service — cascading live providers with mock fallback.
 *
 * Provider roles:
 *  - Finnhub:       real-time quotes, company news, company profile
 *  - Alpha Vantage: daily/weekly historical OHLC (25 req/day free)
 *  - Twelve Data:   intraday time-series, technicals (800 req/day free)
 *  - Polygon.io:    market news, previous-day bars, ticker details (5 req/min free)
 */

import {
  WATCHLIST_STOCKS,
  PENNY_STOCKS,
  getChartData,
  PORTFOLIO,
  POSITIONS,
  ACCOUNT_VALUE_HISTORY,
  CUMULATIVE_PNL,
  STOCK_PNL,
  NEWS_ITEMS,
  CORPORATE_ACTIONS,
  ALERTS,
} from '../data/mockStockData.js';

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || '';
const ALPHAVANTAGE_KEY = import.meta.env.VITE_ALPHAVANTAGE_KEY || '';
const TWELVEDATA_KEY = import.meta.env.VITE_TWELVEDATA_KEY || '';
const POLYGON_KEY = import.meta.env.VITE_POLYGON_KEY || '';
const FMP_KEY = import.meta.env.VITE_FMP_KEY || '';

const ALL_MOCK = [...WATCHLIST_STOCKS, ...PENNY_STOCKS];
const OTC_DISCOVERY_FALLBACK = [
  { symbol: 'HCMC', name: 'Healthier Choices Management Corp' },
  { symbol: 'AITX', name: 'Artificial Intelligence Technology Solutions' },
  { symbol: 'ILUS', name: 'ILUS International Inc' },
  { symbol: 'OZSC', name: 'Ozop Energy Solutions Inc' },
  { symbol: 'TLSS', name: 'Transportation and Logistics Systems Inc' },
  { symbol: 'BIEL', name: 'BioElectronics Corp' },
  { symbol: 'CBDL', name: 'CBD Life Sciences Inc' },
  { symbol: 'MCOA', name: 'Marijuana Company of America Inc' },
  { symbol: 'SIRC', name: 'Solar Integrated Roofing Corp' },
  { symbol: 'ENZC', name: 'Enzolytics Inc' },
];

function findMock(symbol) {
  return ALL_MOCK.find((s) => s.symbol === symbol);
}

function mapAssetType(type, exchange = '') {
  const t = (type || '').toString().toLowerCase();
  const ex = (exchange || '').toString().toLowerCase();
  if (t.includes('etf')) return 'etf';
  if (t.includes('mutual') || t.includes('fund')) return 'mutual_fund';
  if (t.includes('otc') || ex.includes('otc') || ex.includes('pink') || ex.includes('otcm')) return 'otc';
  if (t.includes('stock') || t.includes('equity') || t.includes('common')) return 'stock';
  return 'unknown';
}

function dedupeSymbols(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.symbol) return false;
    const key = item.symbol.toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function finnhubSearch(query) {
  if (!FINNHUB_KEY) return null;
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.result)) return null;
    return data.result.map((item) => ({
      symbol: (item.symbol || item.displaySymbol || '').toUpperCase(),
      name: item.description || item.symbol || '',
      exchange: item.mic || '',
      assetType: mapAssetType(item.type, item.mic),
      _source: 'finnhub',
    }));
  } catch {
    return null;
  }
}

async function twelveDataSearch(query) {
  try {
    const queryParams = new URLSearchParams({ symbol: query });
    if (TWELVEDATA_KEY) queryParams.set('apikey', TWELVEDATA_KEY);
    const res = await fetch(
      `https://api.twelvedata.com/symbol_search?${queryParams.toString()}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.data)) return null;
    return data.data.map((item) => ({
      symbol: (item.symbol || '').toUpperCase(),
      name: item.instrument_name || item.symbol || '',
      exchange: item.exchange || item.mic_code || '',
      assetType: mapAssetType(item.instrument_type || item.type, item.exchange || item.mic_code),
      _source: 'twelvedata',
    }));
  } catch {
    return null;
  }
}

async function fmpOtcSearch(query, limit = 25) {
  if (!FMP_KEY) return null;
  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=${limit}&exchange=OTC&apikey=${FMP_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.map((item) => ({
      symbol: (item.symbol || '').toUpperCase(),
      name: item.name || item.symbol || '',
      exchange: item.exchangeShortName || item.exchange || 'OTC',
      assetType: 'otc',
      _source: 'fmp',
    }));
  } catch {
    return null;
  }
}

function mockSearch(query) {
  const lower = query.toLowerCase();
  const results = ALL_MOCK.filter(
    (s) =>
      s.symbol.toLowerCase().includes(lower) ||
      s.name.toLowerCase().includes(lower)
  ).map((s) => ({
    symbol: s.symbol,
    name: s.name,
    exchange: '',
    assetType: s.stance?.toLowerCase().includes('penny') ? 'otc' : 'stock',
    _source: 'mock',
  }));
  return dedupeSymbols(results);
}

function otcFallbackSearch(query) {
  const lower = query.toLowerCase();
  return OTC_DISCOVERY_FALLBACK
    .filter((s) => s.symbol.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower))
    .map((s) => ({
      symbol: s.symbol,
      name: s.name,
      exchange: 'OTC',
      assetType: 'otc',
      _source: 'fallback',
    }));
}

function normalizeSymbolSearchResults(items = [], limit = 8) {
  return dedupeSymbols(items)
    .filter((item) => item.symbol && item.name)
    .slice(0, limit);
}

// ─── Finnhub: real-time quote ───────────────────────────────────────────────

async function finnhubQuote(symbol) {
  if (!FINNHUB_KEY) return null;
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`
    );
    if (!res.ok) return null;
    const d = await res.json();
    if (!d.c) return null;
    return {
      lastPrice: d.c,
      change: d.d,
      changePercent: d.dp,
      open: d.o,
      high: d.h,
      low: d.l,
      prevClose: d.pc,
    };
  } catch {
    return null;
  }
}

async function finnhubNews(category = 'general') {
  if (!FINNHUB_KEY) return null;
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.slice(0, 15).map((item, i) => ({
      id: item.id || i,
      headline: item.headline,
      time: new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: item.source,
      symbol: item.related || null,
      url: item.url,
      _source: 'finnhub',
    }));
  } catch {
    return null;
  }
}

async function finnhubCompanyNews(symbol) {
  if (!FINNHUB_KEY) return null;
  try {
    const to = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const res = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.slice(0, 10).map((item, i) => ({
      id: item.id || i,
      headline: item.headline,
      time: new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: item.source,
      symbol,
      url: item.url,
      _source: 'finnhub',
    }));
  } catch {
    return null;
  }
}

// ─── Twelve Data: intraday & daily time-series ──────────────────────────────

async function twelveDataTimeSeries(symbol, interval = '1day', outputsize = 180) {
  if (!TWELVEDATA_KEY) return null;
  try {
    const res = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVEDATA_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'error' || !data.values) return null;
    return data.values
      .map((v) => ({
        time: v.datetime.slice(0, 10),
        open: +parseFloat(v.open).toFixed(2),
        high: +parseFloat(v.high).toFixed(2),
        low: +parseFloat(v.low).toFixed(2),
        close: +parseFloat(v.close).toFixed(2),
        volume: parseInt(v.volume, 10) || 0,
      }))
      .reverse();
  } catch {
    return null;
  }
}

async function twelveDataQuote(symbol) {
  if (!TWELVEDATA_KEY) return null;
  try {
    const res = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVEDATA_KEY}`
    );
    if (!res.ok) return null;
    const d = await res.json();
    if (!d.close) return null;
    return {
      lastPrice: +parseFloat(d.close).toFixed(2),
      change: +parseFloat(d.change).toFixed(2),
      changePercent: +parseFloat(d.percent_change).toFixed(2),
      open: +parseFloat(d.open).toFixed(2),
      high: +parseFloat(d.high).toFixed(2),
      low: +parseFloat(d.low).toFixed(2),
      prevClose: +parseFloat(d.previous_close).toFixed(2),
      volume: parseInt(d.volume, 10) || 0,
      avgVolume3M: parseInt(d.average_volume, 10) || null,
      weekHigh52: d.fifty_two_week?.high ? +parseFloat(d.fifty_two_week.high).toFixed(2) : null,
      weekLow52: d.fifty_two_week?.low ? +parseFloat(d.fifty_two_week.low).toFixed(2) : null,
    };
  } catch {
    return null;
  }
}

// ─── Alpha Vantage: daily historical OHLC ───────────────────────────────────

async function alphaVantageDaily(symbol) {
  if (!ALPHAVANTAGE_KEY) return null;
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${ALPHAVANTAGE_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const series = data['Time Series (Daily)'];
    if (!series) return null;
    return Object.entries(series)
      .map(([date, v]) => ({
        time: date,
        open: +parseFloat(v['1. open']).toFixed(2),
        high: +parseFloat(v['2. high']).toFixed(2),
        low: +parseFloat(v['3. low']).toFixed(2),
        close: +parseFloat(v['4. close']).toFixed(2),
        volume: parseInt(v['5. volume'], 10) || 0,
      }))
      .reverse();
  } catch {
    return null;
  }
}

// ─── Polygon.io: market news, previous close ────────────────────────────────

async function polygonNews(limit = 15) {
  if (!POLYGON_KEY) return null;
  try {
    const res = await fetch(
      `https://api.polygon.io/v2/reference/news?limit=${limit}&apiKey=${POLYGON_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results) return null;
    return data.results.map((item, i) => ({
      id: item.id || i,
      headline: item.title,
      time: new Date(item.published_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: item.publisher?.name || 'Polygon',
      symbol: item.tickers?.[0] || null,
      url: item.article_url,
      _source: 'polygon',
    }));
  } catch {
    return null;
  }
}

async function polygonPrevClose(symbol) {
  if (!POLYGON_KEY) return null;
  try {
    const res = await fetch(
      `https://api.polygon.io/v2/aggs/prev/${symbol}?adjusted=true&apiKey=${POLYGON_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const bar = data.results?.[0];
    if (!bar) return null;
    return {
      lastPrice: bar.c,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      prevClose: bar.c,
      volume: bar.v,
      change: +(bar.c - bar.o).toFixed(2),
      changePercent: +(((bar.c - bar.o) / bar.o) * 100).toFixed(2),
    };
  } catch {
    return null;
  }
}

// ─── Public API: symbol search ──────────────────────────────────────────────

export async function fetchSymbolSearch(query, limit = 8, options = {}) {
  const typeFilter = options.assetType || null;
  const q = (query || '').trim();
  if (!q) return [];
  const mock = mockSearch(q);
  const otcFallback = otcFallbackSearch(q);

  if (typeFilter === 'otc') {
    const fmp = await fmpOtcSearch(q, Math.max(limit * 3, 20));
    if (fmp && fmp.length > 0) return normalizeSymbolSearchResults([...fmp, ...otcFallback, ...mock], limit);

    const fh = await finnhubSearch(q);
    if (fh && fh.length > 0) {
      const otcOnly = fh.filter((item) => item.assetType === 'otc');
      return normalizeSymbolSearchResults([...otcOnly, ...otcFallback, ...mock], limit);
    }

    const td = await twelveDataSearch(q);
    if (td && td.length > 0) {
      const otcOnly = td.filter((item) => item.assetType === 'otc');
      return normalizeSymbolSearchResults([...otcOnly, ...otcFallback, ...mock], limit);
    }

    return normalizeSymbolSearchResults([...otcFallback, ...mock], limit);
  }

  // Prefer provider-backed search, but always merge known local matches so
  // OTC/penny suggestions remain visible even when provider metadata is sparse.
  const fh = await finnhubSearch(q);
  if (fh && fh.length > 0) return normalizeSymbolSearchResults([...fh, ...mock], limit);

  const td = await twelveDataSearch(q);
  if (td && td.length > 0) return normalizeSymbolSearchResults([...td, ...mock], limit);

  return normalizeSymbolSearchResults(mock, limit);
}

export async function resolveSymbol(query, options = {}) {
  const symbol = (query || '').trim().toUpperCase();
  if (!symbol) return null;
  const results = await fetchSymbolSearch(symbol, 20, options);
  return results.find((item) => item.symbol === symbol) ?? null;
}

// ─── Public API: quotes ─────────────────────────────────────────────────────

export async function fetchQuote(symbol) {
  const mock = findMock(symbol);

  // Try Finnhub first (real-time)
  const fh = await finnhubQuote(symbol);
  if (fh) {
    // Enrich with Twelve Data for 52-week, avg volume if available
    const td = await twelveDataQuote(symbol).catch(() => null);
    return {
      ...mock,
      ...fh,
      ...(td?.weekHigh52 != null && { weekHigh52: td.weekHigh52 }),
      ...(td?.weekLow52 != null && { weekLow52: td.weekLow52 }),
      ...(td?.avgVolume3M != null && { avgVolume3M: td.avgVolume3M }),
      _source: 'finnhub',
    };
  }

  // Fallback: Twelve Data quote
  const td = await twelveDataQuote(symbol);
  if (td) return { ...mock, ...td, _source: 'twelvedata' };

  // Fallback: Polygon previous close
  const pg = await polygonPrevClose(symbol);
  if (pg) return { ...mock, ...pg, _source: 'polygon' };

  return mock ? { ...mock, _source: 'mock' } : null;
}

export async function fetchWatchlist(symbolList) {
  const symbols = symbolList ?? WATCHLIST_STOCKS.map((s) => ({ symbol: s.symbol, stance: s.stance }));

  const enriched = await Promise.all(
    symbols.map(async ({ symbol, stance, name, exchange, assetType }) => {
      const mock = findMock(symbol);
      const base = {
        ...(mock ?? {}),
        symbol,
        name: name || mock?.name || symbol,
        exchange: exchange || '',
        assetType: assetType || (mock?.stance?.toLowerCase().includes('penny') ? 'otc' : 'stock'),
        stance,
      };

      const live = await finnhubQuote(symbol).catch(() => null);
      if (live) return { ...base, ...live, stance, _source: 'finnhub' };
      return { ...base, stance, _source: 'mock' };
    })
  );
  return enriched;
}

// ─── Public API: chart data ─────────────────────────────────────────────────

const chartCache = new Map();

export async function fetchChartData(symbol) {
  if (chartCache.has(symbol)) return chartCache.get(symbol);

  // Try Twelve Data first (800 req/day — most generous for time-series)
  const td = await twelveDataTimeSeries(symbol, '1day', 180);
  if (td && td.length > 10) {
    chartCache.set(symbol, td);
    return td;
  }

  // Fallback: Alpha Vantage daily (25 req/day — use sparingly)
  const av = await alphaVantageDaily(symbol);
  if (av && av.length > 10) {
    chartCache.set(symbol, av);
    return av;
  }

  // Final fallback: generated mock
  const mock = getChartData(symbol);
  chartCache.set(symbol, mock);
  return mock;
}

// ─── Public API: news ───────────────────────────────────────────────────────

export async function fetchNews() {
  // Try Polygon news first (richest free news endpoint)
  const pg = await polygonNews(15);
  if (pg && pg.length > 0) return pg;

  // Fallback: Finnhub general news
  const fh = await finnhubNews('general');
  if (fh && fh.length > 0) return fh;

  return NEWS_ITEMS;
}

export async function fetchCompanyNews(symbol) {
  const fh = await finnhubCompanyNews(symbol);
  if (fh && fh.length > 0) return fh;
  return NEWS_ITEMS.filter((n) => n.symbol === symbol);
}

// ─── Public API: portfolio (still local/mock until brokerage API) ───────────

export function fetchPortfolio() {
  return PORTFOLIO;
}

export function fetchPositions() {
  return POSITIONS;
}

export function fetchAccountHistory() {
  return ACCOUNT_VALUE_HISTORY;
}

export function fetchCumulativePnL() {
  return CUMULATIVE_PNL;
}

export function fetchStockPnL() {
  return STOCK_PNL;
}

export function fetchCorporateActions() {
  return CORPORATE_ACTIONS;
}

export function fetchAlerts() {
  return [...ALERTS];
}

export function fetchPennyStocks() {
  return PENNY_STOCKS.map((s) => ({ ...s, _source: 'mock' }));
}

// ─── Status ─────────────────────────────────────────────────────────────────

function getActiveProviders() {
  const active = [];
  if (FINNHUB_KEY) active.push('Finnhub');
  if (TWELVEDATA_KEY) active.push('Twelve Data');
  if (ALPHAVANTAGE_KEY) active.push('Alpha Vantage');
  if (POLYGON_KEY) active.push('Polygon');
  return active;
}

export const API_STATUS = {
  get providers() { return getActiveProviders(); },
  get isLive() { return getActiveProviders().length > 0; },
  get provider() {
    const p = getActiveProviders();
    return p.length > 0 ? p.join(' + ') : 'Mock Data';
  },
};
