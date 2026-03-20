import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";

export function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <main style={{ flex: 1, overflow: "hidden" }}>
        <ChatWindow />
      </main>
    </div>
  );
}
