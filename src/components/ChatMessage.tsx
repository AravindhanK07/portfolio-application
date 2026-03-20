import { Bot, User, Table, Terminal } from "lucide-react";
import styles from "./ChatMessage.module.css";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "query";
  sql?: string;
  data?: Record<string, unknown>[];
  columns?: string[];
}

function DataTable({
  columns,
  data,
}: {
  columns: string[];
  data: Record<string, unknown>[];
}) {
  if (!data.length) return <p className={styles.noResults}>No results found.</p>;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{String(row[col] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.avatar}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className={styles.bubble}>
        {message.type === "query" ? (
          <>
            <div className={styles.sqlBlock}>
              <div className={styles.sqlHeader}>
                <Terminal size={14} />
                <span>SQL Query</span>
              </div>
              <code>{message.sql}</code>
            </div>
            <div className={styles.resultBlock}>
              <div className={styles.resultHeader}>
                <Table size={14} />
                <span>
                  Results ({message.data?.length ?? 0}{" "}
                  {message.data?.length === 1 ? "row" : "rows"})
                </span>
              </div>
              <DataTable
                columns={message.columns ?? []}
                data={message.data ?? []}
              />
            </div>
          </>
        ) : (
          <p className={styles.text}>{message.content}</p>
        )}
      </div>
    </div>
  );
}
