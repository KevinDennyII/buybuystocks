import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export function Hero({ hero }) {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-heading">
      <div className={`content-width ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1 className={styles.headline} id="hero-heading">
            <span className="text-gradient">{hero.headline}</span>
          </h1>
          <p className={styles.subhead}>{hero.subhead}</p>
          <div className={styles.ctaRow}>
            <Link className={styles.btnPrimary} to={hero.primaryCta.to}>
              {hero.primaryCta.label}
            </Link>
            <Link className={styles.btnGhost} to={hero.secondaryCta.to}>
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
        <div className={styles.visual} aria-hidden>
          <div className={styles.blob} />
          <div className={`surface-card ${styles.card}`}>
            <div className={styles.spark} />
            <p className={styles.cardLabel}>Today&apos;s mantra</p>
            <p className={styles.cardQuote}>Small size. Clear rules. Next trade is optional.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
