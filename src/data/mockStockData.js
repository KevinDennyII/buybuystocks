import { subDays, format } from 'date-fns';

const now = new Date();

function generateOHLC(basePrice, days, volatility = 0.02) {
  const data = [];
  let price = basePrice * (1 - volatility * days * 0.3);
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    const open = price;
    const high = open * (1 + Math.random() * volatility * 2);
    const low = open * (1 - Math.random() * volatility * 1.5);
    const close = low + Math.random() * (high - low);
    price = close;
    data.push({
      time: format(date, 'yyyy-MM-dd'),
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.floor(Math.random() * 50_000_000 + 5_000_000),
    });
  }
  return data;
}

function generateLineData(startValue, days, volatility = 0.01) {
  const data = [];
  let value = startValue;
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    value += value * (Math.random() - 0.47) * volatility * 2;
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: +value.toFixed(2),
    });
  }
  return data;
}

export const WATCHLIST_STOCKS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    lastPrice: 261.60,
    change: 1.11,
    changePercent: 0.43,
    volume: 54_320_000,
    avgVolume3M: 62_100_000,
    open: 260.15,
    high: 262.80,
    low: 259.90,
    prevClose: 260.49,
    weekHigh52: 285.40,
    weekLow52: 164.08,
    marketCap: '3.94T',
    pe: 33.2,
    eps: 7.88,
    stance: 'Long-term',
  },
  {
    symbol: 'GOOG',
    name: 'Alphabet Inc',
    lastPrice: 316.38,
    change: 0.01,
    changePercent: 0.00,
    volume: 24_019_000,
    avgVolume3M: 28_500_000,
    open: 315.50,
    high: 317.90,
    low: 314.20,
    prevClose: 316.37,
    weekHigh52: 342.10,
    weekLow52: 150.22,
    marketCap: '1.93T',
    pe: 22.8,
    eps: 13.88,
    stance: 'Long-term',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    lastPrice: 894.52,
    change: 12.34,
    changePercent: 1.40,
    volume: 42_310_000,
    avgVolume3M: 55_000_000,
    open: 880.00,
    high: 898.30,
    low: 878.45,
    prevClose: 882.18,
    weekHigh52: 974.00,
    weekLow52: 393.05,
    marketCap: '2.21T',
    pe: 67.5,
    eps: 13.25,
    stance: 'Active',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    lastPrice: 417.88,
    change: -2.12,
    changePercent: -0.50,
    volume: 19_800_000,
    avgVolume3M: 22_300_000,
    open: 420.00,
    high: 421.50,
    low: 416.30,
    prevClose: 420.00,
    weekHigh52: 468.35,
    weekLow52: 309.45,
    marketCap: '3.10T',
    pe: 36.1,
    eps: 11.58,
    stance: 'Long-term',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    lastPrice: 172.45,
    change: 4.28,
    changePercent: 2.55,
    volume: 98_500_000,
    avgVolume3M: 112_000_000,
    open: 168.00,
    high: 174.90,
    low: 167.20,
    prevClose: 168.17,
    weekHigh52: 299.29,
    weekLow52: 138.80,
    marketCap: '549B',
    pe: 56.8,
    eps: 3.04,
    stance: 'Active',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    lastPrice: 186.22,
    change: 0.85,
    changePercent: 0.46,
    volume: 37_200_000,
    avgVolume3M: 45_000_000,
    open: 185.10,
    high: 187.50,
    low: 184.80,
    prevClose: 185.37,
    weekHigh52: 201.20,
    weekLow52: 118.35,
    marketCap: '1.92T',
    pe: 42.3,
    eps: 4.40,
    stance: 'Long-term',
  },
  {
    symbol: 'CSIQ',
    name: 'Canadian Solar',
    lastPrice: 18.45,
    change: 0.72,
    changePercent: 4.06,
    volume: 2_340_000,
    avgVolume3M: 3_100_000,
    open: 17.80,
    high: 18.60,
    low: 17.65,
    prevClose: 17.73,
    weekHigh52: 32.50,
    weekLow52: 11.44,
    marketCap: '1.21B',
    pe: 8.2,
    eps: 2.25,
    stance: 'Active',
  },
  {
    symbol: 'CVS',
    name: 'CVS Health',
    lastPrice: 78.93,
    change: -0.34,
    changePercent: -0.43,
    volume: 8_900_000,
    avgVolume3M: 10_200_000,
    open: 79.20,
    high: 79.80,
    low: 78.50,
    prevClose: 79.27,
    weekHigh52: 91.30,
    weekLow52: 52.77,
    marketCap: '99.4B',
    pe: 12.4,
    eps: 6.37,
    stance: 'Long-term',
  },
  {
    symbol: 'ALLY',
    name: 'Ally Financial',
    lastPrice: 36.80,
    change: 0.45,
    changePercent: 1.24,
    volume: 4_200_000,
    avgVolume3M: 5_800_000,
    open: 36.30,
    high: 37.10,
    low: 36.10,
    prevClose: 36.35,
    weekHigh52: 44.10,
    weekLow52: 26.15,
    marketCap: '11.3B',
    pe: 9.8,
    eps: 3.76,
    stance: 'Active',
  },
  {
    symbol: 'DFS',
    name: 'Discover Financial',
    lastPrice: 142.50,
    change: 1.88,
    changePercent: 1.34,
    volume: 2_100_000,
    avgVolume3M: 2_800_000,
    open: 140.80,
    high: 143.20,
    low: 140.30,
    prevClose: 140.62,
    weekHigh52: 165.00,
    weekLow52: 95.75,
    marketCap: '35.8B',
    pe: 10.5,
    eps: 13.57,
    stance: 'Long-term',
  },
  {
    symbol: 'BABA',
    name: 'Alibaba Group',
    lastPrice: 82.15,
    change: -1.20,
    changePercent: -1.44,
    volume: 14_500_000,
    avgVolume3M: 18_000_000,
    open: 83.40,
    high: 83.90,
    low: 81.50,
    prevClose: 83.35,
    weekHigh52: 117.82,
    weekLow52: 66.63,
    marketCap: '199B',
    pe: 10.1,
    eps: 8.13,
    stance: 'Active',
  },
  {
    symbol: 'SOFI',
    name: 'SoFi Technologies',
    lastPrice: 9.42,
    change: 0.18,
    changePercent: 1.95,
    volume: 32_000_000,
    avgVolume3M: 38_000_000,
    open: 9.20,
    high: 9.55,
    low: 9.15,
    prevClose: 9.24,
    weekHigh52: 12.65,
    weekLow52: 6.01,
    marketCap: '9.8B',
    pe: null,
    eps: -0.04,
    stance: 'Active',
  },
];

