import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

function isActiveNav(to, pathname, hash) {
  if (to === '/journal') {
    return pathname === '/journal';
  }
  if (to.includes('#')) {
    const [pathPart, fragment] = to.split('#');
    const normalizedPath = pathPart === '' ? '/' : pathPart;
    return normalizedPath === pathname && hash === `#${fragment}`;
  }
  return pathname === to;
}

export function Header({ meta, nav }) {
  const { pathname, hash } = useLocation();

  return (
    <header className={styles.header}>
      <div className={`content-width ${styles.inner}`}>
        <Link className={styles.brand} to="/">
          <span className={styles.brandMark} aria-hidden />
          <span className={styles.brandText}>{meta.siteName}</span>
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {nav.links.map((link) => {
              const active = isActiveNav(link.to, pathname, hash);
              return (
                <li key={link.id}>
                  <Link
                    className={active ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
