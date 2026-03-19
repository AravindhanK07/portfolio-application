import styles from "./Stats.module.css";

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "50ms", label: "Avg Response" },
  { value: "150+", label: "Integrations" },
] as const;

export function Stats() {
  return (
    <section id="stats" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {STATS.map(({ value, label }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.value}>{value}</span>
              <span className={styles.label}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
