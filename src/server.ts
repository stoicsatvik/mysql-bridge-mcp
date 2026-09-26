import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import mysql, { type PoolOptions } from "mysql2/promise";
import { z } from "zod";
import { assertReadOnlyQuery } from "./sql.js";

const required = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_PASSWORD"] as const;
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`);

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST, port: Number(process.env.MYSQL_PORT || 3306), user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD, database: process.env.MYSQL_DATABASE, connectionLimit: 4, namedPlaceholders: true,
} satisfies PoolOptions);
const server = new McpServer({ name: "mysql-bridge", version: "0.2.0" });
const resultSchema = { result: z.string() };
const json = (value: unknown) => {
  const result = JSON.stringify(value, null, 2);
  return { content: [{ type: "text" as const, text: result }], structuredContent: { result } };
};
const readOnly = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };

server.registerTool("list_tables", {
  description: "Use this when you need to list tables and views in the configured MySQL database.", outputSchema: resultSchema, annotations: readOnly,
}, async () => {
  const [rows] = await pool.query("SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME");
  return json(rows);
});
server.registerTool("describe_table", {
  description: "Use this when you need the columns, types, keys, and defaults for one MySQL table.", inputSchema: { table: z.string().min(1).max(128) }, outputSchema: resultSchema, annotations: readOnly,
}, async ({ table }) => {
  const [rows] = await pool.execute("SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION", [table]);
  return json(rows);
});
server.registerTool("query", {
  description: "Use this when you need to run one read-only MySQL query. It accepts SELECT, SHOW, DESCRIBE, EXPLAIN, and WITH statements only.", inputSchema: { sql: z.string().min(1).max(12000) }, outputSchema: resultSchema, annotations: readOnly,
}, async ({ sql }) => {
  assertReadOnlyQuery(sql);
  const [rows] = await pool.query(sql);
  return json(rows);
});
await server.connect(new StdioServerTransport());
