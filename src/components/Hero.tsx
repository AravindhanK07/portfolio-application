import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.gridBg} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Now in Public Beta</span>
        </div>

        <h1 className={styles.title}>
          Build beautiful products
          <br />
          <span className={styles.gradient}>faster than ever</span>
        </h1>

        <p className={styles.subtitle}>
          A modern development toolkit that helps teams ship polished,
          production-ready applications with confidence. From prototype to
          production in record time.
        </p>

        <div className={styles.actions}>
          <a href="#cta" className={styles.primary}>
            Start Building
            <ArrowRight size={16} />
          </a>
          <a href="#features" className={styles.secondary}>
            See Features
          </a>
        </div>

        <div className={styles.social}>
          <div className={styles.avatars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.avatar}>
                <div
                  className={styles.avatarInner}
                  style={{
                    background: `hsl(${220 + i * 30}, 60%, ${50 + i * 5}%)`,
                  }}
                />
              </div>
            ))}
          </div>
          <p className={styles.socialText}>
            Trusted by <strong>2,000+</strong> developers worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
