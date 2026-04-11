import { Link } from 'react-router-dom';
import styles from './QuickNav.module.css';

const ITEMS = [
  {
    to: '/dashboard',
    icon: '\u{1F4CA}',
    iconClass: 'iconDashboard',
    title: 'Trading Desk',
    desc: 'Live watchlist, candlestick charts, real-time quotes, market news, and corporate actions.',
    badge: 'new',
  },
  {
    to: '/portfolio',
    icon: '\u{1F4B0}',
    iconClass: 'iconPortfolio',
    title: 'Portfolio',
    desc: 'Account value, positions, P&L charts, risk level, and buying power tracking.',
    badge: 'new',
  },
  {
    to: '/watchlist',
    icon: '\u{2B50}',
    iconClass: 'iconAlerts',
    title: 'Watchlist',
    desc: 'Manage your watch targets, write your thesis, and organize by stance.',
    badge: 'new',
  },
  {
    to: '/alerts',
    icon: '\u{1F514}',
    iconClass: 'iconAlerts',
    title: 'Price Alerts',
    desc: 'Set price thresholds and get notified. SMS text alerts coming soon.',
    badge: 'soon',
  },
  {
    to: '/journal',
    icon: '\u{1F4DD}',
    iconClass: 'iconJournal',
    title: 'Trade Journal',
    desc: 'Log every trade: setup, outcome, and lessons learned. Build your process.',
    badge: null,
  },
];

export function QuickNav() {
  return (
    <section className={styles.section} id="tools">
      <div className={`content-width ${styles.grid}`}>
        {ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className={styles.card}>
            <div className={`${styles.iconWrap} ${styles[item.iconClass]}`}>
              {item.icon}
            </div>
            <div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              {item.badge && (
                <span className={`${styles.badge} ${item.badge === 'new' ? styles.badgeNew : styles.badgeSoon}`}>
                  {item.badge === 'new' ? 'New' : 'Coming soon'}
                </span>
              )}
            </div>
            <p className={styles.cardDesc}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
