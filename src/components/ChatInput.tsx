import { useState, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";
import styles from "./ChatInput.module.css";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your stock data..."
        rows={1}
        disabled={disabled}
      />
      <button
        type="submit"
        className={styles.sendBtn}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <SendHorizonal size={18} />
      </button>
    </form>
  );
}
