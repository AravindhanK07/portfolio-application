import "dotenv/config";
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
    ssl: process.env.DATABASE_URL?.includes("render.com")
      ? { rejectUnauthorized: false }
      : false,
  });
  await db.query("SELECT 1");
  console.log("Connected to PostgreSQL");

  // Auto-create and seed table if it doesn't exist
  const { rows } = await db.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables WHERE table_name = 'stock_details'
    )`
  );

  if (!rows[0].exists) {
    console.log("Creating stock_details table and seeding data...");
    await db.query(`
      CREATE TABLE stock_details (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        supplier VARCHAR(100) NOT NULL,
        warehouse_location VARCHAR(50) NOT NULL,
        last_restocked DATE NOT NULL,
        min_stock_level INT NOT NULL
      )
    `);
    await db.query(`
      INSERT INTO stock_details (product_name, category, quantity, unit_price, supplier, warehouse_location, last_restocked, min_stock_level) VALUES
        ('Laptop Dell XPS 15', 'Electronics', 45, 1299.99, 'Dell Technologies', 'Warehouse A', '2026-03-10', 10),
        ('iPhone 16 Pro', 'Electronics', 120, 999.00, 'Apple Inc', 'Warehouse A', '2026-03-15', 20),
        ('Samsung Galaxy S25', 'Electronics', 85, 899.00, 'Samsung Corp', 'Warehouse B', '2026-03-12', 15),
        ('Sony WH-1000XM5', 'Accessories', 200, 349.99, 'Sony Electronics', 'Warehouse A', '2026-02-28', 30),
        ('Logitech MX Master 3S', 'Accessories', 150, 99.99, 'Logitech', 'Warehouse C', '2026-03-05', 25),
        ('HP LaserJet Pro', 'Office Equipment', 30, 449.00, 'HP Inc', 'Warehouse B', '2026-01-20', 5),
        ('Canon EOS R6', 'Photography', 25, 2499.00, 'Canon Inc', 'Warehouse C', '2026-03-01', 5),
        ('iPad Air M2', 'Electronics', 60, 749.00, 'Apple Inc', 'Warehouse A', '2026-03-18', 10),
        ('Mechanical Keyboard K8', 'Accessories', 300, 79.99, 'Keychron', 'Warehouse C', '2026-03-08', 50),
        ('LG UltraWide Monitor', 'Electronics', 40, 599.99, 'LG Electronics', 'Warehouse B', '2026-02-15', 8),
        ('AirPods Pro 2', 'Accessories', 180, 249.00, 'Apple Inc', 'Warehouse A', '2026-03-14', 30),
        ('ThinkPad X1 Carbon', 'Electronics', 35, 1449.00, 'Lenovo', 'Warehouse B', '2026-03-02', 10),
        ('Epson Projector', 'Office Equipment', 15, 799.00, 'Epson', 'Warehouse C', '2026-01-10', 3),
        ('USB-C Hub 7-in-1', 'Accessories', 500, 39.99, 'Anker', 'Warehouse A', '2026-03-16', 100),
        ('Standing Desk Frame', 'Office Equipment', 20, 349.00, 'FlexiSpot', 'Warehouse B', '2026-02-20', 5)
    `);
    console.log("Table created and seeded with 15 rows");
  }
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
