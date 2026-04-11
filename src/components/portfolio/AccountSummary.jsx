import { usePortfolio } from '../../hooks/useStockData.js';
import styles from './AccountSummary.module.css';

function fmt(n) {
  return n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function riskClass(level) {
  const l = (level || '').toLowerCase();
  if (l === 'safe') return styles.riskSafe;
  if (l === 'moderate') return styles.riskModerate;
  return styles.riskHigh;
}

export function AccountSummary() {
  const p = usePortfolio();
  if (!p) return null;

  const retColor = p.totalReturn >= 0 ? styles.positive : styles.negative;

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${styles.cardPrimary}`}>
        <p className={styles.label}>Net Account Value</p>
        <p className={styles.value}>${fmt(p.netAccountValue)}</p>
        <div className={`${styles.returnInfo} ${retColor}`}>
          <span>{p.totalReturn >= 0 ? '+' : ''}${fmt(p.totalReturn)}</span>
          <span>({p.totalReturnPercent >= 0 ? '+' : ''}{p.totalReturnPercent.toFixed(2)}%)</span>
        </div>
        <div className={styles.subRow}>
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Market Value</span>
            <span className={styles.subValue}>${fmt(p.marketValue)}</span>
          </div>
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Cash Balance</span>
            <span className={styles.subValue}>${fmt(p.cashBalance)}</span>
          </div>
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Day-Trade BP</span>
            <span className={styles.subValue}>${fmt(p.dayTradeBP)}</span>
          </div>
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Overnight BP</span>
            <span className={styles.subValue}>${fmt(p.overnightBP)}</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.label}>Risk Level</p>
        <span className={`${styles.riskBadge} ${riskClass(p.riskLevel)}`}>
          {p.riskLevel}
        </span>
        <div className={styles.subRow}>
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Maint. Margin</span>
            <span className={styles.subValue}>${fmt(p.maintenanceMargin)}</span>
          </div>
          <div className={styles.subItem}>
            <span className={styles.subLabel}>Init. Margin</span>
            <span className={styles.subValue}>${fmt(p.initialMargin)}</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.label}>Day Trades Left</p>
        <p className={styles.dayTrades}>{p.dayTradesLeft}</p>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
          Rolling 5-day window
        </p>
      </div>
    </div>
  );
}
