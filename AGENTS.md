# Fleet policy maintenance

This repository is the CI/security/maintenance source of truth for `fleet.json`.
Keep third-party Actions SHA-pinned. Keep Node audit at high including dev deps,
strict Python audits, license gates, checksum-verified secret scanning and
fail-closed check aggregation. Never turn a failed/skipped/missing run green. Owner-authorized security exceptions must be centralized, advisory/path/version scoped, time-limited and visible; audit errors and findings outside their exact scope must fail.

Keep deliverable logic in each starter's `.github/actions/validate/action.yml`.
Read-only validation jobs must not inherit publishing credentials. The fleet
report may write only this repository's single health issue, never consumer repos.

Run actionlint, tests/fleet-report.test.cjs and scripts/validate-fleet.py before
publishing policy changes. Do not touch independent products or CLI architecture.

Pin shared workflow and composite-action references to full commit SHAs, including internal calls. Dependabot opens weekly update PRs. Consumer references should point to a reviewed central commit; never use a moving branch in template CI.
