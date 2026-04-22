# Security Policy

## Supported Versions

Starter Series repositories are project templates. Security fixes land on `main`; previous tags are not back-patched.

When you scaffold a project from a starter, **you are responsible for the security posture of your copy** — including dependency updates, secret management, and deployment hardening.

## Reporting a Vulnerability

If you discover a security vulnerability in any Starter Series repository, please **do not open a public issue**.

Instead:

1. Email **heznpc@gmail.com** with the subject `[security] <repo-name>: <short description>`.
2. Include:
   - Affected repository and commit/tag.
   - Reproduction steps or proof-of-concept.
   - Impact assessment (what an attacker could achieve).
   - Your suggested fix, if any.

You should receive an acknowledgment within **72 hours**. We aim to release a fix or mitigation within **14 days** of triage, depending on severity.

## Scope

In scope:

- Code in any `starter-series/*` repository (scaffolded templates, CI workflows, skill definitions).
- Published packages originating from these repos (npm, PyPI).

Out of scope:

- Vulnerabilities in third-party dependencies (report upstream).
- Vulnerabilities in user-customized scaffolds (you own your copy).
- Social engineering, physical attacks, or issues requiring privileged access to the maintainer's accounts.

## Safe Harbor

Good-faith security research conducted in accordance with this policy is authorized. We will not pursue legal action against researchers who:

- Make a reasonable effort to avoid privacy violations, data destruction, and service disruption.
- Report findings privately via the channel above.
- Give us reasonable time to remediate before public disclosure.

## Acknowledgments

Researchers who submit valid reports will be credited in the relevant release notes, unless they request anonymity.
