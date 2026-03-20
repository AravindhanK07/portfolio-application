import { useState } from "react";
import { Check, X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import type { Question } from "./questions";
import type { GameState } from "./Game";
import styles from "./Results.module.css";

interface ResultsProps {
  state: GameState;
  questions: Question[];
  onRestart: () => void;
}

const MESSAGES: Record<string, { emoji: string; title: string; subtitle: string }> = {
  perfect: { emoji: "🔥", title: "Soulmates!", subtitle: "You two are literally the same person." },
  great: { emoji: "💕", title: "You know each other so well!", subtitle: "Seriously impressive connection." },
  good: { emoji: "😊", title: "Not bad at all!", subtitle: "You've been paying attention." },
  okay: { emoji: "🤔", title: "Room to grow!", subtitle: "Time for more deep conversations." },
  low: { emoji: "😅", title: "Oops...", subtitle: "Maybe plan a long date night to catch up!" },
};

function getVerdict(score: number, total: number) {
  const pct = score / total;
  if (pct === 1) return MESSAGES.perfect;
  if (pct >= 0.75) return MESSAGES.great;
  if (pct >= 0.5) return MESSAGES.good;
  if (pct >= 0.25) return MESSAGES.okay;
  return MESSAGES.low;
}

export function Results({ state, questions, onRestart }: ResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const score = questions.filter(
    (q) => state.player1Answers[q.id] === state.player2Answers[q.id]
  ).length;

  const verdict = getVerdict(score, questions.length);

  return (
    <div className={styles.container}>
      <div className={styles.scoreSection}>
        <span className={styles.emoji}>{verdict.emoji}</span>
        <h1 className={styles.score}>
          {score} / {questions.length}
        </h1>
        <h2 className={styles.title}>{verdict.title}</h2>
        <p className={styles.subtitle}>
          {state.player2Name} got {score} out of {questions.length} right.{" "}
          {verdict.subtitle}
        </p>
      </div>

      <button
        className={styles.detailsToggle}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide" : "Show"} answers
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showDetails && (
        <div className={styles.breakdown}>
          {questions.map((q) => {
            const p1 = state.player1Answers[q.id];
            const p2 = state.player2Answers[q.id];
            const match = p1 === p2;

            return (
              <div
                key={q.id}
                className={`${styles.item} ${match ? styles.correct : styles.wrong}`}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.itemIcon}>
                    {match ? <Check size={16} /> : <X size={16} />}
                  </span>
                  <span className={styles.itemQ}>{q.text}</span>
                </div>
                <div className={styles.itemAnswers}>
                  <div className={styles.answer}>
                    <span className={styles.answerLabel}>{state.player1Name}:</span>
                    <span>{p1}</span>
                  </div>
                  <div className={styles.answer}>
                    <span className={styles.answerLabel}>{state.player2Name}:</span>
                    <span>{p2}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className={styles.restartBtn} onClick={onRestart}>
        <RotateCcw size={18} />
        Play Again
      </button>
    </div>
  );
}
