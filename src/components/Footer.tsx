import { Github, Twitter } from "lucide-react";
import styles from "./Footer.module.css";

const LINKS = {
  Product: ["Features", "Pricing", "Changelog", "Docs"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Security"],
} as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#" className={styles.logo}>
              <span className={styles.logoMark}>S</span>
              <span>Starter</span>
            </a>
            <p className={styles.tagline}>
              Modern tools for modern teams.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="GitHub" className={styles.socialLink}>
                <Github size={18} />
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialLink}>
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className={styles.column}>
              <h4 className={styles.columnTitle}>{heading}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className={styles.link}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Starter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
