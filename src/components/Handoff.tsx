import { ArrowRight, Smartphone } from "lucide-react";
import styles from "./Handoff.module.css";

interface HandoffProps {
  player1Name: string;
  player2Name: string;
  onReady: () => void;
}

export function Handoff({ player1Name, player2Name, onReady }: HandoffProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <Smartphone size={32} />
        </div>
        <h2 className={styles.title}>Pass the phone!</h2>
        <p className={styles.subtitle}>
          <strong>{player1Name}</strong> is done answering.
          <br />
          Now hand it to <strong>{player2Name}</strong> — no peeking!
        </p>
        <p className={styles.hint}>
          {player2Name} will predict what {player1Name} chose for each question.
        </p>
        <button className={styles.readyBtn} onClick={onReady}>
          I'm {player2Name}, let's go! <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
