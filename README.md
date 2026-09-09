# Starter Series fleet operations

This repository owns common CI, security and weekly maintenance policy for the
11 distribution targets in [fleet.json](fleet.json). Change shared policy here,
not in each starter. `create-starter` can consume the versioned JSON inventory.

| Execution family | Reusable workflow | Targets |
|---|---|---|
| Node (app, extension, Electron, Expo profiles) | `reusable-node-ci.yml` | cloudflare-pages, discord-bot, telegram-bot, mcp-server, browser-extension, vscode-extension, electron-app, react-native starters |
| Node package (22 + 24 matrix) | `reusable-node-ci.yml` | npm-package-starter |
| Python package (3.11–3.13) | `reusable-python-ci.yml` | python-mcp-server-starter |
| Docker | `reusable-container-ci.yml` | docker-deploy-starter |

Each starter keeps `.github/actions/validate/action.yml` for its actual lint,
test, package, store, MCP, Expo or container checks. `ci.yml` is a reusable caller
plus a fail-closed `ci` result for existing branch protection. Release workflows
can still call that file. No publishing credentials are inherited.

Shared policy:

- `reusable-security.yml`: full-history checksum-verified Gitleaks and file limits.
- `actions/setup-node`: Node 22 default, pinned action, `npm ci --ignore-scripts`.
- `actions/setup-python`: pinned setup; supported Python versions are in the Python workflow.
- `actions/node-security`: `npm audit --audit-level=high` including dev dependencies;
  installed-tree license check plus the stricter lockfile license check.
- Python dependency audit remains `pip-audit . --strict` on every supported runtime.
- `reusable-codeql.yml`: JavaScript/TypeScript or Python plus workflow analysis.
  Runs on each starter push/PR (or manual dispatch), with repository-local uploads.
- `reusable-dependency-review.yml`: preserves Telegram's PR dependency gate.
- `actions/image-security`: preserves the existing CRITICAL, fix-available Trivy gate.

Third-party Actions are SHA-pinned in this repository. Fleet callers track this
repository's reviewed `main`, so a shared policy fix requires **one repository**.
This is an explicit trust relationship: protect central `main` and review all
workflow/action changes. Generated projects outside this fleet may pin a reviewed
central commit instead and manage their own upgrades and maintenance schedule.
Release/store-specific Actions and credentials remain local in this migration.

## Maintenance

[Run Fleet maintenance](https://github.com/starter-series/.github/actions/workflows/fleet-maintenance.yml)
executes fresh common security and dependency checks against each starter's `main` weekly.
Deliverable health comes from the latest push CI for the current main commit.
Jobs have read-only tokens; only the separate report job can edit issues in this
repository. No PAT, GitHub App, cross-repository writes or automated remediation.

One `Fleet maintenance health` issue is created/reopened on failure and closed
when fresh audits and the latest current-main CI all pass. Unchanged failure signatures do not update it or add
comments. Every run gets a summary with per-starter jobs and latest push-CI links.
Until wrappers merge, fresh audits still work against existing default branches.
Missing, skipped, cancelled or pending required checks never count as healthy.
Existing per-repo maintenance issues are historical evidence, not auto-closed by
migration. Per-repo scheduled maintenance and issue generators are removed;
manual maintenance remains. CodeQL is event-driven, not uploaded centrally.

## Validation

```sh
actionlint .github/workflows/*.yml
node --test tests/*.test.cjs
python3 scripts/validate-fleet.py --root ../
```

The last command checks all 11 local wrappers, local extensions, central call
paths and policy boundaries. It reads only manifest-listed targets. Security
failures remain failures; this migration does not update vulnerable dependencies
or lower audit thresholds.
