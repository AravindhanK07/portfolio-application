import { Zap, Shield, BarChart3, Layers, Globe, Palette } from "lucide-react";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized build pipeline delivers sub-second hot reloads and instant production builds.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Built-in security best practices including CSP headers, CSRF protection, and dependency auditing.",
  },
  {
    icon: BarChart3,
    title: "Analytics Ready",
    description:
      "Integrated performance monitoring and user analytics with zero-config setup.",
  },
  {
    icon: Layers,
    title: "Component Library",
    description:
      "50+ accessible, composable components designed with consistency and customization in mind.",
  },
  {
    icon: Globe,
    title: "Edge Deployment",
    description:
      "Deploy globally with automatic edge caching and smart CDN routing for optimal performance.",
  },
  {
    icon: Palette,
    title: "Design System",
    description:
      "Flexible theming with design tokens, dark mode support, and responsive utilities built-in.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Features</span>
          <h2 className={styles.title}>Everything you need to ship</h2>
          <p className={styles.subtitle}>
            Stop stitching together dozens of libraries. Get a complete,
            production-ready toolkit that works out of the box.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article key={title} className={styles.card}>
              <div className={styles.iconWrap}>
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
