import { useState, useRef, useEffect } from "react";
import type { Question } from "./questions";
import { Bot, User } from "lucide-react";
import styles from "./ChatRound.module.css";

interface ChatRoundProps {
  playerName: string;
  questions: Question[];
  prompt: string;
  questionPrefix: string;
  onDone: (answers: Record<number, string>) => void;
}

interface ChatBubble {
  id: string;
  role: "bot" | "user";
  text: string;
}

export function ChatRound({
  playerName,
  questions,
  prompt,
  questionPrefix,
  onDone,
}: ChatRoundProps) {
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [currentQ, setCurrentQ] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showOptions, setShowOptions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showOptions]);

  // Start the conversation
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages([
        { id: "greet", role: "bot", text: `Hey ${playerName}! 👋` },
      ]);
    }, 400);

    const timer2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: "prompt", role: "bot", text: prompt },
      ]);
    }, 1200);

    const timer3 = setTimeout(() => {
      setCurrentQ(0);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [playerName, prompt]);

  // Show next question
  useEffect(() => {
    if (currentQ < 0 || currentQ >= questions.length) return;

    const q = questions[currentQ];
    const prefix = questionPrefix ? `${questionPrefix}\n\n` : "";
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `q-${q.id}`,
          role: "bot",
          text: `${prefix}**Q${currentQ + 1}/${questions.length}:** ${q.text}`,
        },
      ]);
      setShowOptions(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentQ, questions, questionPrefix]);

  function handleAnswer(questionId: number, answer: string) {
    setShowOptions(false);
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    setMessages((prev) => [
      ...prev,
      { id: `a-${questionId}`, role: "user", text: answer },
    ]);

    const nextQ = currentQ + 1;
    if (nextQ >= questions.length) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: "done", role: "bot", text: "All done! 🎉" },
        ]);
        setTimeout(() => onDone(newAnswers), 1200);
      }, 600);
    } else {
      setCurrentQ(nextQ);
    }
  }

  const currentQuestion = currentQ >= 0 && currentQ < questions.length ? questions[currentQ] : null;

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.bubble} ${msg.role === "bot" ? styles.bot : styles.user}`}
          >
            <div className={styles.avatar}>
              {msg.role === "bot" ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={styles.text}>
              {msg.text.split("\n\n").map((line, i) => (
                <p key={i}>{renderBold(line)}</p>
              ))}
            </div>
          </div>
        ))}

        {showOptions && currentQuestion && (
          <div className={styles.options}>
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                className={styles.optionBtn}
                onClick={() => handleAnswer(currentQuestion.id, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}
