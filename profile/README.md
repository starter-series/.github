# Starter Series

Production-ready starters for shipping software, with CI, security, release, and deployment paths pre-wired.

One fleet of 11 starters, organized by what you want to deploy.
Each repo is the source of truth for its current CI, release, and package status.

## Starters

| Starter | What it covers |
| --- | --- |
| **[docker-deploy-starter](https://github.com/starter-series/docker-deploy-starter)** | Containerized app baseline with deploy workflows |
| **[mcp-server-starter](https://github.com/starter-series/mcp-server-starter)** | TypeScript MCP server baseline |
| **[python-mcp-server-starter](https://github.com/starter-series/python-mcp-server-starter)** | Python MCP server baseline |
| **[npm-package-starter](https://github.com/starter-series/npm-package-starter)** | npm package baseline with trusted publishing workflows |
| **[browser-extension-starter](https://github.com/starter-series/browser-extension-starter)** | Browser extension baseline with store-release workflows |
| **[vscode-extension-starter](https://github.com/starter-series/vscode-extension-starter)** | Editor extension baseline with marketplace workflows |
| **[discord-bot-starter](https://github.com/starter-series/discord-bot-starter)** | Chat bot baseline with deploy workflows |
| **[telegram-bot-starter](https://github.com/starter-series/telegram-bot-starter)** | Chat bot baseline with polling and webhook modes |
| **[electron-app-starter](https://github.com/starter-series/electron-app-starter)** | Desktop app baseline with packaging workflows |
| **[react-native-starter](https://github.com/starter-series/react-native-starter)** | Mobile app baseline with app-store workflows |
| **[cloudflare-pages-starter](https://github.com/starter-series/cloudflare-pages-starter)** | Static site baseline with pages-deploy workflows |

## Quick start

```bash
gh repo create my-app --template starter-series/docker-deploy-starter --clone
cd my-app
```

## create-starter

Install or run the [`starter-series`](https://www.npmjs.com/package/starter-series) npm package (Node.js 22 or newer).

```bash
npx starter-series --help
# Inside an existing repository:
npx starter-series check
npx starter-series check --instructions
```

| Tool | What it does |
| --- | --- |
| **[create-starter](https://github.com/starter-series/create-starter)** | Scaffolds starters and audits existing repos for release, CD, security, and instruction checks |

## Receipts

Use repo-local evidence rather than profile-page claims:

- Check each repo's README, package manifest, and `.github/workflows/`
  directory for its current implementation surface.
- Check the [starter-series hub](https://github.com/starter-series/starter-series)
  for the broader health table and org-audit notes.
- This profile intentionally avoids version, publish, CI-pass, and KPI claims
  that can drift.
