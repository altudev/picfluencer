# Repository Guidelines

## Project Structure & Module Organization
The monorepo houses two apps. The Bun + Hono API lives in `backend-api`, with TypeScript in `src/`, Prisma schema files in `prisma/`, and generated client code in `src/generated/prisma`. The Expo client sits in `mobile`, keeping routes in `app/`, shared UI in `components/`, and configuration helpers in `hooks/` and `constants/`. Shared reference material is collected under `docs/`.

## Build, Test, and Development Commands
- `cd backend-api && bun install` syncs server dependencies.
- `cd backend-api && bun run dev` starts the Hono server with hot reload.
- `cd backend-api && bunx prisma migrate dev` applies schema updates and regenerates the client.
- `cd mobile && bun install` pulls Expo packages.
- `cd mobile && bunx expo start` launches the Expo bundler; append `--android`, `--ios`, or `--web` for a specific target.
- `cd mobile && bun run lint` enforces the mobile ESLint rules.

## Coding Style & Naming Conventions
TypeScript is standard. Match the two-space indentation and single quotes visible in the repo. Use `camelCase` for functions and variables, `PascalCase` for React components, and descriptive route segment directories (e.g., `app/(tabs)/profile.tsx`). Prefer function components with hooks, keep props typed, and only add brief inline comments when behavior is non-obvious. Run `bun run lint` in `mobile` before pushing; justify any rule suppressions inline.

## Testing Guidelines
Automated coverage is not yet wired up, so add tests alongside new code. For backend logic, create Bun-compatible specs in `backend-api/src/__tests__` using the `*.spec.ts` suffix. Expo components should rely on Jest (`jest-expo`) with tests in sibling `__tests__` folders. Whenever migrations alter data, run them locally, capture rollback steps if relevant, and document manual QA in the pull request.

## Commit & Pull Request Guidelines
Commit history follows Conventional Commits (`feat:`, `docs:`, `chore:`). Keep summaries imperative and add a scope when helpful (e.g., `feat(api): add profile route`). Pull requests need an intent paragraph, bullet list of highlights, linked issues, and screenshots for UI shifts. Call out schema or environment updates and state the lint/test status so reviewers can follow your validation.

## Environment & Configuration
Set `DATABASE_URL` in a local `.env` before running the API so Prisma can connect and generate the client. Never commit secrets; rely on ignored env files or your host’s secret manager. When adding new configuration flags, document defaults in `docs/` and include rollout notes in the pull request.
