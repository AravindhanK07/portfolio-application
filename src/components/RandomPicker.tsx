import { useState, useRef } from "react";
import { Shuffle, PartyPopper } from "lucide-react";
import type { BucketItem } from "./BucketList";
import styles from "./RandomPicker.module.css";

const CATEGORY_EMOJI: Record<string, string> = {
  adventure: "🏔️",
  food: "🍕",
  travel: "✈️",
  romance: "💕",
  fun: "🎉",
  chill: "🌙",
};

interface RandomPickerProps {
  items: BucketItem[];
}

export function RandomPicker({ items }: RandomPickerProps) {
  const [picked, setPicked] = useState<BucketItem | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  function pickRandom() {
    if (items.length === 0 || spinning) return;

    setSpinning(true);
    setPicked(null);

    let count = 0;
    const totalFlips = 15 + Math.floor(Math.random() * 10);

    intervalRef.current = setInterval(() => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setDisplayText(
        `${CATEGORY_EMOJI[randomItem.category] ?? "🎯"} ${randomItem.text}`
      );
      count++;

      if (count >= totalFlips) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const winner = items[Math.floor(Math.random() * items.length)];
        setPicked(winner);
        setDisplayText("");
        setSpinning(false);
      }
    }, 80 + count * 8);
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>Add some items to your bucket list first!</p>
          <p className={styles.hint}>
            Go to "Our List" tab and add things you want to do together
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pickerArea}>
        {spinning && (
          <div className={styles.spinDisplay}>
            <span className={styles.spinText}>{displayText}</span>
          </div>
        )}

        {picked && !spinning && (
          <div className={styles.result}>
            <div className={styles.celebration}>
              <PartyPopper size={28} />
            </div>
            <h2 className={styles.resultTitle}>Your next date:</h2>
            <div className={styles.resultCard}>
              <span className={styles.resultEmoji}>
                {CATEGORY_EMOJI[picked.category] ?? "🎯"}
              </span>
              <span className={styles.resultText}>{picked.text}</span>
            </div>
            <p className={styles.resultMeta}>
              Suggested by {picked.addedBy}
            </p>
          </div>
        )}

        {!picked && !spinning && (
          <p className={styles.prompt}>
            Ready to find out what you're doing next?
          </p>
        )}

        <button
          className={styles.pickBtn}
          onClick={pickRandom}
          disabled={spinning}
        >
          <Shuffle size={20} />
          {spinning ? "Picking..." : "Pick for us!"}
        </button>

        <p className={styles.count}>
          {items.length} idea{items.length === 1 ? "" : "s"} in the hat
        </p>
      </div>
    </div>
  );
}
