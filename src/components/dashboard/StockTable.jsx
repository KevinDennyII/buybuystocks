import styles from './StockTable.module.css';

function formatVolume(v) {
  if (!v) return '—';
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + 'B';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
  return v.toString();
}

function stanceClass(stance) {
  if (!stance) return '';
  const lower = stance.toLowerCase();
  if (lower.includes('long')) return styles.stanceLong;
  if (lower.includes('penny') || lower.includes('speculative')) return styles.stancePenny;
  return styles.stanceActive;
}

function changeColor(val) {
  if (val > 0) return styles.positive;
  if (val < 0) return styles.negative;
  return styles.neutral;
}

export function StockTable({ stocks, selectedSymbol, onSelect, onRemove, onChangeStance }) {
  if (!stocks.length) {
    return (
      <div className={styles.noData}>
        <p>No stocks in watchlist</p>
        <p className={styles.noDataHint}>Use the search bar above to add symbols</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Change</th>
            <th>% Chg</th>
            <th>Volume</th>
            <th>Stance</th>
            <th className={styles.actionsHeader}></th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, i) => (
            <tr
              key={stock.symbol}
              className={`${styles.row} ${stock.symbol === selectedSymbol ? styles.rowSelected : ''}`}
              onClick={() => onSelect(stock.symbol)}
            >
              <td>{i + 1}</td>
              <td>
                <div className={styles.symbolCell}>
                  <span className={styles.symbol}>{stock.symbol}</span>
                  <span className={styles.name}>{stock.name}</span>
                </div>
              </td>
              <td>{stock.lastPrice?.toFixed(2) ?? '—'}</td>
              <td className={changeColor(stock.change)}>
                {stock.change != null ? `${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}` : '—'}
              </td>
              <td className={changeColor(stock.changePercent)}>
                {stock.changePercent != null ? `${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%` : '—'}
              </td>
              <td className={styles.volumeCell}>{formatVolume(stock.volume)}</td>
              <td>
                {onChangeStance ? (
                  <select
                    className={`${styles.stanceSelect} ${stanceClass(stock.stance)}`}
                    value={stock.stance || 'Active'}
                    onChange={(e) => {
                      e.stopPropagation();
                      onChangeStance(stock.symbol, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="Long-term">Long-term</option>
                    <option value="Active">Active</option>
                    <option value="Penny / Speculative">Penny</option>
                  </select>
                ) : (
                  <span className={`${styles.stanceTag} ${stanceClass(stock.stance)}`}>
                    {stock.stance}
                  </span>
                )}
              </td>
              <td className={styles.actionsCell}>
                {onRemove && (
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(stock.symbol);
                    }}
                    title={`Remove ${stock.symbol} from watchlist`}
                    aria-label={`Remove ${stock.symbol}`}
                  >
                    ×
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
