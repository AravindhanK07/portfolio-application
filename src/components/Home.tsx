import { useState, type FormEvent } from "react";
import { Heart, ArrowRight, LogIn, Trophy } from "lucide-react";
import styles from "./Home.module.css";

interface HomeProps {
  onCreate: (name: string) => Promise<void>;
  onJoin: (code: string, name: string) => Promise<void>;
  onViewResults: (code: string) => void;
}

export function Home({ onCreate, onJoin, onViewResults }: HomeProps) {
  const [tab, setTab] = useState<"create" | "join" | "results">("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [joinName, setJoinName] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onCreate(name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || !joinName.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onJoin(code.trim(), joinName.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleResults(e: FormEvent) {
    e.preventDefault();
    if (!resultCode.trim()) return;
    setError("");
    onViewResults(resultCode.trim());
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.iconWrap}>
          <Heart size={36} />
        </div>
        <h1 className={styles.title}>How Well Do You Know Me?</h1>
        <p className={styles.subtitle}>
          One answers, the other predicts — from anywhere!
        </p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "create" ? styles.active : ""}`}
          onClick={() => { setTab("create"); setError(""); }}
        >
          <Heart size={15} /> Create
        </button>
        <button
          className={`${styles.tab} ${tab === "join" ? styles.active : ""}`}
          onClick={() => { setTab("join"); setError(""); }}
        >
          <LogIn size={15} /> Join
        </button>
        <button
          className={`${styles.tab} ${tab === "results" ? styles.active : ""}`}
          onClick={() => { setTab("results"); setError(""); }}
        >
          <Trophy size={15} /> Results
        </button>
      </div>

      {tab === "create" && (
        <form className={styles.form} onSubmit={handleCreate}>
          <p className={styles.formHint}>
            Answer 12 fun questions, then share a code with your partner to see
            how well they know you.
          </p>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
          />
          <button
            type="submit"
            className={styles.btn}
            disabled={!name.trim() || loading}
          >
            {loading ? "Creating..." : "Start Game"} <ArrowRight size={18} />
          </button>
        </form>
      )}

      {tab === "join" && (
        <form className={styles.form} onSubmit={handleJoin}>
          <p className={styles.formHint}>
            Got a code from your partner? Enter it below and predict their
            answers!
          </p>
          <input
            className={`${styles.input} ${styles.codeInput}`}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter game code"
            maxLength={6}
          />
          <input
            className={styles.input}
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            placeholder="Enter your name"
          />
          <button
            type="submit"
            className={styles.btn}
            disabled={!code.trim() || !joinName.trim() || loading}
          >
            {loading ? "Joining..." : "Join & Predict"} <ArrowRight size={18} />
          </button>
        </form>
      )}

      {tab === "results" && (
        <form className={styles.form} onSubmit={handleResults}>
          <p className={styles.formHint}>
            Already played? Enter your game code to see the results again.
          </p>
          <input
            className={`${styles.input} ${styles.codeInput}`}
            value={resultCode}
            onChange={(e) => setResultCode(e.target.value.toUpperCase())}
            placeholder="Enter game code"
            maxLength={6}
          />
          <button
            type="submit"
            className={styles.btn}
            disabled={!resultCode.trim()}
          >
            View Results <Trophy size={18} />
          </button>
        </form>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
