import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useScrolled } from "../hooks/useScrolled";
import { useTheme } from "../hooks/useTheme";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export function Header() {
  const scrolled = useScrolled();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          <span className={styles.logoMark}>S</span>
          <span className={styles.logoText}>Starter</span>
        </a>

        <nav className={styles.desktopNav}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className={styles.navLink}>
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#cta" className={styles.cta}>
            Get Started
          </a>
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className={styles.mobileNav}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
