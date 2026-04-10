import { FocusIcon } from './icons/FocusIcons.jsx';
import styles from './FocusAreas.module.css';

export function FocusAreas({ focus }) {
  return (
    <section className={styles.section} id="focus" aria-labelledby="focus-heading">
      <div className="content-width">
        <header className={styles.header}>
          <h2 className={styles.title} id="focus-heading">
            {focus.title}
          </h2>
          <p className={styles.subtitle}>{focus.subtitle}</p>
        </header>
        <ul className={styles.grid}>
          {focus.items.map((item) => (
            <li key={item.id}>
              <article className={`surface-card ${styles.card}`}>
                <div className={styles.iconWrap} aria-hidden>
                  <FocusIcon name={item.icon} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
