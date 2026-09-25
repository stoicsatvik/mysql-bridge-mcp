# MySQL Bridge

An MCP server with a focused control-plane UI for connecting MySQL to Claude Code and other MCP-compatible clients.

## What it does

- Lists tables and views in the configured database
- Describes a table’s schema
- Runs one SQL statement at a time
- Starts in read-only mode: `SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`, and CTE queries only

## Quick start

```bash
npm install
cp .env.example .env
npm run build
```

Add the built server to Claude Code:

```bash
claude mcp add --transport stdio mysql-bridge -- node /absolute/path/to/mysql-bridge-mcp/dist/server.js
```

Alternatively, copy and fill in [`.mcp.json`](.mcp.json) in your project. Keep credentials in the MCP client’s environment configuration; never commit `.env`.

## UI

Open `app/index.html` in a browser for the product interface. It intentionally has no backend or credential form: the server is configured through local environment variables.

## ChatGPT-compatible clients

This server implements the MCP tool contract. A remote MCP deployment requires an HTTP transport and the authentication model expected by the host. The present package provides the secure local stdio base, which is the appropriate default for direct database credentials.

## Safety

Create a dedicated MySQL account with the minimum permissions required. `MYSQL_READ_ONLY=true` is the default. Setting it to `false` permits one non-read statement at a time, so only do that with a tightly scoped database role.