export const PENNY_STOCKS = [
  {
    symbol: 'SNDL',
    name: 'SNDL Inc',
    lastPrice: 1.82,
    change: 0.09,
    changePercent: 5.20,
    volume: 18_400_000,
    stance: 'Penny / Speculative',
  },
  {
    symbol: 'TELL',
    name: 'Tellurian Inc',
    lastPrice: 0.78,
    change: -0.03,
    changePercent: -3.70,
    volume: 12_000_000,
    stance: 'Penny / Speculative',
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    lastPrice: 24.30,
    change: 0.65,
    changePercent: 2.75,
    volume: 44_000_000,
    stance: 'Active',
  },
];

const chartCache = {};
export function getChartData(symbol) {
  if (!chartCache[symbol]) {
    const stock = [...WATCHLIST_STOCKS, ...PENNY_STOCKS].find(
      (s) => s.symbol === symbol
    );
    const base = stock?.lastPrice ?? 100;
    chartCache[symbol] = generateOHLC(base, 180, 0.018);
  }
  return chartCache[symbol];
}

export const PORTFOLIO = {
  netAccountValue: 42_853.67,
  previousValue: 41_290.40,
  totalReturn: 3_853.67,
  totalReturnPercent: 9.88,
  marketValue: 41_672.45,
  cashBalance: 1_181.22,
  dayTradeBP: 12_500.00,
  overnightBP: 6_250.00,
  maintenanceMargin: 8_340.12,
  initialMargin: 10_425.15,
  riskLevel: 'Safe',
  dayTradesLeft: 3,
};

