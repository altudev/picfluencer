# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Picfluencer is an AI-powered app hub for micro/nano influencers (1K-100K followers) to streamline content creation workflows. Built with Better-T-Stack, it uses a monorepo architecture with TypeScript throughout.

**Key Features**: Onboarding & personalization, AI-powered idea/hook/script generation, caption & hashtag generation, cross-platform repurposing, content calendar, brand pitch generation, and analytics.

## Tech Stack

- **Runtime**: Bun 1.2.22
- **Monorepo**: Turborepo
- **Backend**: Hono (lightweight server framework)
- **API**: oRPC (end-to-end type-safe RPC with OpenAPI)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better-Auth with Expo plugin
- **Frontend**: React Native with Expo Router
- **Styling**: React Native Unistyles
- **AI**: Vercel AI SDK with Google Gemini 2.5 Flash
- **State Management**: TanStack Query (React Query)

## Monorepo Structure

```
picfluencer/
├── apps/
│   ├── native/          # React Native mobile app with Expo
│   └── server/          # Hono API server
└── packages/
    ├── api/             # oRPC router definitions & procedures
    ├── auth/            # Better-Auth configuration
    └── db/              # Prisma schema & client
```

### Package Dependencies

- `@picfluencer/db` → Prisma client (used by auth and api)
- `@picfluencer/auth` → Better-Auth setup (uses db, consumed by api and server)
- `@picfluencer/api` → oRPC routers (uses auth & db, consumed by server and native)
- `apps/server` → Hono server (uses api, auth, db)
- `apps/native` → Mobile app (uses api for type-safe client)

## Development Commands

**Setup**:
```bash
bun install                    # Install all dependencies
bun db:push                    # Push Prisma schema to database (first time setup)
```

**Development**:
```bash
bun dev                        # Run all apps (server + native)
bun dev:server                 # Run only the backend server (localhost:3000)
bun dev:native                 # Run only the mobile app (Expo)
```

**Database**:
```bash
bun db:push                    # Push schema changes (no migrations)
bun db:migrate                 # Create and run migrations
bun db:generate                # Generate Prisma client
bun db:studio                  # Open Prisma Studio UI
```

**Build & Type Checking**:
```bash
bun build                      # Build all apps
bun check-types                # Run TypeScript type checking
```

**Native App Specific**:
```bash
cd apps/native
bun android                    # Build and run on Android
bun ios                        # Build and run on iOS
bun web                        # Run web version
```

## Architecture Patterns

### oRPC API Pattern

The API layer uses oRPC for type-safe RPC calls. Key files:

- `packages/api/src/index.ts` - Defines base procedures (`publicProcedure`, `protectedProcedure`)
- `packages/api/src/context.ts` - Creates request context with auth session
- `packages/api/src/routers/index.ts` - Root router that combines all sub-routers
- `packages/api/src/routers/*.ts` - Individual feature routers

**Procedure pattern**:
```typescript
export const myRouter = {
  myEndpoint: protectedProcedure
    .input(z.object({ ... }))
    .handler(async ({ input, context }) => {
      // context.session.user is guaranteed to exist
      return result;
    })
};
```

### Server Request Flow

1. Request arrives at Hono app (`apps/server/src/index.ts`)
2. Context created with auth session (`createContext`)
3. Request handled by either:
   - `rpcHandler` at `/rpc/*` - For client RPC calls
   - `apiHandler` at `/api-reference/*` - For OpenAPI documentation
   - Direct Hono routes (e.g., `/ai` for AI streaming, `/api/auth/*` for auth)

### Client-Side Integration (Native)

- `apps/native/utils/orpc.ts` - Creates type-safe oRPC client
- Uses `@orpc/tanstack-query` for React Query integration
- Automatically includes auth cookies in requests
- Type inference from `AppRouterClient` ensures end-to-end type safety

**Usage in components**:
```typescript
import { orpc } from '@/utils/orpc';

const { data } = orpc.todo.getAll.useQuery();
const mutation = orpc.todo.create.useMutation();
```

### Authentication Flow

- Better-Auth handles sessions via secure HTTP-only cookies
- `packages/auth/src/index.ts` - Server-side auth config with Prisma adapter
- `apps/native/lib/auth-client.ts` - Client-side auth client for React Native
- Auth schema in `packages/db/prisma/schema/auth.prisma`
- Protected routes use `protectedProcedure` which validates session in middleware

### Database Schema

Prisma schemas are split across multiple files in `packages/db/prisma/schema/`:
- `schema.prisma` - Generator and datasource config
- `auth.prisma` - Better-Auth tables (User, Session, Account, Verification)
- `todo.prisma` - Example todo model
- Additional schemas for app features should follow this pattern

After schema changes, run `bun db:generate` and `bun db:push` or `bun db:migrate`.

### AI Integration

- AI endpoint at `/ai` in server (`apps/server/src/index.ts`)
- Uses Vercel AI SDK with Google Gemini 2.5 Flash
- Streams responses using `streamText` and `toUIMessageStreamResponse`
- Example usage in `apps/native/app/(drawer)/ai.tsx`

### Mobile App Routing

Uses Expo Router file-based routing:
- `app/_layout.tsx` - Root layout with auth protection
- `app/(drawer)/` - Drawer navigation structure
- `app/(drawer)/(tabs)/` - Tab navigation within drawer
- Route parameters and dynamic routes follow Expo Router conventions

## Environment Variables

Create `apps/server/.env` based on `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/picfluencer
BETTER_AUTH_SECRET=<generate-random-secret>
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=<your-frontend-origin>
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-api-key>
```

For the native app, set in `apps/native/.env`:
```env
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

## Key Implementation Notes

1. **Workspace Dependencies**: Uses `workspace:*` protocol for internal packages. Changes in packages automatically reflect in consuming apps during dev.

2. **Type Safety**: The stack provides end-to-end type safety from database schema → API routes → client queries. Always leverage TypeScript inference.

3. **Prisma Client Generation**: Generated client is in `packages/db/prisma/generated/`. Import from `@picfluencer/db` in other packages.

4. **oRPC vs REST**: This project uses RPC-style APIs (single `/rpc` endpoint) rather than REST. OpenAPI docs are available at `/api-reference`.

5. **Mobile Platform**: The native app targets iOS, Android, and Web through Expo. Test on all platforms when making UI changes.

6. **Monorepo Builds**: Turborepo caches builds. Use `turbo -F <package>` to filter commands to specific packages.

7. **AI Streaming**: The `/ai` endpoint streams responses. Ensure client handles streaming properly with `useChat` or similar hooks.

## Product Context

Refer to `docs/picfluencer-prd.md` for:
- Feature requirements and milestones
- User stories and success metrics
- Launch timeline and rollout strategy
- Target users (micro/nano influencers 1K-100K followers)
