import { usePositions, useStockPnL } from '../../hooks/useStockData.js';
import styles from './PositionsList.module.css';

function fmt(n) {
  return n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pnlColor(v) {
  return v >= 0 ? styles.positive : styles.negative;
}

export function PositionsList() {
  const positions = usePositions();
  const stockPnL = useStockPnL();

  const totalMarketValue = positions.reduce((s, p) => s + p.marketValue, 0);
  const totalPnL = positions.reduce((s, p) => s + p.totalPnL, 0);
  const totalCost = positions.reduce((s, p) => s + p.avgCost * p.qty, 0);
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-sm)' }}>
      <div className={styles.card}>
        <h3 className={styles.title}>Positions</h3>
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Avg Cost</th>
                <th>Price</th>
                <th>Mkt Value</th>
                <th>P&L</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.symbol}>
                  <td className={styles.symbolCol}>{p.symbol}</td>
                  <td className={styles.nameCol}>{p.name}</td>
                  <td>{p.qty}</td>
                  <td>${fmt(p.avgCost)}</td>
                  <td>${fmt(p.currentPrice)}</td>
                  <td>${fmt(p.marketValue)}</td>
                  <td className={pnlColor(p.totalPnL)}>
                    {p.totalPnL >= 0 ? '+' : ''}${fmt(p.totalPnL)}
                  </td>
                  <td className={pnlColor(p.totalPnLPercent)}>
                    {p.totalPnLPercent >= 0 ? '+' : ''}{p.totalPnLPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                <td colSpan={5}>Total</td>
                <td>${fmt(totalMarketValue)}</td>
                <td className={pnlColor(totalPnL)}>
                  {totalPnL >= 0 ? '+' : ''}${fmt(totalPnL)}
                </td>
                <td className={pnlColor(totalPnLPercent)}>
                  {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.title}>Stock P&L</h3>
        <ul className={styles.pnlList}>
          {stockPnL.map((s) => (
            <li key={s.symbol} className={styles.pnlItem}>
              <div>
                <div className={styles.pnlSymbol}>{s.symbol}</div>
                <div className={styles.pnlName}>{s.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`${styles.pnlValue} ${pnlColor(s.pnl)}`}>
                  {s.pnl >= 0 ? '+' : ''}${fmt(s.pnl)}
                </div>
                <div style={{ fontSize: '0.7rem' }} className={pnlColor(s.pnlPercent)}>
                  {s.pnlPercent >= 0 ? '+' : ''}{s.pnlPercent.toFixed(1)}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
