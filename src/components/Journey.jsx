import styles from './Journey.module.css';

export function Journey({ journey }) {
  return (
    <section className={styles.section} id="journey" aria-labelledby="journey-heading">
      <div className="content-width">
        <header className={styles.header}>
          <h2 className={styles.title} id="journey-heading">
            {journey.title}
          </h2>
          <p className={styles.subtitle}>{journey.subtitle}</p>
        </header>
        <ol className={styles.timeline}>
          {journey.milestones.map((step, index) => (
            <li key={step.phase} className={styles.step}>
              <span className={styles.badge} aria-hidden>
                {index + 1}
              </span>
              <div className={`surface-card ${styles.card}`}>
                <p className={styles.phase}>{step.phase}</p>
                <p className={styles.detail}>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
