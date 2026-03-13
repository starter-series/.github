# Contributing

Thank you for your interest in contributing to Starter Series!

## Reporting Bugs

1. Check [existing issues](../../issues) to avoid duplicates
2. Open a new issue using the **Bug Report** template
3. Include steps to reproduce, expected behavior, and environment details

## Suggesting Features

1. Open an issue using the **Feature Request** template
2. Describe the problem you're trying to solve, not just the solution

## Submitting Changes

1. Fork the repository
2. Create a branch from `main` (`git checkout -b fix/your-fix`)
3. Make your changes
4. Ensure CI passes: `npm run lint && npm test`
5. Submit a pull request using the PR template

### Branch Naming

| Prefix | Purpose |
|--------|---------|
| `fix/` | Bug fixes |
| `feat/` | New features |
| `docs/` | Documentation |
| `chore/` | Maintenance |

### Commit Messages

Write concise messages that explain **why**, not just what.

```
fix: prevent race condition in webhook handler

The handler was not awaiting the async response,
causing intermittent 500 errors under load.
```

## Code Style

- Follow existing patterns in the codebase
- ESLint must pass with no warnings
- No unnecessary dependencies — keep starters lightweight

## CI Checks

Every PR automatically runs:

- **gitleaks** — secret detection
- **npm audit** — dependency vulnerability scanning
- **license-checker** — GPL/AGPL license blocking
- **ESLint** — code style
- **Tests** — unit/integration tests

All checks must pass before merge.

## Review Process

- All PRs require CI to pass
- Direct pushes to `main` are not allowed
- Maintainer review is required before merge
