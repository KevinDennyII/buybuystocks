import { useCorporateActions } from '../../hooks/useStockData.js';
import styles from './CorporateActions.module.css';

function typeClass(type) {
  const t = type.toLowerCase();
  if (t === 'dividend') return styles.dividend;
  if (t === 'split') return styles.split;
  if (t === 'earnings') return styles.earnings;
  return '';
}

export function CorporateActions() {
  const actions = useCorporateActions();

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Corporate Actions</h3>
      {actions.length === 0 ? (
        <div className={styles.empty}>No upcoming actions</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Date</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{a.symbol}</td>
                <td>
                  <span className={`${styles.typeBadge} ${typeClass(a.type)}`}>
                    {a.type}
                  </span>
                </td>
                <td>{a.date}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
