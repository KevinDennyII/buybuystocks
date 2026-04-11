import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useStockData.js';
import { WATCHLIST_STOCKS, PENNY_STOCKS } from '../data/mockStockData.js';
import styles from './WatchlistPage.module.css';

const ALL_KNOWN = [...WATCHLIST_STOCKS, ...PENNY_STOCKS];
const STANCES = ['Long-term', 'Active', 'Penny / Speculative'];

function findKnown(symbol) {
  return ALL_KNOWN.find((s) => s.symbol === symbol);
}

function stanceClass(stance) {
  if (!stance) return styles.stanceActive;
  const l = stance.toLowerCase();
  if (l.includes('long')) return styles.stanceLong;
  if (l.includes('penny') || l.includes('speculative')) return styles.stancePenny;
  return styles.stanceActive;
}

export function WatchlistPage() {
  const {
    stocks,
    symbolList,
    loading,
    addSymbol,
    removeSymbol,
    changeStance,
    changeNotes,
    moveUp,
    moveDown,
    reset,
    isWatching,
    count,
  } = useWatchlist();

  const [query, setQuery] = useState('');
  const [addStance, setAddStance] = useState('Active');
  const [dropOpen, setDropOpen] = useState(false);
  const wrapRef = useRef(null);

  const filtered = query.length > 0
    ? ALL_KNOWN.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function handleAdd(symbol) {
    addSymbol(symbol, addStance);
    setQuery('');
    setDropOpen(false);
  }

  function handleAddFromInput() {
    const sym = query.trim().toUpperCase();
    if (!sym) return;
    handleAdd(sym);
  }

  return (
    <section className={`content-width ${styles.page}`}>
      <div className={styles.titleRow}>
        <h1 className={styles.pageTitle}>
          <span className="text-gradient">Watchlist</span>
        </h1>
        <div className={styles.actions}>
          <Link to="/dashboard" className={styles.ghostBtn}>
            Open Dashboard
          </Link>
          <button className={styles.ghostBtn} onClick={reset}>
            Reset to Defaults
          </button>
        </div>
      </div>
      <p className={styles.subtitle}>
        Add symbols, write your investment thesis, and organize your watch targets.
        Changes are saved automatically.
      </p>

      {/* ── Add symbol ── */}
      <div className={styles.addSection} ref={wrapRef}>
        <div className={styles.addRow}>
          <div className={styles.addInputWrap}>
            <span className={styles.searchIcon}>&#128269;</span>
            <input
              className={styles.addInput}
              type="text"
              placeholder="Search by ticker or company name..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setDropOpen(true); }}
              onFocus={() => query && setDropOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddFromInput();
              }}
            />
            {dropOpen && filtered.length > 0 && (
              <div className={styles.dropdown}>
                {filtered.map((s) => {
                  const watched = isWatching(s.symbol);
                  return (
                    <div
                      key={s.symbol}
                      className={styles.dropdownItem}
                      onClick={() => !watched && handleAdd(s.symbol)}
                    >
                      <span className={styles.dropSym}>{s.symbol}</span>
                      <span className={styles.dropName}>{s.name}</span>
                      {watched && <span className={styles.dropWatched}>Watching</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <select
            className={styles.stanceSelect}
            value={addStance}
            onChange={(e) => setAddStance(e.target.value)}
          >
            {STANCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            className={styles.addBtn}
            onClick={handleAddFromInput}
            disabled={!query.trim()}
          >
            + Add
          </button>
        </div>
      </div>

      <p className={styles.countInfo}>
        <span className={styles.countNum}>{count}</span> symbol{count !== 1 ? 's' : ''} on your watchlist
      </p>

      {/* ── Card grid ── */}
      {loading && !stocks.length ? (
        <div className={styles.emptyState}>Loading watchlist...</div>
      ) : (
        <div className={styles.grid}>
          {count === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Your watchlist is empty</p>
              <p className={styles.emptyHint}>Search for a ticker above to add your first stock.</p>
            </div>
          )}
          {symbolList.map((item, index) => {
            const enriched = stocks.find((s) => s.symbol === item.symbol);
            const known = findKnown(item.symbol);
            const name = enriched?.name ?? known?.name ?? item.symbol;
            const price = enriched?.lastPrice;
            const change = enriched?.change;
            const changePct = enriched?.changePercent;

            return (
              <div key={item.symbol} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.cardSymbol}>{item.symbol}</div>
                    <div className={styles.cardName}>{name}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      title="Move up"
                      aria-label="Move up"
                    >
                      ▲
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={() => moveDown(index)}
                      disabled={index === symbolList.length - 1}
                      title="Move down"
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => removeSymbol(item.symbol)}
                      title={`Remove ${item.symbol}`}
                      aria-label={`Remove ${item.symbol}`}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className={styles.cardMiddle}>
                  {STANCES.map((s) => (
                    <button
                      key={s}
                      className={`${styles.stanceTag} ${stanceClass(s)} ${item.stance === s ? styles.stanceTagSelected : ''}`}
                      onClick={() => changeStance(item.symbol, s)}
                    >
                      {s === 'Penny / Speculative' ? 'Penny' : s}
                    </button>
                  ))}
                  {price != null && (
                    <div className={styles.priceInfo}>
                      <div className={styles.price}>${price.toFixed(2)}</div>
                      {change != null && (
                        <div className={`${styles.priceChange} ${change >= 0 ? styles.positive : styles.negative}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePct >= 0 ? '+' : ''}{changePct?.toFixed(2)}%)
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <textarea
                  className={styles.notesArea}
                  placeholder="Write your thesis — why you're watching this, what would change your mind..."
                  value={item.notes ?? ''}
                  onChange={(e) => changeNotes(item.symbol, e.target.value)}
                  rows={2}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
