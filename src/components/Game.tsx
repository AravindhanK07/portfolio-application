import { useState } from "react";
import { QUESTIONS } from "./questions";
import { Home } from "./Home";
import { ChatRound } from "./ChatRound";
import { ShareCode } from "./ShareCode";
import { Results } from "./Results";
import styles from "./Game.module.css";

export type Phase =
  | "home"
  | "player1"
  | "share"
  | "join"
  | "player2"
  | "results";

export interface GameData {
  code: string;
  player1Name: string;
  player2Name: string;
  player1Answers: Record<number, string>;
  player2Answers: Record<number, string>;
}

export function Game() {
  const [phase, setPhase] = useState<Phase>("home");
  const [data, setData] = useState<GameData>({
    code: "",
    player1Name: "",
    player2Name: "",
    player1Answers: {},
    player2Answers: {},
  });

  async function handleCreate(name: string) {
    const res = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: name }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    setData((prev) => ({ ...prev, code: json.code, player1Name: name }));
    setPhase("player1");
  }

  async function handlePlayer1Done(answers: Record<number, string>) {
    await fetch(`/api/game/${data.code}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    setData((prev) => ({ ...prev, player1Answers: answers }));
    setPhase("share");
  }

  async function handleJoin(code: string, name: string) {
    const res = await fetch(`/api/game/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: name }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    setData((prev) => ({
      ...prev,
      code,
      player2Name: name,
      player1Name: json.player1Name,
    }));
    setPhase("player2");
  }

  async function handlePlayer2Done(answers: Record<number, string>) {
    await fetch(`/api/game/${data.code}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    setData((prev) => ({ ...prev, player2Answers: answers }));

    // Fetch full game data for results
    const res = await fetch(`/api/game/${data.code}`);
    const json = await res.json();
    setData((prev) => ({
      ...prev,
      player1Answers: json.player1Answers,
      player2Answers: json.player2Answers,
      player1Name: json.player1Name,
      player2Name: json.player2Name,
    }));
    setPhase("results");
  }

  function handleViewResults(code: string) {
    fetch(`/api/game/${code}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        if (json.status !== "done") throw new Error("Game isn't finished yet!");
        setData({
          code,
          player1Name: json.player1Name,
          player2Name: json.player2Name,
          player1Answers: json.player1Answers,
          player2Answers: json.player2Answers,
        });
        setPhase("results");
      })
      .catch((err) => alert(err.message));
  }

  function handleRestart() {
    setData({
      code: "",
      player1Name: "",
      player2Name: "",
      player1Answers: {},
      player2Answers: {},
    });
    setPhase("home");
  }

  return (
    <div className={styles.container}>
      {phase === "home" && (
        <Home
          onCreate={handleCreate}
          onJoin={handleJoin}
          onViewResults={handleViewResults}
        />
      )}

      {phase === "player1" && (
        <ChatRound
          playerName={data.player1Name}
          questions={QUESTIONS}
          prompt="Answer honestly — let's see if your partner really knows you!"
          questionPrefix=""
          onDone={handlePlayer1Done}
        />
      )}

      {phase === "share" && (
        <ShareCode code={data.code} onDone={handleRestart} />
      )}

      {phase === "player2" && (
        <ChatRound
          playerName={data.player2Name}
          questions={QUESTIONS}
          prompt={`Predict what ${data.player1Name} chose for each question!`}
          questionPrefix={`What do you think ${data.player1Name} picked?`}
          onDone={handlePlayer2Done}
        />
      )}

      {phase === "results" && (
        <Results state={data} questions={QUESTIONS} onRestart={handleRestart} />
      )}
    </div>
  );
}
