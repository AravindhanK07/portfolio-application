import { Check, Trash2, Undo2 } from "lucide-react";
import type { BucketItem } from "./BucketList";
import styles from "./ItemList.module.css";

const CATEGORY_EMOJI: Record<string, string> = {
  adventure: "🏔️",
  food: "🍕",
  travel: "✈️",
  romance: "💕",
  fun: "🎉",
  chill: "🌙",
};

interface ItemListProps {
  title: string;
  items: BucketItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ItemList({ title, items, onToggle, onDelete }: ItemListProps) {
  if (!items.length) {
    return (
      <div className={styles.empty}>
        <p>No items yet — add something fun above!</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.list}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${item.done ? styles.done : ""}`}
          >
            <div className={styles.cardContent}>
              <span className={styles.emoji}>
                {CATEGORY_EMOJI[item.category] ?? "🎯"}
              </span>
              <div className={styles.info}>
                <span className={styles.text}>{item.text}</span>
                <span className={styles.meta}>
                  Added by {item.addedBy}
                </span>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.actionBtn} ${styles.toggleBtn}`}
                onClick={() => onToggle(item.id)}
                aria-label={item.done ? "Undo" : "Mark done"}
              >
                {item.done ? <Undo2 size={15} /> : <Check size={15} />}
              </button>
              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => onDelete(item.id)}
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
