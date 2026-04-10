import { Link } from 'react-router-dom';
import styles from './TradeJournal.module.css';

export function TradeJournal({ data }) {
  return (
    <section className={styles.section} aria-labelledby="journal-heading">
      <div className="content-width">
        <header className={styles.header}>
          <p className={styles.breadcrumb}>
            <Link className={styles.breadcrumbLink} to="/">
              Home
            </Link>
            <span aria-hidden> / </span>
            <span>Journal</span>
          </p>
          <h1 className={styles.title} id="journal-heading">
            {data.title}
          </h1>
          <p className={styles.subtitle}>{data.subtitle}</p>
        </header>

        <ol className={styles.list}>
          {data.entries.map((entry) => (
            <li key={entry.id}>
              <article className={`surface-card ${styles.card}`}>
                <div className={styles.meta}>
                  <time className={styles.date} dateTime={entry.date}>
                    {entry.date}
                  </time>
                  <span className={styles.symbol}>{entry.symbol}</span>
                  <span className={styles.pill}>{entry.style}</span>
                  <span className={styles.pill}>{entry.side}</span>
                </div>
                <div className={styles.body}>
                  <h2 className={styles.label}>Setup</h2>
                  <p className={styles.text}>{entry.setup}</p>
                  <h2 className={styles.label}>Outcome</h2>
                  <p className={styles.text}>{entry.outcome}</p>
                  <h2 className={styles.label}>Lesson</h2>
                  <p className={styles.text}>{entry.lesson}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
