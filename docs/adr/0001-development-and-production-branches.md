---
summary: 'Records the decision to use dev for integration and main for production releases.'
read_when:
  - You are changing the repository branch or release process.
  - You need to understand why production deploys from main.
title: 'ADR-0001: Development and Production Branches'
---

- Status: Accepted
- Date: 2026-10-17

## Context

The repository needs a repeatable path from feature work to the live site. Its
AIO configuration already uses `dev` as the base branch, while GitHub Pages
previously published the repository root from `dev`. The GitHub default branch
was `master`, and no remote `main` branch existed.

Publishing every integration merge directly to the custom domain leaves no
separate production promotion step. The branch model should keep integration
checks on `dev` and make production releases explicit.

## Decision

- Use `dev` as the integration branch and the base for feature pull requests.
- Use `main` as the production branch and the repository default branch.
- Promote reviewed releases from `dev` to `main` through a pull request.
- Publish the repository root to GitHub Pages from `main`.
- Run lint, typecheck, tests, and build checks for pull requests and pushes to
  both branches.
- Handle urgent fixes on branches from `main`, then merge the fix back into
  `dev` through a pull request.
- Keep `master` as a legacy reference only; do not target new work to it.

## Consequences

- Merges into `dev` no longer publish to the production domain.
- Each production release has a reviewable pull request and CI result.
- The one-time bootstrap copied the existing Pages source from `dev` to `main`,
  then moved the default branch and Pages source to `main` before new feature
  work was merged into `dev`.
- Feature pull requests continue to use `dev`, as configured in `aio-config.json`.

See [Branching and Releases](../branching-and-releases.md) for the operating steps.
