# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Picfluencer** is an AI-powered content creation platform designed to help micro and nano influencers (1K-100K followers) streamline their content workflow. The platform provides AI-assisted tools across the full pipeline: ideation, scripting, captions, hashtags, thumbnails, and cross-platform repurposing for YouTube Shorts, TikTok, Instagram Reels, and X.

**Current Stage:** Early development (pre-alpha) - core infrastructure in place, features being built out.

**Repository Type:** Monorepo with two independent packages:
- `/mobile` - React Native + Expo cross-platform app (iOS, Android, Web)
- `/backend-api` - Hono.js API backend

## Common Development Commands

### Mobile App

```bash
cd mobile

# Install dependencies
bun install

# Start development server (interactive menu for iOS/Android/Web)
npm start

# Run on specific platform
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser

# Testing & Quality
npm run lint         # Run ESLint

# Reset project to blank state (moves starter code to app-example/)
npm run reset-project
```

### Backend API

```bash
cd backend-api

# Install dependencies
bun install

# Development with hot reload
bun run dev
# Runs on http://localhost:3000

# Production
bun run src/index.ts
```

### Single Test Execution

Currently **no testing infrastructure is in place**. When tests are added:
- Mobile: Use Jest + React Native Testing Library
- Backend: Use Bun's built-in test runner or Vitest

## Architecture

### Technology Stack

**Mobile (`/mobile`):**
- React Native 0.79.6 with New Architecture enabled
- Expo 53.0.22 (managed build platform)
- Expo Router (file-based routing, similar to Next.js)
- React Navigation + React Native Gesture Handler for navigation
- React Native Reanimated for animations
- TypeScript 5.8.3 (strict mode)
- Bun package manager
- ESLint (extends Expo config)

**Backend (`/backend-api`):**
- Hono 4.9.12 (ultra-lightweight web framework)
- Bun runtime and bundler
- TypeScript (strict mode)
- Better Auth integration (auth docs in `/docs/better-auth/`)

### Folder Structure

```
/picfluencer
├── mobile/                    # Cross-platform app
│   ├── app/                   # Expo Router screens (file-based routing)
│   │   ├── (tabs)/           # Tab navigation group
│   │   ├── _layout.tsx       # Root layout + theme provider
│   │   └── +not-found.tsx    # 404 handler
│   ├── components/           # UI components
│   │   ├── ui/              # Atomic UI primitives
│   │   └── [composite components]
│   ├── hooks/               # Custom React hooks
│   ├── constants/           # Global constants (Colors.ts for theming)
│   ├── assets/              # Images, fonts
│   ├── app.json            # Expo configuration
│   ├── tsconfig.json       # TypeScript config with @/* path alias
│   ├── eslint.config.js    # ESLint (flat config format)
│   └── package.json        # Dependencies
│
├── backend-api/             # Hono API
│   ├── src/
│   │   └── index.ts        # Main entry point
│   ├── tsconfig.json       # TypeScript config
│   └── package.json        # Dependencies
│
└── docs/                    # Documentation
    ├── picfluencer-prd.md  # Full product requirements
    └── better-auth/        # Authentication setup guides
```

### Key Patterns

**File Organization:**
- Platform-specific variants use suffixes: `.ios.tsx`, `.web.ts`, `.android.tsx`
- Import everything with `@/` prefix (path alias) for cleaner imports
- UI primitives go in `components/ui/`, composite components in `components/`

**Theme System:**
- Centralized colors in `constants/Colors.ts` with light/dark mode support
- `useThemeColor` hook for accessing theme colors
- Theme provider in root layout

**Routing:**
- Expo Router automatically maps file structure to routes
- Route groups (folders with parentheses) organize navigation without affecting URL
- Example: `app/(tabs)/index.tsx` → `/` (home screen in tabs)

### Data & State Management

**Current Status:** No state management library configured yet.

**Future Considerations:**
- Authentication state (Better Auth integration)
- Creator profile and preferences
- Generated content library
- User session management

**Backend Integration:**
- Better Auth will handle authentication endpoints at `/api/auth/*`
- CORS must be configured for mobile/web client requests
- Consider Hono RPC client or fetch wrapper for API calls

## Important Milestones & Features

See `/picfluencer/docs/picfluencer-prd.md` for complete PRD. Key phases:

**Phase 1 (v1):** Core onboarding and ideation
- User registration and profile setup
- AI-powered idea generation based on niche/voice
- Hook and angle suggestions
- Script outline generation

**Phase 2:** Content packaging
- Caption and hashtag generation
- Thumbnail generation suggestions
- Cross-platform formatting

**Phase 3:** Growth helpers
- Brand outreach tools
- Rate cards
- Analytics integration

## Key Files & Configuration

| File | Purpose |
|------|---------|
| `app.json` | Expo configuration (icon, splash, Android edge-to-edge, web bundler, plugins) |
| `tsconfig.json` | TypeScript strict mode, `@/*` path alias |
| `eslint.config.js` | Extends Expo ESLint config (flat format) |
| `.gitignore` | Comprehensive patterns for Node modules, build artifacts, env files, native builds |

## Build & Deployment

**Mobile:**
- Managed by Expo (handles build, signing, distribution)
- Web builds to `web-build/` directory
- Native iOS/Android builds generated via Expo Cloud or locally

**Backend:**
- Runs on Bun runtime
- Single entry point: `src/index.ts`
- Currently listening on `http://localhost:3000`
- Ready for deployment to any Node.js-compatible environment

## Package Management

**Package Manager:** Bun (replaces npm/yarn/pnpm)
- Lock file: `bun.lock` (per package)
- Install: `bun install`
- Add: `bun add <package>`
- Run scripts: `bun run <script>` or `npm run <script>`

## Code Quality Standards

- **TypeScript strict mode** in all packages—no `any` types
- **ESLint** for mobile (Expo config)
- Import/export using ES modules
- Platform-specific code only when necessary
- Components should be small, focused, and reusable

## Testing (Not Yet Implemented)

Plan to implement:
- **Mobile:** Jest + React Native Testing Library
- **Backend:** Bun test runner or Vitest
- **E2E:** Detox (React Native) or Playwright

## Authentication

Better Auth integration (see `/docs/better-auth/Hono.md`):
- Hono middleware for session validation
- CORS configuration required for mobile/web clients
- Support for multiple auth methods:
  - Anonymous auth
  - Email + magic link (referenced in PRD)
  - Google OAuth
  - Prisma database integration (not yet set up)

## When to Use Path Alias

Always use `@/` prefix in mobile app:
```typescript
// ✅ Do this
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

// ❌ Don't do this
import { ThemedText } from '../../../components/ThemedText';
```

## Monorepo Notes

Currently **no monorepo automation tools** (Turbo, Nx, etc.). Each package is independent:
- Separate `package.json`, `tsconfig.json`, `bun.lock`
- Different build/run commands per package
- Manual workspace coordination

Future optimization: Consider Turbo for shared build cache and parallel task execution.

## Quick Troubleshooting

- **Bun lock file conflicts:** Delete `bun.lock` and run `bun install`
- **Expo build issues:** Run `npm run reset-project` to create clean app directory
- **TypeScript errors:** Check `tsconfig.json` for strict mode settings
- **Port 3000 in use:** Backend won't start; kill process or change port in code
- **Module not found:** Verify `@/` alias path is correct in `tsconfig.json`
