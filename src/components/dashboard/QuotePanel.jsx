import { useQuote } from '../../hooks/useStockData.js';
import styles from './QuotePanel.module.css';

function priceColor(val) {
  if (val > 0) return styles.positive;
  if (val < 0) return styles.negative;
  return styles.neutral;
}

export function QuotePanel({ symbol }) {
  const { quote, loading } = useQuote(symbol);

  if (!symbol) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>Select a stock to view quote details</div>
      </div>
    );
  }

  if (loading || !quote) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>Loading {symbol}...</div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.symbolRow}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{quote.symbol}</h2>
          <span className={styles.symbolName}>{quote.name}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={`${styles.price} ${priceColor(quote.change)}`}>
            {quote.lastPrice?.toFixed(2)}
          </span>
          <span className={`${styles.changeInfo} ${priceColor(quote.change)}`}>
            {quote.change > 0 ? '+' : ''}{quote.change?.toFixed(2)}
            {' '}({quote.changePercent > 0 ? '+' : ''}{quote.changePercent?.toFixed(2)}%)
          </span>
        </div>
        <div className={styles.timestamp}>
          Open {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EDT
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Key Statistics</div>
        <div className={styles.statsGrid}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Open</span>
            <span className={styles.statValue}>{quote.open?.toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Prev Close</span>
            <span className={styles.statValue}>{quote.prevClose?.toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>High</span>
            <span className={styles.statValue}>{quote.high?.toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Low</span>
            <span className={styles.statValue}>{quote.low?.toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Volume</span>
            <span className={styles.statValue}>{quote.volume?.toLocaleString()}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Avg Vol (3M)</span>
            <span className={styles.statValue}>{quote.avgVolume3M?.toLocaleString()}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>52 Wk High</span>
            <span className={styles.statValue}>{quote.weekHigh52?.toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>52 Wk Low</span>
            <span className={styles.statValue}>{quote.weekLow52?.toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Market Cap</span>
            <span className={styles.statValue}>{quote.marketCap ?? '—'}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>P/E</span>
            <span className={styles.statValue}>{quote.pe?.toFixed(1) ?? '—'}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>EPS</span>
            <span className={styles.statValue}>{quote.eps?.toFixed(2) ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className={styles.sourceTag}>
        <span className={`${styles.dot} ${quote._source === 'finnhub' ? styles.dotLive : styles.dotMock}`} />
        {quote._source === 'finnhub' ? 'Live — Finnhub' : 'Mock Data'}
      </div>
    </div>
  );
}
