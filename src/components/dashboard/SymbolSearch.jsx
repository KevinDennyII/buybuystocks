import { useState, useRef, useEffect } from 'react';
import { WATCHLIST_STOCKS, PENNY_STOCKS } from '../../data/mockStockData.js';
import styles from './SymbolSearch.module.css';

const ALL_STOCKS = [...WATCHLIST_STOCKS, ...PENNY_STOCKS];

export function SymbolSearch({ onSelect, onAdd, isWatching }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filtered = query.length > 0
    ? ALL_STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const exactMatch = query.length > 0 && !filtered.some(
    (s) => s.symbol.toLowerCase() === query.toLowerCase()
  );

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

  function handleAdd(symbol, e) {
    e.stopPropagation();
    if (onAdd) onAdd(symbol);
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
      {open && (filtered.length > 0 || exactMatch) && (
        <div className={styles.dropdown}>
          {filtered.map((s) => {
            const watched = isWatching?.(s.symbol);
            return (
              <div
                key={s.symbol}
                className={styles.option}
                onClick={() => handleSelect(s.symbol)}
              >
                <div className={styles.optLeft}>
                  <span className={styles.optSymbol}>{s.symbol}</span>
                  <span className={styles.optName}>{s.name}</span>
                </div>
                {watched ? (
                  <span className={styles.watchedTag}>Watching</span>
                ) : (
                  <button
                    className={styles.addBtn}
                    onClick={(e) => handleAdd(s.symbol, e)}
                    title={`Add ${s.symbol} to watchlist`}
                  >
                    + Add
                  </button>
                )}
              </div>
            );
          })}
          {exactMatch && query.length >= 1 && (
            <div
              className={styles.option}
              onClick={() => {
                const sym = query.toUpperCase();
                if (onAdd) onAdd(sym);
                handleSelect(sym);
              }}
            >
              <div className={styles.optLeft}>
                <span className={styles.optSymbol}>{query.toUpperCase()}</span>
                <span className={styles.optName}>Add custom symbol</span>
              </div>
              <button
                className={styles.addBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAdd) onAdd(query.toUpperCase());
                }}
              >
                + Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