export const POSITIONS = [
  { symbol: 'AAPL', name: 'Apple Inc', qty: 25, avgCost: 182.40, currentPrice: 261.60, marketValue: 6540.00, totalPnL: 1980.00, totalPnLPercent: 43.42 },
  { symbol: 'NVDA', name: 'NVIDIA Corp', qty: 8, avgCost: 620.50, currentPrice: 894.52, marketValue: 7156.16, totalPnL: 2192.16, totalPnLPercent: 44.16 },
  { symbol: 'MSFT', name: 'Microsoft Corp', qty: 15, avgCost: 365.20, currentPrice: 417.88, marketValue: 6268.20, totalPnL: 790.20, totalPnLPercent: 14.43 },
  { symbol: 'AMZN', name: 'Amazon.com Inc', qty: 30, avgCost: 155.80, currentPrice: 186.22, marketValue: 5586.60, totalPnL: 912.60, totalPnLPercent: 19.53 },
  { symbol: 'CSIQ', name: 'Canadian Solar', qty: 200, avgCost: 14.20, currentPrice: 18.45, marketValue: 3690.00, totalPnL: 850.00, totalPnLPercent: 29.93 },
  { symbol: 'CVS', name: 'CVS Health', qty: 40, avgCost: 62.50, currentPrice: 78.93, marketValue: 3157.20, totalPnL: 657.20, totalPnLPercent: 26.29 },
  { symbol: 'ALLY', name: 'Ally Financial', qty: 80, avgCost: 30.50, currentPrice: 36.80, marketValue: 2944.00, totalPnL: 504.00, totalPnLPercent: 20.66 },
  { symbol: 'SOFI', name: 'SoFi Technologies', qty: 350, avgCost: 7.80, currentPrice: 9.42, marketValue: 3297.00, totalPnL: 567.00, totalPnLPercent: 20.77 },
  { symbol: 'DFS', name: 'Discover Financial', qty: 10, avgCost: 118.30, currentPrice: 142.50, marketValue: 1425.00, totalPnL: 242.00, totalPnLPercent: 20.46 },
  { symbol: 'BABA', name: 'Alibaba Group', qty: 20, avgCost: 74.50, currentPrice: 82.15, marketValue: 1643.00, totalPnL: 153.00, totalPnLPercent: 10.27 },
];

export const ACCOUNT_VALUE_HISTORY = generateLineData(39000, 365, 0.004);
export const CUMULATIVE_PNL = generateLineData(0, 365, 0.15).map((d) => ({
  ...d,
  value: +(d.value + 3000).toFixed(2),
}));

export const STOCK_PNL = POSITIONS.map((p) => ({
  symbol: p.symbol,
  name: p.name,
  pnl: p.totalPnL,
  pnlPercent: p.totalPnLPercent,
})).sort((a, b) => b.pnl - a.pnl);

export const NEWS_ITEMS = [
  { id: 1, headline: 'Apple unveils new AI features at developer conference', time: '10m ago', source: 'Reuters', symbol: 'AAPL' },
  { id: 2, headline: 'S&P 500 holds firm as consumer confidence ticks up', time: '13m ago', source: 'Bloomberg', symbol: null },
  { id: 3, headline: 'NVIDIA data center revenue beats estimates again', time: '22m ago', source: 'CNBC', symbol: 'NVDA' },
  { id: 4, headline: 'Fed minutes suggest patience on rate cuts', time: '35m ago', source: 'WSJ', symbol: null },
  { id: 5, headline: 'Alibaba restructuring moves ahead with IPO plans', time: '42m ago', source: 'FT', symbol: 'BABA' },
  { id: 6, headline: 'SoFi reports record member growth in Q1', time: '55m ago', source: 'MarketWatch', symbol: 'SOFI' },
  { id: 7, headline: 'Tesla FSD recall concerns send shares lower early', time: '1h ago', source: 'Reuters', symbol: 'TSLA' },
  { id: 8, headline: 'Canadian Solar secures 1.2GW supply deal in Europe', time: '1h ago', source: 'PV Magazine', symbol: 'CSIQ' },
  { id: 9, headline: 'Motley Fool: 3 stocks to buy and hold for a decade', time: '2h ago', source: 'Motley Fool', symbol: null },
  { id: 10, headline: 'Discover Financial merger talks heat up again', time: '2h ago', source: 'CNBC', symbol: 'DFS' },
];

export const CORPORATE_ACTIONS = [
  { symbol: 'AAPL', type: 'Dividend', date: '2026-05-15', detail: '$0.25/share quarterly dividend' },
  { symbol: 'MSFT', type: 'Dividend', date: '2026-06-12', detail: '$0.75/share quarterly dividend' },
  { symbol: 'NVDA', type: 'Split', date: '2026-07-01', detail: '10:1 stock split announced' },
  { symbol: 'CSIQ', type: 'Earnings', date: '2026-04-28', detail: 'Q1 2026 earnings report' },
  { symbol: 'CVS', type: 'Earnings', date: '2026-05-01', detail: 'Q1 2026 earnings report' },
];

export const ALERTS = [
  { id: 1, symbol: 'AAPL', type: 'price_above', value: 270.00, active: true, createdAt: '2026-04-01' },
  { id: 2, symbol: 'TSLA', type: 'price_below', value: 160.00, active: true, createdAt: '2026-04-05' },
  { id: 3, symbol: 'NVDA', type: 'price_above', value: 950.00, active: true, createdAt: '2026-04-08' },
  { id: 4, symbol: 'SOFI', type: 'percent_change', value: 5.0, active: false, createdAt: '2026-03-20' },
];
