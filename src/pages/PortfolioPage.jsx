import { AccountSummary } from '../components/portfolio/AccountSummary.jsx';
import { PnLCharts } from '../components/portfolio/PnLCharts.jsx';
import { PositionsList } from '../components/portfolio/PositionsList.jsx';
import styles from './PortfolioPage.module.css';

const PLATFORMS = ['SoFi', 'Webull', 'Venmo', 'Cash App'];

export function PortfolioPage() {
  return (
    <section className={`content-width ${styles.page}`}>
      <div>
        <h1 className={styles.pageTitle}>
          <span className="text-gradient">Portfolio</span>
        </h1>
        <p className={styles.pageSubtitle}>
          Account overview, positions, and performance tracking.
        </p>
        <div className={styles.platformsNote} style={{ marginTop: 'var(--space-sm)' }}>
          <span className={styles.platformLabel}>Trading on:</span>
          {PLATFORMS.map((p) => (
            <span key={p} className={styles.platformBadge}>{p}</span>
          ))}
        </div>
      </div>

      <AccountSummary />
      <PnLCharts />
      <PositionsList />
    </section>
  );
}
