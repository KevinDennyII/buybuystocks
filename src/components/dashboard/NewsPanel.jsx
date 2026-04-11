import { useNews } from '../../hooks/useStockData.js';
import styles from './NewsPanel.module.css';

export function NewsPanel() {
  const { news, loading } = useNews();

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>News</h3>
      {loading ? (
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
          Loading news...
        </div>
      ) : (
        <ul className={styles.list}>
          {news.map((item) => (
            <li key={item.id} className={styles.item}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headline}
                  style={{ textDecoration: 'none' }}
                >
                  {item.headline}
                </a>
              ) : (
                <span className={styles.headline}>{item.headline}</span>
              )}
              <div className={styles.meta}>
                <span className={styles.time}>
                  {item.time}{item.source ? ` · ${item.source}` : ''}
                </span>
                {item.symbol && (
                  <span className={styles.symbolTag}>{item.symbol}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
