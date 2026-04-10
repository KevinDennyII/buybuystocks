import styles from './Disclaimer.module.css';

export function Disclaimer({ disclaimer }) {
  return (
    <section className={styles.section} id="disclaimer" aria-labelledby="disclaimer-heading">
      <div className="content-width">
        <div className={styles.box}>
          <h2 className={styles.title} id="disclaimer-heading">
            {disclaimer.title}
          </h2>
          <p className={styles.body}>{disclaimer.body}</p>
        </div>
      </div>
    </section>
  );
}
