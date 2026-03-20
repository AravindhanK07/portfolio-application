import express from "express";
import pg from "pg";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// Serve built frontend in production
app.use(express.static(path.join(__dirname, "..", "dist")));

const HF_TOKEN = process.env.HF_TOKEN;

// PostgreSQL connection
let db;
async function initDB() {
  db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  });
  // Test connection
  await db.query("SELECT 1");
  console.log("Connected to PostgreSQL");
}

async function getTableSchema() {
  const { rows } = await db.query(
    `SELECT column_name, data_type, is_nullable,
       CASE WHEN pk.column_name IS NOT NULL THEN 'PRI' ELSE '' END AS column_key
     FROM information_schema.columns c
     LEFT JOIN (
       SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
       WHERE tc.table_name = 'stock_details' AND tc.constraint_type = 'PRIMARY KEY'
     ) pk ON c.column_name = pk.column_name
     WHERE c.table_name = 'stock_details'
     ORDER BY c.ordinal_position`
  );
  return rows
    .map(
      (c) =>
        `${c.column_name} (${c.data_type}${c.column_key === "PRI" ? ", PRIMARY KEY" : ""})`
    )
    .join(", ");
}

async function getSampleData() {
  const { rows } = await db.query("SELECT * FROM stock_details LIMIT 3");
  return JSON.stringify(rows, null, 2);
}

let systemPrompt = "";

async function buildSystemPrompt() {
  const schema = await getTableSchema();
  const sampleData = await getSampleData();

  systemPrompt = `You are a SQL assistant. You have access to a PostgreSQL database with a table called "stock_details".

Table schema:
${schema}

Sample data:
${sampleData}

Rules:
- When the user asks a question about the data, respond with ONLY a valid PostgreSQL query. No explanation, no markdown, no code blocks.
- If the user is greeting or asking a non-data question, respond normally as a helpful assistant.
- Never use DROP, DELETE, UPDATE, INSERT, ALTER, or any write operations. Only SELECT queries.
- Always use the table name "stock_details".
- For questions about "low stock" or "need restock", compare quantity with min_stock_level.`;
}

async function askAI(userMessage) {
  const { data } = await axios.post(
    "https://router.huggingface.co/v1/chat/completions",
    {
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.1,
    },
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data.choices[0].message.content.trim();
}

function isSQL(text) {
  return /^\s*(SELECT|WITH)\s/i.test(text);
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const aiResponse = await askAI(message);

    if (isSQL(aiResponse)) {
      const { rows } = await db.query(aiResponse);
      const results = Array.isArray(rows) ? rows : [rows];
      res.json({
        type: "query",
        sql: aiResponse,
        data: results,
        columns: results.length > 0 ? Object.keys(results[0]) : [],
      });
    } else {
      res.json({
        type: "text",
        content: aiResponse,
      });
    }
  } catch (err) {
    console.error("Chat error:", err.message);
    const errorMsg =
      err.response?.data?.error?.message || err.message || "Something went wrong";
    res.status(500).json({ error: errorMsg });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Catch-all: serve frontend for any non-API route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;

initDB()
  .then(() => buildSystemPrompt())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
