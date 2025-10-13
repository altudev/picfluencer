# Repository Guidelines

## Project Structure & Module Organization
Picfluencer is a Bun-powered Turborepo. Source lives under `apps/` and `packages/`, and each workspace compiles from `src/` into `dist/` via `tsdown`.
- `apps/server`: Hono API entry (`apps/server/src/index.ts`) wiring oRPC, auth, and AI handlers; relies on `.env`.
- `apps/native`: Expo application (`apps/native/app/**`) with client helpers in `apps/native/utils`.
- `packages/api`: oRPC routers in `packages/api/src/routers` and context glue.
- `packages/auth`: Better-Auth configuration exported from `packages/auth/src`.
- `packages/db`: Prisma schema under `packages/db/prisma` plus data helpers in `packages/db/src`.
Reference material lives in `docs/` and `CLAUDE.md`; keep updates in sync.

## Build, Test, and Development Commands
Install dependencies with `bun install`. Core scripts are rooted at the monorepo:
- `bun dev`: Run server + native watchers through Turbo.
- `bun dev:server`, `bun dev:native`: Focused loops for backend or Expo.
- `bun build`: Compile every workspace with `tsdown`.
- `bun check-types`: Project-wide incremental `tsc`; run before pushing.
Database helpers proxy to `@picfluencer/db`: `bun db:push`, `bun db:migrate`, `bun db:generate`, `bun db:studio`. From `apps/native`, use `bun android | ios | web` for platform launches.

## Coding Style & Naming Conventions
Everything is TypeScript in ESM mode. Match existing formatting: tab indentation, trailing commas where valid, and imports grouped external → workspace → relative. Use `camelCase` for values/functions, `PascalCase` for components and classes, and `SCREAMING_SNAKE_CASE` for env constants. File names stay kebab-case (`todo.ts`, `index.ts`); routers, Prisma schemas, and utilities live in dedicated subfolders. Let your editor format via Bun/TypeScript tooling before committing.

## Testing Guidelines
A global test runner is not yet wired—minimum expectation is `bun check-types` plus manual verification in `bun dev`. New features should introduce Vitest specs runnable with `bun test`, colocated as `<feature>.test.ts` or inside `__tests__/`. Extend `turbo.json` so `test` participates in the pipeline, document fixtures, and include coverage notes in the PR whenever behavior is critical or regressions are likely.

## Commit & Pull Request Guidelines
Follow the concise, imperative style visible in history (`Add CLAUDE.md...`). Squash noisy WIP commits. PRs must outline the change, link issues or TODOs, attach screenshots/video for UI updates, and call out schema diffs when `packages/db` changes. List the commands executed (`bun build`, `bun db:push`, etc.) and update supporting docs (`CLAUDE.md`, `docs/`) when behavior shifts. Flag security-sensitive updates for review.

## Environment & Security
Keep secrets in untracked `.env` files (`apps/server/.env`, optional `.env.local`) and never commit them. Set `CORS_ORIGIN`, `DATABASE_URL`, and auth keys before running `bun dev:server`. After Prisma schema edits, run `bun db:migrate` (or `bun db:push` for prototypes) and inspect generated SQL before applying to shared environments.
