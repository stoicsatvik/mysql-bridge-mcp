# MySQL Bridge

MySQL Bridge is a read-only MySQL MCP plugin for Claude Code and a submission-ready MCP package for ChatGPT’s Plugins Directory.

## Claude Code

Install directly from this repository’s marketplace:

```bash
claude plugin marketplace add stoicsatvik/mysql-bridge-mcp
claude plugin install mysql-bridge@mysql-bridge-marketplace
```

Claude Code then asks for a host, port, database, and a dedicated read-only MySQL account. The password is marked sensitive in the plugin manifest. The package includes its bundled server artifact, so users do not need to install project dependencies.

## Security model

- `list_tables` lists available tables and views.
- `describe_table` reads schema metadata.
- `query` only accepts one `SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`, or `WITH` statement.
- The server never executes writes, even if the connected database account is over-permissioned.

## ChatGPT Plugins Directory

`chatgpt-app-submission.json` provides the required app information, tool annotations, and five positive plus three negative review tests. ChatGPT public listing requires a production Streamable HTTP MCP endpoint with OAuth 2.1, a verified publisher, public privacy/terms/support URLs, and OpenAI approval. The current bundled server is a Claude Code local stdio plugin; it is intentionally not submitted as a fake public ChatGPT endpoint.

See [official submission notes](docs/official-submission.md) for the exact remaining requirements.

## Develop

```bash
npm install
npm run check
npm run build
npm run build:plugin
```
