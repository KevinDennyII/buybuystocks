import { useState } from 'react';
import { useWatchlist } from '../hooks/useStockData.js';
import { API_STATUS } from '../services/stockApi.js';
import { StockTable } from '../components/dashboard/StockTable.jsx';
import { StockChart } from '../components/dashboard/StockChart.jsx';
import { QuotePanel } from '../components/dashboard/QuotePanel.jsx';
import { NewsPanel } from '../components/dashboard/NewsPanel.jsx';
import { CorporateActions } from '../components/dashboard/CorporateActions.jsx';
import { SymbolSearch } from '../components/dashboard/SymbolSearch.jsx';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const {
    stocks,
    loading,
    addSymbol,
    removeSymbol,
    changeStance,
    reset,
    isWatching,
    count,
  } = useWatchlist();
  const [selected, setSelected] = useState('AAPL');

  function handleAdd(symbol) {
    addSymbol(symbol);
    setSelected(symbol);
  }

  function handleRemove(symbol) {
    removeSymbol(symbol);
    if (selected === symbol && stocks.length > 1) {
      const remaining = stocks.filter((s) => s.symbol !== symbol);
      setSelected(remaining[0]?.symbol ?? '');
    }
  }

  return (
    <section className={`content-width ${styles.page}`}>
      <h1 className={styles.pageTitle}>
        <span className="text-gradient">Trading Desk</span>
      </h1>
      <p className={styles.pageSubtitle}>
        Your watchlist, charts, and market intel — all in one place.
      </p>

      <div className={styles.dataSource}>
        <span className={`${styles.sourceDot} ${API_STATUS.isLive ? styles.sourceDotLive : ''}`} />
        {API_STATUS.isLive
          ? `Live Data: ${API_STATUS.provider}`
          : 'Mock Data — Add API keys in .env for live quotes'}
      </div>

      <div className={styles.grid}>
        <div className={styles.watchlistCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>
                Watchlist
                <span className={styles.countBadge}>{count}</span>
              </span>
              <button className={styles.resetBtn} onClick={reset} title="Reset to defaults">
                Reset
              </button>
            </div>
            <SymbolSearch
              onSelect={setSelected}
              onAdd={handleAdd}
              isWatching={isWatching}
            />
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Loading...
              </div>
            ) : (
              <StockTable
                stocks={stocks}
                selectedSymbol={selected}
                onSelect={setSelected}
                onRemove={handleRemove}
                onChangeStance={changeStance}
              />
            )}
          </div>
        </div>

        <div className={styles.chartCol}>
          <div className={styles.card}>
            <StockChart symbol={selected} />
          </div>
        </div>

        <div className={styles.quoteCol}>
          <div className={styles.card}>
            <QuotePanel symbol={selected} />
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.card}>
          <CorporateActions />
        </div>
        <div className={styles.card}>
          <NewsPanel />
        </div>
      </div>
    </section>
  );
}
