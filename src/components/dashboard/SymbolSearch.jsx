import { useState, useRef, useEffect } from 'react';
import { fetchSymbolSearch } from '../../services/stockApi.js';
import styles from './SymbolSearch.module.css';

function assetTypeLabel(assetType) {
  if (assetType === 'mutual_fund') return 'Mutual Fund';
  if (assetType === 'etf') return 'ETF';
  if (assetType === 'otc') return 'OTC';
  if (assetType === 'stock') return 'Stock';
  return 'Unknown';
}

export function SymbolSearch({ onSelect, onAdd, isWatching }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const wrapperRef = useRef(null);
  const searchSeqRef = useRef(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    const currentSeq = ++searchSeqRef.current;
    setSearching(true);

    const t = setTimeout(async () => {
      const next = await fetchSymbolSearch(query, 8).catch(() => []);
      if (searchSeqRef.current === currentSeq) {
        setResults(next);
        setSearching(false);
      }
    }, 220);

    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(symbol) {
    onSelect(symbol);
    setQuery('');
    setOpen(false);
  }

  function handleAdd(item, e) {
    e.stopPropagation();
    if (onAdd) onAdd(item);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputGroup}>
        <span className={styles.icon}>&#128269;</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search & add symbols..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
        />
      </div>
      {open && (results.length > 0 || searching || query.trim()) && (
        <div className={styles.dropdown}>
          {searching && (
            <div className={styles.emptyNote}>Searching symbols...</div>
          )}
          {!searching && results.map((s) => {
            const watched = isWatching?.(s.symbol);
            return (
              <div
                key={s.symbol}
                className={styles.option}
                onClick={() => handleSelect(s.symbol)}
              >
                <div className={styles.optLeft}>
                  <span className={styles.optSymbol}>{s.symbol}</span>
                  <div className={styles.optMeta}>
                    <span className={styles.optName}>{s.name}</span>
                    <span className={styles.optType}>
                      {assetTypeLabel(s.assetType)}
                      {s.exchange ? ` - ${s.exchange}` : ''}
                    </span>
                  </div>
                </div>
                {watched ? (
                  <span className={styles.watchedTag}>Watching</span>
                ) : (
                  <button
                    className={styles.addBtn}
                    onClick={(e) => handleAdd(s, e)}
                    title={`Add ${s.symbol} to watchlist`}
                  >
                    + Add
                  </button>
                )}
              </div>
            );
          })}
          {!searching && query.trim() && results.length === 0 && (
            <div className={styles.emptyNote}>No matching symbols found.</div>
          )}
        </div>
      )}
    </div>
  );
}
