import { useState } from "react";
import { QUESTIONS } from "./questions";
import { Setup } from "./Setup";
import { ChatRound } from "./ChatRound";
import { Handoff } from "./Handoff";
import { Results } from "./Results";
import styles from "./Game.module.css";

export type Phase = "setup" | "player1" | "handoff" | "player2" | "results";

export interface GameState {
  player1Name: string;
  player2Name: string;
  player1Answers: Record<number, string>;
  player2Answers: Record<number, string>;
}

const INITIAL_STATE: GameState = {
  player1Name: "",
  player2Name: "",
  player1Answers: {},
  player2Answers: {},
};

export function Game() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  function handleSetup(p1: string, p2: string) {
    setState({ ...INITIAL_STATE, player1Name: p1, player2Name: p2 });
    setPhase("player1");
  }

  function handlePlayer1Done(answers: Record<number, string>) {
    setState((prev) => ({ ...prev, player1Answers: answers }));
    setPhase("handoff");
  }

  function handleHandoffDone() {
    setPhase("player2");
  }

  function handlePlayer2Done(answers: Record<number, string>) {
    setState((prev) => ({ ...prev, player2Answers: answers }));
    setPhase("results");
  }

  function handleRestart() {
    setState(INITIAL_STATE);
    setPhase("setup");
  }

  return (
    <div className={styles.container}>
      {phase === "setup" && <Setup onStart={handleSetup} />}

      {phase === "player1" && (
        <ChatRound
          playerName={state.player1Name}
          questions={QUESTIONS}
          prompt="Answer honestly — let's see if your partner really knows you!"
          questionPrefix=""
          onDone={handlePlayer1Done}
        />
      )}

      {phase === "handoff" && (
        <Handoff
          player1Name={state.player1Name}
          player2Name={state.player2Name}
          onReady={handleHandoffDone}
        />
      )}

      {phase === "player2" && (
        <ChatRound
          playerName={state.player2Name}
          questions={QUESTIONS}
          prompt={`Predict what ${state.player1Name} chose for each question!`}
          questionPrefix={`What do you think ${state.player1Name} picked?`}
          onDone={handlePlayer2Done}
        />
      )}

      {phase === "results" && (
        <Results
          state={state}
          questions={QUESTIONS}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
