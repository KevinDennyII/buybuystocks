import { Link, useLocation } from 'react-router-dom';
import styles from './MobileNav.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Desk', icon: '📊' },
  { to: '/watchlist', label: 'Watchlist', icon: '⭐' },
  { to: '/portfolio', label: 'Portfolio', icon: '💼' },
  { to: '/alerts', label: 'Alerts', icon: '🔔' },
  { to: '/journal', label: 'Journal', icon: '📝' },
];

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.mobileNav} aria-label="Mobile navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          >
            <span className={styles.icon} aria-hidden>
              {item.icon}
            </span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
