# Official marketplace release checklist

## Claude Code

This repository is a valid self-hosted Claude Code marketplace. Users can add it with:

```bash
claude plugin marketplace add stoicsatvik/mysql-bridge-mcp
claude plugin install mysql-bridge@mysql-bridge-marketplace
```

For Anthropic’s directory, submit this GitHub repository from `claude.ai/directory/manage` using a paid Claude plan. Before doing so, run `claude plugin validate --strict .` with the current Claude Code CLI and ensure the listing’s publisher information and support link are complete.

## ChatGPT Plugins Directory

The public ChatGPT path cannot use the local stdio server because every user needs a separate private MySQL connection. The production service must therefore provide:

1. A stable public HTTPS Streamable HTTP `/mcp` endpoint.
2. OAuth 2.1, with user-owned connection configuration stored server-side—not MySQL credentials sent through prompts or tool inputs.
3. An encrypted per-user secret store and a network design that can reach the user’s database only through an explicitly configured secure path.
4. A privacy policy, terms, support URL, production logo, and reviewer-safe demo database/account.
5. Domain verification at `/.well-known/openai-apps-challenge`, plus a verified OpenAI publisher identity and Apps Management write permission.

Once those are live, upload `chatgpt-app-submission.json` in the OpenAI plugin submission portal, scan the deployed tools, complete the review information, and submit. Approval and publication are performed by OpenAI.

## Do not submit until

- The hosted service never exposes passwords, connection strings, or unrestricted schema data.
- The reviewer demo account has no private data and no write permissions.
- The public legal and support URLs are live.
