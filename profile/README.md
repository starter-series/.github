# Starter Series

Starter templates, verification tooling, and launch/presence utilities for
small software products.
Each repo is the source of truth for its current CI, release, and package status.

## First Commands

Already have a repo? Run the dry-run check inside that repo:

```bash
cd path/to/your/repo
npx @starter-series/create add-component
```

Starting from a starter instead?

```bash
gh repo create my-app --template starter-series/docker-deploy-starter
```

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

## Tooling

| Tool | What it does |
| --- | --- |
| **[create-starter](https://github.com/starter-series/create-starter)** | Scaffolds starters and audits existing repos for release, CD, and security wiring |
| **[shotkit](https://github.com/starter-series/shotkit)** | Captures store and social assets from built browser extensions |

## Launch & Presence

| Tool | What it does |
| --- | --- |
| **[ProfileKit](https://github.com/starter-series/ProfileKit)** | Builds composable SVG cards for profiles, READMEs, dev blogs, and personal sites |
| **[profilekit-mcp](https://github.com/starter-series/profilekit-mcp)** | Renders ProfileKit cards through an MCP stdio surface |

## Receipts

Use repo-local evidence rather than profile-page claims:

- Check each repo's README, package manifest, and `.github/workflows/`
  directory for its current implementation surface.
- Check the [starter-series hub](https://github.com/starter-series/starter-series)
  for the broader health table and org-audit notes.
- This profile intentionally avoids version, publish, CI-pass, and KPI claims
  that can drift.
