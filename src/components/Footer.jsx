import styles from './Footer.module.css';

export function Footer({ footer, siteName }) {
  return (
    <footer className={styles.footer}>
      <div className={`content-width ${styles.inner}`}>
        <p className={styles.left}>
          © {footer.year} {siteName}
        </p>
        <p className={styles.right}>{footer.note}</p>
      </div>
    </footer>
  );
}
