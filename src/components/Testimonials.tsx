import { Star } from "lucide-react";
import styles from "./Testimonials.module.css";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CTO at Vortex",
    quote:
      "Starter cut our development time by 60%. We shipped our entire SaaS platform in just 6 weeks.",
    color: "#6366f1",
  },
  {
    name: "Marcus Rivera",
    role: "Lead Engineer at Bloom",
    quote:
      "The component library is incredibly well thought out. Every component just works exactly as you'd expect.",
    color: "#a78bfa",
  },
  {
    name: "Priya Sharma",
    role: "Founder at NexGen",
    quote:
      "We evaluated 12 frameworks before choosing Starter. Nothing else came close in terms of developer experience.",
    color: "#f472b6",
  },
] as const;

export function Testimonials() {
  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Testimonials</span>
          <h2 className={styles.title}>Loved by developers</h2>
        </div>

        <div className={styles.grid}>
          {TESTIMONIALS.map(({ name, role, quote, color }) => (
            <article key={name} className={styles.card}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />
                ))}
              </div>
              <blockquote className={styles.quote}>&ldquo;{quote}&rdquo;</blockquote>
              <div className={styles.author}>
                <div
                  className={styles.avatarCircle}
                  style={{ background: color }}
                >
                  {name[0]}
                </div>
                <div>
                  <p className={styles.name}>{name}</p>
                  <p className={styles.role}>{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
