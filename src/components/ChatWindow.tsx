import { useState, useRef, useEffect } from "react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Database, Loader2 } from "lucide-react";
import styles from "./ChatWindow.module.css";

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      type: "text",
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? "",
        type: data.type,
        sql: data.sql,
        data: data.data,
        columns: data.columns,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : "Something went wrong"}`,
        type: "text",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Database size={32} />
            </div>
            <h2>Stock Details AI Chat</h2>
            <p>
              Ask questions about your stock data in natural language. I'll
              query the database and show you the results.
            </p>
            <div className={styles.suggestions}>
              {[
                "Show all items with low stock",
                "What's the total inventory value?",
                "Which products have the highest quantity?",
              ].map((s) => (
                <button
                  key={s}
                  className={styles.suggestion}
                  onClick={() => handleSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className={styles.loading}>
            <Loader2 size={18} className={styles.spinner} />
            <span>Thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
