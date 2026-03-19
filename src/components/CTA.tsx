import { ArrowRight } from "lucide-react";
import styles from "./CTA.module.css";

export function CTA() {
  return (
    <section id="cta" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.glow} aria-hidden="true" />
          <h2 className={styles.title}>Ready to build something great?</h2>
          <p className={styles.subtitle}>
            Join thousands of developers who are already shipping faster with
            Starter. Free to get started, no credit card required.
          </p>
          <div className={styles.actions}>
            <a href="#" className={styles.primary}>
              Get Started Free
              <ArrowRight size={16} />
            </a>
            <a href="#" className={styles.secondary}>
              Talk to Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
