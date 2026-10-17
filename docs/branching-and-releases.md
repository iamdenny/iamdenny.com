---
summary: 'Explains how changes move from dev to main and how GitHub Pages deploys production.'
read_when:
  - You are opening a pull request for a site change.
  - You are preparing or deploying a production release.
title: 'Branching and Releases'
---

## Target branch roles

- **`dev`** — Integration branch for feature work. It is not the target
  production branch.
- **`main`** — Target production branch and GitHub Pages source (`/`) after the
  initial migration is complete.

Keep `aio-config.json`'s `base_branch` set to `dev` so new feature pull
requests target the integration branch. The legacy `master` branch is not a
destination for new work. Until the initial migration below is complete, the
repository default branch is `master` and GitHub Pages still publishes from
`dev`.

## Initial migration

The repository does not currently have a remote `main` branch. Establish the
target flow in this order:

1. Create `main` from the current `master` history so the target branch exists.
2. Open a release pull request from `dev` to `main`; review the full diff and
   wait for all CI checks to pass before merging.
3. Set the repository default branch to `main`.
4. Change GitHub Pages publishing to branch `main` and folder `/`.
5. Confirm that Pages completed a successful build from `main` and that
   `https://iamdenny.com/` serves the release.

## Feature work

1. Start a feature branch from the latest `origin/dev`.
2. Make and review the change on that branch.
3. Open a pull request from the feature branch to `dev`.
4. Wait for the `lint`, `typecheck`, `test`, and `build` checks to pass.
5. Merge the pull request into `dev`.

Do not push application changes directly to `dev` or `main`.

## Production release

1. Confirm that `dev` contains the changes intended for production.
2. Open a release pull request from `dev` to `main`.
3. Review the complete release diff and wait for all four CI checks to pass.
4. Merge the release pull request into `main`.
5. Confirm that GitHub Pages reports a successful build from `main` and that
   `https://iamdenny.com/` serves the release.

GitHub Pages uses the repository root as its publishing folder. Merging into
`dev` does not publish production; merging into `main` triggers the Pages build.

## Hotfixes

For an urgent production fix, branch from `main` and open a pull request back
to `main`. After it merges and deploys, open a follow-up pull request from
`main` to `dev` so both branches retain the fix.

## CI checks

GitHub Actions runs the same verification commands on pull requests and pushes
to `dev` and `main`:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The workflow checks each branch. GitHub Pages publishes production from `main`.
