import { useState } from 'react';
import { useAlerts } from '../hooks/useStockData.js';
import { WATCHLIST_STOCKS } from '../data/mockStockData.js';
import styles from './AlertsPage.module.css';

const ALERT_TYPES = [
  { value: 'price_above', label: 'Price goes above' },
  { value: 'price_below', label: 'Price drops below' },
  { value: 'percent_change', label: 'Daily % change exceeds' },
  { value: 'volume_spike', label: 'Volume spike above' },
];

function typeLabel(type) {
  return ALERT_TYPES.find((t) => t.value === type)?.label ?? type;
}

function formatValue(type, value) {
  if (type === 'percent_change') return `${value}%`;
  if (type === 'volume_spike') return `${value.toLocaleString()} shares`;
  return `$${value.toFixed(2)}`;
}

export function AlertsPage() {
  const { alerts, addAlert, toggleAlert, removeAlert } = useAlerts();
  const [symbol, setSymbol] = useState('AAPL');
  const [type, setType] = useState('price_above');
  const [value, setValue] = useState('');
  const [phone, setPhone] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (!symbol || isNaN(numValue)) return;
    addAlert({ symbol, type, value: numValue, phone: phone || null });
    setValue('');
  }

  return (
    <section className={`content-width ${styles.page}`}>
      <div>
        <h1 className={styles.pageTitle}>
          <span className="text-gradient">Price Alerts</span>
        </h1>
        <p className={styles.pageSubtitle}>
          Set up alerts so you never miss a move. SMS delivery coming soon.
        </p>
      </div>

      <div className={styles.grid}>
        <div>
          <form className={styles.card} onSubmit={handleSubmit}>
            <h2 className={styles.cardTitle}>Create Alert</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Symbol</label>
              <select
                className={styles.select}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              >
                {WATCHLIST_STOCKS.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Condition</label>
              <select
                className={styles.select}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {ALERT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                {type === 'percent_change' ? 'Threshold (%)' : type === 'volume_spike' ? 'Volume threshold' : 'Price ($)'}
              </label>
              <input
                className={styles.input}
                type="number"
                step="any"
                placeholder="e.g. 270.00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone (optional — for future SMS)</label>
              <input
                className={styles.input}
                type="tel"
                placeholder="+1 555-123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button className={styles.submitBtn} type="submit">
              Create Alert
            </button>
          </form>

          <div className={styles.futureNote} style={{ marginTop: 'var(--space-sm)' }}>
            <div className={styles.futureTitle}>Coming Soon: SMS & Push Alerts</div>
            <p style={{ margin: 0 }}>
              Future integration with Twilio or a similar provider will enable:
            </p>
            <ul className={styles.featureList}>
              <li>Real-time SMS text alerts to your phone</li>
              <li>Push notifications via a mobile companion app</li>
              <li>Email digest summaries (daily/weekly)</li>
              <li>Webhook integration for custom automations</li>
              <li>Multi-platform sync (SoFi, Cash App, Venmo positions)</li>
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Active Alerts</h2>
          {alerts.length === 0 ? (
            <div className={styles.emptyAlerts}>
              No alerts set up yet. Create one to get started.
            </div>
          ) : (
            <ul className={styles.alertsList}>
              {alerts.map((alert) => (
                <li key={alert.id} className={styles.alertItem}>
                  <div className={styles.alertInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={styles.alertSymbol}>{alert.symbol}</span>
                      <span className={`${styles.activeTag} ${alert.active ? styles.tagOn : styles.tagOff}`}>
                        {alert.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className={styles.alertCondition}>
                      {typeLabel(alert.type)}: {formatValue(alert.type, alert.value)}
                    </div>
                    <div className={styles.alertDate}>Created {alert.createdAt}</div>
                  </div>
                  <div className={styles.alertActions}>
                    <button
                      className={styles.toggleBtn}
                      onClick={() => toggleAlert(alert.id)}
                    >
                      {alert.active ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => removeAlert(alert.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
