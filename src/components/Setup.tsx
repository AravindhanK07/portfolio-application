import { useState, type FormEvent } from "react";
import { Heart, ArrowRight } from "lucide-react";
import styles from "./Setup.module.css";

interface SetupProps {
  onStart: (player1: string, player2: string) => void;
}

export function Setup({ onStart }: SetupProps) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (p1.trim() && p2.trim()) {
      onStart(p1.trim(), p2.trim());
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.iconWrap}>
          <Heart size={36} />
        </div>
        <h1 className={styles.title}>How Well Do You Know Me?</h1>
        <p className={styles.subtitle}>
          One answers, the other predicts. Let's find out if you're truly connected!
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Player 1 (answers first)</label>
          <input
            className={styles.input}
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="Your name"
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Player 2 (predicts)</label>
          <input
            className={styles.input}
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="Their name"
          />
        </div>
        <button
          type="submit"
          className={styles.startBtn}
          disabled={!p1.trim() || !p2.trim()}
        >
          Let's Play <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
