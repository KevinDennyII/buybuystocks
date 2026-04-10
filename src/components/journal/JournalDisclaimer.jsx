import { Link } from 'react-router-dom';
import styles from './JournalDisclaimer.module.css';

export function JournalDisclaimer() {
  return (
    <section className={styles.section} aria-label="Disclaimer">
      <div className="content-width">
        <div className={styles.box}>
          <p className={styles.text}>
            This journal is a personal record only — not advice. For site-wide terms, see the{' '}
            <Link className={styles.link} to="/#disclaimer">
              disclaimer on the home page
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
