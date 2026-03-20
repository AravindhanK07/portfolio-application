import { Header } from "./components/Header";
import { Game } from "./components/Game";

export function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <main style={{ flex: 1, overflow: "hidden" }}>
        <Game />
      </main>
    </div>
  );
}
