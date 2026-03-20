import express from "express";
import pg from "pg";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "dist")));

// PostgreSQL
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

// Auto-create tables
async function initDB() {
  await db.query("SELECT 1");
  console.log("Connected to PostgreSQL");

  await db.query(`
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      code VARCHAR(6) UNIQUE NOT NULL,
      player1_name VARCHAR(50) NOT NULL,
      player2_name VARCHAR(50),
      player1_answers JSONB,
      player2_answers JSONB,
      status VARCHAR(20) DEFAULT 'waiting',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("Tables ready");
}

function generateCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
}

// Create a new game
app.post("/api/game", async (req, res) => {
  const { playerName } = req.body;
  if (!playerName?.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  let code;
  let attempts = 0;
  while (attempts < 10) {
    code = generateCode();
    try {
      await db.query(
        "INSERT INTO games (code, player1_name, status) VALUES ($1, $2, 'answering')",
        [code, playerName.trim()]
      );
      break;
    } catch (err) {
      if (err.code === "23505") {
        attempts++;
        continue;
      }
      throw err;
    }
  }

  res.json({ code });
});

// Player 1 submits answers
app.post("/api/game/:code/answers", async (req, res) => {
  const { code } = req.params;
  const { answers } = req.body;

  const { rowCount } = await db.query(
    "UPDATE games SET player1_answers = $1, status = 'waiting' WHERE code = $2 AND status = 'answering'",
    [JSON.stringify(answers), code.toUpperCase()]
  );

  if (rowCount === 0) {
    return res.status(404).json({ error: "Game not found or already answered" });
  }

  res.json({ success: true });
});

// Join a game (Player 2)
app.post("/api/game/:code/join", async (req, res) => {
  const { code } = req.params;
  const { playerName } = req.body;

  if (!playerName?.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  const { rows } = await db.query(
    "SELECT code, player1_name, status FROM games WHERE code = $1",
    [code.toUpperCase()]
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Game not found. Check your code!" });
  }

  const game = rows[0];

  if (game.status === "answering") {
    return res.status(400).json({ error: `${game.player1_name} hasn't finished answering yet. Try again in a bit!` });
  }

  if (game.status === "done") {
    return res.status(400).json({ error: "This game is already completed!" });
  }

  await db.query(
    "UPDATE games SET player2_name = $1, status = 'predicting' WHERE code = $2",
    [playerName.trim(), code.toUpperCase()]
  );

  res.json({ player1Name: game.player1_name });
});

// Player 2 submits predictions
app.post("/api/game/:code/predict", async (req, res) => {
  const { code } = req.params;
  const { answers } = req.body;

  const { rowCount } = await db.query(
    "UPDATE games SET player2_answers = $1, status = 'done' WHERE code = $2 AND status = 'predicting'",
    [JSON.stringify(answers), code.toUpperCase()]
  );

  if (rowCount === 0) {
    return res.status(404).json({ error: "Game not found or not ready for predictions" });
  }

  res.json({ success: true });
});

// Get game results
app.get("/api/game/:code", async (req, res) => {
  const { code } = req.params;

  const { rows } = await db.query(
    "SELECT * FROM games WHERE code = $1",
    [code.toUpperCase()]
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Game not found" });
  }

  const game = rows[0];
  res.json({
    code: game.code,
    player1Name: game.player1_name,
    player2Name: game.player2_name,
    player1Answers: game.player1_answers,
    player2Answers: game.player2_answers,
    status: game.status,
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Catch-all: serve frontend
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
