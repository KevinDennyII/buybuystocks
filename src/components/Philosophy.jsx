import styles from './Philosophy.module.css';

export function Philosophy({ philosophy }) {
  return (
    <section className={styles.section} id="philosophy" aria-labelledby="philosophy-heading">
      <div className="content-width">
        <div className={`surface-card ${styles.card}`}>
          <div className={styles.grid}>
            <div>
              <h2 className={styles.title} id="philosophy-heading">
                {philosophy.title}
              </h2>
              <p className={styles.body}>{philosophy.body}</p>
            </div>
            <blockquote className={styles.quote}>
              <p>&ldquo;{philosophy.pullQuote}&rdquo;</p>
              <footer className={styles.attribution}>— {philosophy.pullAttribution}</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
