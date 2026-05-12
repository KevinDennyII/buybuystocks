import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useStockData.js';
import { WATCHLIST_STOCKS, PENNY_STOCKS } from '../data/mockStockData.js';
import { fetchSymbolSearch, resolveSymbol } from '../services/stockApi.js';
import styles from './WatchlistPage.module.css';

const ALL_KNOWN = [...WATCHLIST_STOCKS, ...PENNY_STOCKS];
const STANCES = ['Long-term', 'Active', 'Penny / Speculative'];

function findKnown(symbol) {
  return ALL_KNOWN.find((s) => s.symbol === symbol);
}

function inferKnownAssetType(symbol) {
  const known = findKnown(symbol);
  if (!known) return 'unknown';
  return known.stance?.toLowerCase().includes('penny') ? 'otc' : 'stock';
}

function assetTypeLabel(assetType) {
  if (assetType === 'mutual_fund') return 'Mutual Fund';
  if (assetType === 'etf') return 'ETF';
  if (assetType === 'otc') return 'OTC';
  if (assetType === 'stock') return 'Stock';
  return 'Unknown';
}

function stanceClass(stance) {
  if (!stance) return styles.stanceActive;
  const l = stance.toLowerCase();
  if (l.includes('long')) return styles.stanceLong;
  if (l.includes('penny') || l.includes('speculative')) return styles.stancePenny;
  return styles.stanceActive;
}

function allowsPenny(assetType) {
  return assetType === 'otc';
}

function normalizeStanceForAssetType(stance, assetType) {
  if (stance === 'Penny / Speculative' && !allowsPenny(assetType)) return 'Active';
  return stance;
}

function stanceMatchesAssetType(stance, assetType) {
  const type = assetType || 'unknown';
  if (stance === 'Penny / Speculative') return type === 'otc';
  return type === 'stock' || type === 'etf' || type === 'mutual_fund' || type === 'unknown';
}

function selectedTypeHint(stance) {
  if (stance === 'Penny / Speculative') return 'OTC';
  return 'Stock / ETF / Mutual Fund';
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
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const wrapRef = useRef(null);
  const searchSeqRef = useRef(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      setAddError('');
      return;
    }

    const currentSeq = ++searchSeqRef.current;
    setSearching(true);

    const t = setTimeout(async () => {
      const next = await fetchSymbolSearch(
        query,
        8,
        { assetType: addStance === 'Penny / Speculative' ? 'otc' : undefined }
      ).catch(() => []);
      if (searchSeqRef.current === currentSeq) {
        setResults(next.filter((item) => stanceMatchesAssetType(addStance, item.assetType)));
        setSearching(false);
      }
    }, 220);

    return () => clearTimeout(t);
  }, [query, addStance]);

  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function handleAdd(item) {
    const symbol = item?.symbol ?? query.trim().toUpperCase();
    if (!symbol) return;
    setAddError('');
    const resolvedAssetType = item?.assetType ?? inferKnownAssetType(symbol);
    const safeStance = normalizeStanceForAssetType(addStance, resolvedAssetType);
    addSymbol(symbol, safeStance, {
      name: item?.name ?? symbol,
      exchange: item?.exchange ?? '',
      assetType: resolvedAssetType,
    });
    if (safeStance !== addStance) setAddStance(safeStance);
    setQuery('');
    setDropOpen(false);
  }

  async function handleAddFromInput() {
    const symbol = query.trim().toUpperCase();
    if (!symbol) return;
    setAddError('');
    setAdding(true);
    try {
      const exact = results.find((r) => r.symbol === symbol) ?? await resolveSymbol(
        symbol,
        { assetType: addStance === 'Penny / Speculative' ? 'otc' : undefined }
      );
      if (!exact) {
        setAddError('Symbol not found. Select a real ticker from search results.');
        return;
      }
      if (!stanceMatchesAssetType(addStance, exact.assetType)) {
        setAddError(`Selected type filter is ${selectedTypeHint(addStance)}. Choose a matching symbol.`);
        return;
      }
      handleAdd(exact);
    } finally {
      setAdding(false);
    }
  }

  return (
    <section className={`content-width ${styles.page}`}>
      <div className={styles.titleRow}>
        <h1 className={styles.pageTitle}>
          <span className="text-gradient">Watchlist</span>
        </h1>
        <div className={styles.actions}>
          <Link to="/" className={styles.ghostBtn}>
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
              onChange={(e) => { setQuery(e.target.value); setDropOpen(true); setAddError(''); }}
              onFocus={() => query && setDropOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddFromInput();
              }}
            />
            {dropOpen && query.trim() && (
              <div className={styles.dropdown}>
                {searching && (
                  <div className={styles.dropdownInfo}>Searching symbols...</div>
                )}
                {!searching && results.map((s) => {
                  const watched = isWatching(s.symbol);
                  return (
                    <div
                      key={s.symbol}
                      className={styles.dropdownItem}
                      onClick={() => !watched && handleAdd(s)}
                    >
                      <span className={styles.dropSym}>{s.symbol}</span>
                      <span className={styles.dropName}>
                        {s.name}
                        <span className={styles.dropMeta}>
                          {assetTypeLabel(s.assetType)}
                          {s.exchange ? ` - ${s.exchange}` : ''}
                        </span>
                      </span>
                      {watched && <span className={styles.dropWatched}>Watching</span>}
                    </div>
                  );
                })}
                {!searching && results.length === 0 && (
                  <div className={styles.dropdownInfo}>
                    No matching {selectedTypeHint(addStance)} symbols found.
                  </div>
                )}
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
            disabled={!query.trim() || adding}
          >
            {adding ? 'Validating...' : '+ Add'}
          </button>
        </div>
        {addError && <p className={styles.addError}>{addError}</p>}
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
            const assetType = item.assetType || enriched?.assetType || inferKnownAssetType(item.symbol);
            const canUsePenny = allowsPenny(assetType);
            const price = enriched?.lastPrice;
            const change = enriched?.change;
            const changePct = enriched?.changePercent;

            return (
              <div key={item.symbol} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.cardSymbol}>{item.symbol}</div>
                    <div className={styles.cardName}>{name}</div>
                    <div className={styles.assetTypeTag}>{assetTypeLabel(assetType)}</div>
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
                      className={`${styles.stanceTag} ${stanceClass(s)} ${item.stance === s ? styles.stanceTagSelected : ''} ${s === 'Penny / Speculative' && !canUsePenny ? styles.stanceTagDisabled : ''}`}
                      onClick={() => {
                        if (s === 'Penny / Speculative' && !canUsePenny) return;
                        changeStance(item.symbol, s);
                      }}
                      disabled={s === 'Penny / Speculative' && !canUsePenny}
                      title={s === 'Penny / Speculative' && !canUsePenny ? 'Penny stance is only available for OTC symbols.' : undefined}
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
