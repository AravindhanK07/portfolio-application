import { Moon, Sun, Heart } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import styles from "./Header.module.css";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>
            <Heart size={16} />
          </span>
          <span className={styles.logoText}>How Well Do You Know Me?</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
