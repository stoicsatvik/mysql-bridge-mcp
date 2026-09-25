import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import mysql, { type PoolOptions } from "mysql2/promise";
import { z } from "zod";

const required = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_PASSWORD"] as const;
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`);
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST, port: Number(process.env.MYSQL_PORT || 3306), user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD, database: process.env.MYSQL_DATABASE, connectionLimit: 4, namedPlaceholders: true,
} satisfies PoolOptions);
const readOnly = process.env.MYSQL_READ_ONLY !== "false";
const server = new McpServer({ name: "mysql-bridge", version: "0.1.0" });
const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

server.tool("list_tables", "List tables and views available in the configured database.", {}, async () => {
  const [rows] = await pool.query("SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME");
  return json(rows);
});
server.tool("describe_table", "Show columns, types, nullability, keys, and defaults for one table.", { table: z.string().min(1).max(128) }, async ({ table }) => {
  const [rows] = await pool.execute("SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION", [table]);
  return json(rows);
});
server.tool("query", "Run one SQL query. SELECT, SHOW, DESCRIBE, and EXPLAIN are allowed by default.", { sql: z.string().min(1).max(12000) }, async ({ sql }) => {
  const normalized = sql.trim().toUpperCase();
  if (sql.includes(";")) throw new Error("Only one statement is allowed.");
  if (readOnly && !["SELECT", "SHOW", "DESCRIBE", "EXPLAIN", "WITH"].some((verb) => normalized.startsWith(verb))) throw new Error("This server is read-only. Set MYSQL_READ_ONLY=false only for a trusted database role.");
  const [rows] = await pool.query(sql);
  return json(rows);
});
await server.connect(new StdioServerTransport());
