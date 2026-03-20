import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import styles from "./AddItem.module.css";

const CATEGORIES = [
  { value: "adventure", label: "Adventure", emoji: "🏔️" },
  { value: "food", label: "Food", emoji: "🍕" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "romance", label: "Romance", emoji: "💕" },
  { value: "fun", label: "Fun", emoji: "🎉" },
  { value: "chill", label: "Chill", emoji: "🌙" },
];

interface AddItemProps {
  onAdd: (text: string, category: string, addedBy: string) => void;
}

export function AddItem({ onAdd }: AddItemProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("fun");
  const [addedBy, setAddedBy] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), category, addedBy.trim() || "Us");
    setText("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <input
          className={styles.textInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add something you want to do together..."
        />
        <button
          type="submit"
          className={styles.addBtn}
          disabled={!text.trim()}
          aria-label="Add item"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className={styles.options}>
        <div className={styles.categories}>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`${styles.catBtn} ${category === c.value ? styles.catActive : ""}`}
              onClick={() => setCategory(c.value)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <input
          className={styles.nameInput}
          value={addedBy}
          onChange={(e) => setAddedBy(e.target.value)}
          placeholder="Added by... (optional)"
        />
      </div>
    </form>
  );
}
