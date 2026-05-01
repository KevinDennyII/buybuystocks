import styles from './Watchlist.module.css';

function assetTypeLabel(assetType) {
  if (assetType === 'mutual_fund') return 'Mutual Fund';
  if (assetType === 'etf') return 'ETF';
  if (assetType === 'otc') return 'OTC';
  if (assetType === 'stock') return 'Stock';
  return 'Unknown';
}

export function Watchlist({ data }) {
  return (
    <section className={styles.section} id="watchlist" aria-labelledby="watchlist-heading">
      <div className="content-width">
        <header className={styles.header}>
          <h2 className={styles.title} id="watchlist-heading">
            {data.title}
          </h2>
          <p className={styles.description}>{data.description}</p>
        </header>
        <ul className={styles.list}>
          {data.items.map((item) => (
            <li key={item.id}>
              <article className={`surface-card ${styles.card}`}>
                <div className={styles.row}>
                  <span className={styles.symbol}>{item.symbol}</span>
                  <span className={styles.stance}>{item.stance}</span>
                </div>
                <span className={styles.assetType}>{assetTypeLabel(item.assetType)}</span>
                <p className={styles.thesis}>{item.thesis}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
