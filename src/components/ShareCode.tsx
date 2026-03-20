import { useState } from "react";
import { Copy, Check, Home } from "lucide-react";
import styles from "./ShareCode.module.css";

interface ShareCodeProps {
  code: string;
  onDone: () => void;
}

export function ShareCode({ code, onDone }: ShareCodeProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>You're all done!</h2>
        <p className={styles.subtitle}>
          Now share this code with your partner so they can predict your answers.
        </p>

        <div className={styles.codeBox}>
          <span className={styles.code}>{code}</span>
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p className={styles.hint}>
          They'll go to the same website, click <strong>"Join"</strong>, and enter this code.
        </p>

        <button className={styles.homeBtn} onClick={onDone}>
          <Home size={16} /> Back to Home
        </button>
      </div>
    </div>
  );
}
