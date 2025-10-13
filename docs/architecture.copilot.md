# Picfluencer - Comprehensive Architecture Analysis

**Generated:** 2025-10-13  
**Version:** 1.0.0  
**Stack:** Turborepo + Hono + Expo (React Native) + Better Auth + oRPC + Prisma

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Structure and Monorepo Overview](#1-project-structure-and-monorepo-overview)
3. [Backend API Architecture (Hono.js)](#2-backend-api-architecture-honojs)
4. [Frontend Application (React Native Expo)](#3-frontend-application-react-native-expo)
5. [AI Integration Layer](#4-ai-integration-layer-end-to-end-flow)
6. [ORM and Data Layer Analysis](#5-orm-and-data-layer-analysis)
7. [Authentication & Authorization](#6-authentication--authorization-better-auth)
8. [Real-Time Communication](#7-real-time-communication--notifications)
9. [Security and Best Practices](#8-security-and-best-practices)
10. [API Reference Tables](#9-api-reference-tables)
11. [Architecture Diagrams](#10-architecture-diagrams)
12. [Development Workflow](#11-development-workflow)

---

## Executive Summary

**Picfluencer** is an AI-powered mobile application designed for micro and nano influencers (1K-100K followers) to streamline their content creation workflows. The application is built as a **full-stack TypeScript monorepo** using modern technologies:

**Core Technologies:**
- **Runtime:** Bun 1.2.22
- **Monorepo Management:** Turborepo 2.5.4
- **Backend Framework:** Hono.js (lightweight, edge-ready web framework)
- **API Layer:** oRPC (end-to-end type-safe RPC with OpenAPI support)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better Auth with Expo plugin
- **Mobile Framework:** React Native 0.81.4 with Expo 54
- **Navigation:** Expo Router 6.0 (file-based routing)
- **Styling:** React Native Unistyles 3.0
- **AI Integration:** Vercel AI SDK with Google Gemini 2.5 Flash
- **State Management:** TanStack Query (React Query) 5.85

**Architecture Highlights:**
- Type-safe end-to-end communication between client and server via oRPC
- Shared packages for database, authentication, and API definitions
- Modular, scalable monorepo structure with clear separation of concerns
- Secure authentication flow with JWT tokens stored in Expo SecureStore
- Streaming AI responses using Vercel AI SDK
- Mobile-first design with cross-platform support (iOS, Android, Web)

---

## 1. Project Structure and Monorepo Overview

### 1.1 Monorepo Package Detection

The Picfluencer project follows a standard Turborepo monorepo structure with applications and shared packages:

```
picfluencer/
├── apps/
│   ├── native/          # React Native mobile app (Expo)
│   └── server/          # Hono.js API server
├── packages/
│   ├── api/             # oRPC router definitions & procedures
│   ├── auth/            # Better Auth configuration
│   └── db/              # Prisma schema & client
├── docs/                # Documentation
├── turbo.json           # Turborepo configuration
├── package.json         # Root workspace configuration
├── tsconfig.base.json   # Shared TypeScript config
└── bunfig.toml          # Bun configuration
```

#### Applications

**1. `apps/server` - Backend API Server**
- **Purpose:** Hono.js-based HTTP server providing RESTful APIs, RPC endpoints, and AI streaming
- **Port:** 3000 (default)
- **Entry Point:** `src/index.ts`
- **Dependencies:** 
  - `@picfluencer/api` (workspace)
  - `@picfluencer/auth` (workspace)
  - `@picfluencer/db` (workspace)
  - `hono`, `@orpc/server`, `@orpc/openapi`, `ai`, `@ai-sdk/google`

**2. `apps/native` - Mobile Application**
- **Purpose:** Cross-platform React Native mobile app (iOS, Android, Web)
- **Framework:** Expo 54 with Expo Router
- **Entry Point:** `index.js`
- **Dependencies:**
  - `@picfluencer/api` (workspace)
  - `expo`, `expo-router`, `react-native`, `@orpc/tanstack-query`, `better-auth`, `@better-auth/expo`

#### Shared Packages

**1. `packages/db` - Database Layer**
- **Purpose:** Prisma ORM setup, schema definitions, and database client
- **Exports:** Prisma client instance and types
- **Schema Location:** `prisma/schema/`
- **Generated Client:** `prisma/generated/client`
- **Scripts:** `db:push`, `db:migrate`, `db:generate`, `db:studio`

**2. `packages/auth` - Authentication Layer**
- **Purpose:** Better Auth server and client configuration
- **Exports:** `auth` instance with Prisma adapter and Expo plugin
- **Dependencies:** `better-auth`, `@better-auth/expo`, `@picfluencer/db`
- **Features:** Email/password auth, session management, Expo-specific handling

**3. `packages/api` - API Layer**
- **Purpose:** oRPC router definitions, procedures, context, and type exports
- **Exports:** `appRouter`, `AppRouter` type, `AppRouterClient` type
- **Key Files:**
  - `src/index.ts` - Base procedures (public/protected)
  - `src/context.ts` - Request context creation
  - `src/routers/index.ts` - Root router
  - `src/routers/*.ts` - Feature-specific routers

### 1.2 Dependency Mapping

```mermaid
graph TD
    A[apps/server] --> B[@picfluencer/api]
    A --> C[@picfluencer/auth]
    A --> D[@picfluencer/db]
    
    E[apps/native] --> B
    
    B --> C
    B --> D
    C --> D
    
    style A fill:#ff6b6b
    style E fill:#4ecdc4
    style B fill:#95e1d3
    style C fill:#f38181
    style D fill:#aa96da
```

**Dependency Flow:**
1. **`@picfluencer/db`** (no dependencies) - Foundation layer
2. **`@picfluencer/auth`** depends on `db` - Authentication layer
3. **`@picfluencer/api`** depends on `auth` and `db` - Business logic layer
4. **`apps/server`** depends on `api`, `auth`, `db` - Server runtime
5. **`apps/native`** depends on `api` - Client application

**Key Principles:**
- Unidirectional dependency flow (no circular dependencies)
- Mobile app never directly accesses database
- All business logic centralized in `api` package
- Type safety maintained end-to-end through shared packages

### 1.3 Turborepo Configuration

The `turbo.json` file defines the build pipeline and task orchestration:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:push": {
      "cache": false,
      "persistent": true
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    },
    "db:migrate": {
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Task Characteristics:**
- **`build`**: Caches outputs, depends on building dependencies first (`^build`)
- **`dev`**: No caching, persistent (keeps running)
- **`db:*`**: No caching (database operations)
- **TUI Mode**: Terminal UI enabled for better visualization

**Pipeline Execution:**
```bash
bun dev              # Runs all dev tasks in parallel (server + native)
bun build            # Builds packages first, then apps
bun check-types      # Type-checks all packages/apps
bun db:push          # Pushes Prisma schema to database
```

### 1.4 Workspace Configuration

The root `package.json` uses Bun workspaces with a catalog feature for dependency management:

```json
{
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "catalog": {
      "hono": "^4.8.2",
      "@orpc/server": "^1.9.0",
      "better-auth": "^1.3.13",
      "ai": "^5.0.49",
      "zod": "^4.1.11",
      "@prisma/client": "^6.15.0"
    }
  }
}
```

**Workspace Advantages:**
- **Hoisting:** Common dependencies installed once at root
- **Catalog:** Ensures version consistency across packages
- **Workspace Protocol:** `workspace:*` links to local packages
- **Fast Installs:** Bun's native workspace support

### 1.5 TypeScript Configuration

**Base Configuration (`tsconfig.base.json`):**
- Shared compiler options for all packages
- Path aliases configured for clean imports
- Strict mode enabled for type safety

**Per-Package Configs:**
Each package/app extends the base config with specific settings:
- `moduleResolution: "bundler"` for Bun compatibility
- `esModuleInterop: true` for better module imports
- `skipLibCheck: true` for faster builds

### 1.6 Build and Development Tools

**tsdown** (TypeScript bundler):
- Used by all packages for building
- Generates both ESM and type definitions
- Fast builds with Bun runtime

**Bun Runtime:**
- Native TypeScript support
- Fast package manager
- Hot module reloading for development

---

## 2. Backend API Architecture (Hono.js)

### 2.1 Server Overview

The backend server (`apps/server/src/index.ts`) is built with **Hono.js**, a lightweight, fast web framework designed for edge runtimes but works perfectly with Bun.

**Server Initialization:**
```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use("/*", cors({
  origin: process.env.CORS_ORIGIN || "",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
```

**Key Features:**
- **Middleware Chain:** Logger → CORS → Auth → Request handling
- **CORS Configuration:** Allows mobile app origin with credentials
- **Lightweight:** No unnecessary abstractions, fast startup

### 2.2 Request Routing Architecture

The server uses a multi-handler approach:

```typescript
// 1. Better Auth Handler (handles /api/auth/*)
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// 2. oRPC Handlers (handles /rpc/* and /api-reference/*)
app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });
  
  // Try RPC handler first
  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });
  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }
  
  // Try OpenAPI handler
  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api-reference",
    context: context,
  });
  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }
  
  await next();
});

// 3. AI Streaming Handler
app.post("/ai", async (c) => {
  const body = await c.req.json();
  const uiMessages = body.messages || [];
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(uiMessages),
  });
  return result.toUIMessageStreamResponse();
});

// 4. Health Check
app.get("/", (c) => c.text("OK"));
```

**Request Flow:**
1. Request arrives at Hono app
2. Logger middleware logs request
3. CORS middleware validates origin
4. If path matches `/api/auth/*`, Better Auth handles it
5. Otherwise, context is created with session data
6. oRPC handlers try to match the request
7. If no match, regular Hono routes handle it
8. AI endpoint handles streaming responses separately

### 2.3 REST API Endpoints

#### 2.3.1 Authentication Endpoints

Handled by **Better Auth** at `/api/auth/*`:

| Endpoint | Method | Description | Auth Required | Request Body | Response |
|----------|--------|-------------|---------------|--------------|----------|
| `/api/auth/sign-up/email` | POST | Register new user | No | `{ email, password, name }` | `{ user, session }` |
| `/api/auth/sign-in/email` | POST | Login with email | No | `{ email, password }` | `{ user, session }` |
| `/api/auth/sign-out` | POST | Logout user | Yes | - | `{ success: true }` |
| `/api/auth/session` | GET | Get current session | Yes | - | `{ user, session }` |
| `/api/auth/refresh` | POST | Refresh session token | Yes | - | `{ session }` |

**Authentication Flow:**
- Client sends credentials to sign-in endpoint
- Server validates and creates session
- JWT token returned in response headers
- Client stores token in SecureStore
- Token included in subsequent requests via Cookie header

#### 2.3.2 oRPC Endpoints

Accessed via `/rpc/{router}.{procedure}`:

| Endpoint | Method | Description | Auth Required | Input | Output |
|----------|--------|-------------|---------------|-------|--------|
| `/rpc/healthCheck` | POST | Server health check | No | - | `"OK"` |
| `/rpc/privateData` | POST | Protected data example | Yes | - | `{ message, user }` |
| `/rpc/todo.getAll` | POST | Get all todos | No | - | `Todo[]` |
| `/rpc/todo.create` | POST | Create new todo | No | `{ text }` | `Todo` |
| `/rpc/todo.toggle` | POST | Toggle todo completion | No | `{ id, completed }` | `Todo` |
| `/rpc/todo.delete` | POST | Delete todo | No | `{ id }` | `Todo` |

**Note:** All oRPC endpoints use POST method regardless of operation type. This is an RPC pattern where the operation is determined by the router/procedure name.

#### 2.3.3 AI Streaming Endpoint

| Endpoint | Method | Description | Auth Required | Request Body | Response |
|----------|--------|-------------|---------------|--------------|----------|
| `/ai` | POST | Stream AI chat responses | No | `{ messages: UIMessage[] }` | Stream (text/event-stream) |

**AI Streaming Details:**
- Uses Vercel AI SDK's `streamText` function
- Model: Google Gemini 2.5 Flash
- Response format: UI Message Stream (compatible with `useChat` hook)
- Streams token-by-token for real-time updates

#### 2.3.4 OpenAPI Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api-reference/*` | GET | Interactive OpenAPI documentation |

**OpenAPI Features:**
- Auto-generated from oRPC router definitions
- Zod schemas converted to JSON Schema
- Interactive API explorer
- Type-safe contract documentation

### 2.4 oRPC Procedures and Middleware

#### 2.4.1 Base Procedures

Located in `packages/api/src/index.ts`:

```typescript
import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

// Public procedure (no auth required)
export const publicProcedure = o;

// Auth middleware
const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

// Protected procedure (auth required)
export const protectedProcedure = publicProcedure.use(requireAuth);
```

**Procedure Types:**
- **`publicProcedure`**: No authentication required
- **`protectedProcedure`**: Requires valid session, throws UNAUTHORIZED if not authenticated

#### 2.4.2 Context Creation

Located in `packages/api/src/context.ts`:

```typescript
import type { Context as HonoContext } from "hono";
import { auth } from "@picfluencer/auth";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

**Context Contents:**
- `session`: Current user session (or null if not authenticated)
- Session includes: `user` object, `session` metadata, `expiresAt` timestamp

#### 2.4.3 Router Structure

Located in `packages/api/src/routers/`:

**Root Router (`index.ts`):**
```typescript
import { todoRouter } from "./todo";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: "This is private",
    user: context.session?.user,
  })),
  todo: todoRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
```

**Todo Router (`todo.ts`):**
```typescript
import z from "zod";
import prisma from "@picfluencer/db";
import { publicProcedure } from "../index";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    return await prisma.todo.findMany({
      orderBy: { id: "asc" },
    });
  }),
  
  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      return await prisma.todo.create({
        data: { text: input.text },
      });
    }),
  
  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      return await prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }),
  
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await prisma.todo.delete({
        where: { id: input.id },
      });
    }),
};
```

### 2.5 Request/Response Validation

**Input Validation:**
- Uses **Zod** schemas for runtime type validation
- Defined inline with `.input()` method
- Automatic validation before handler execution
- Type inference for TypeScript

**Response Validation:**
- Inferred from return type of handler
- Automatically typed on client side
- No explicit output schema needed (TypeScript inference)

**Error Handling:**
- `ORPCError` for structured errors
- HTTP status codes mapped automatically
- Error messages preserved in response

### 2.6 Middleware Chain

**Global Middleware (Hono):**
1. **Logger**: Logs all incoming requests
2. **CORS**: Validates origin and sets headers
3. **Context Creation**: Extracts session from headers

**Procedure Middleware (oRPC):**
1. **Auth Middleware**: Validates session for protected procedures
2. **Input Validation**: Validates input against Zod schema
3. **Error Handling**: Catches and formats errors

### 2.7 Environment Variables

Located in `apps/server/.env`:

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/picfluencer` |
| `BETTER_AUTH_SECRET` | JWT signing secret | Yes | `<random-secret>` |
| `BETTER_AUTH_URL` | Auth service URL | Yes | `http://localhost:3000` |
| `CORS_ORIGIN` | Allowed CORS origin | Yes | `http://localhost:8081` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | Yes | `<api-key>` |

**Security Notes:**
- All secrets loaded via `dotenv` at runtime
- Never committed to version control
- `.env.example` provides template


---

## 3. Frontend Application (React Native Expo)

### 3.1 Expo Router Navigation Structure

The mobile app uses **Expo Router** for file-based routing with a drawer + tabs navigation pattern.

**Directory Structure:**
```
apps/native/app/
├── _layout.tsx              # Root layout (Stack navigator)
├── modal.tsx                # Modal screen
├── +not-found.tsx           # 404 screen
└── (drawer)/                # Drawer navigator group
    ├── _layout.tsx          # Drawer configuration
    ├── index.tsx            # Home screen (auth demo)
    ├── todos.tsx            # Todos screen
    ├── ai.tsx               # AI chat screen
    └── (tabs)/              # Tab navigator group
        ├── _layout.tsx      # Tab configuration
        ├── index.tsx        # Tab 1
        └── two.tsx          # Tab 2
```

**Navigation Hierarchy:**
```
Stack (Root)
  ├── Drawer
  │   ├── Home (index)
  │   ├── Tabs
  │   │   ├── Tab One
  │   │   └── Tab Two
  │   ├── Todos
  │   └── AI Chat
  └── Modal (presentation modal)
```

#### 3.1.1 Root Layout (`_layout.tsx`)

```typescript
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
```

**Features:**
- React Query provider for data fetching
- Gesture handler for drawer/swipe gestures
- Stack navigator for screen transitions
- Modal presentation for popup screens

#### 3.1.2 Drawer Layout (`(drawer)/_layout.tsx`)

```typescript
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ headerTitle: "Home" }} />
      <Drawer.Screen name="(tabs)" options={{ headerTitle: "Tabs" }} />
      <Drawer.Screen name="todos" options={{ headerTitle: "Todos" }} />
      <Drawer.Screen name="ai" options={{ headerTitle: "AI" }} />
    </Drawer>
  );
};
```

**Features:**
- Side drawer navigation
- Icon indicators for each screen
- Theme-aware styling
- Header customization

### 3.2 Authentication Flow

#### 3.2.1 Better Auth Client Setup

Located in `apps/native/lib/auth-client.ts`:

```typescript
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme: "mybettertapp",
      storagePrefix: "picfluencer",
      storage: SecureStore,
    }),
  ],
});
```

**Configuration:**
- **Base URL**: Server endpoint from environment variable
- **Deep Link Scheme**: `mybettertapp://` for OAuth callbacks
- **Storage**: Expo SecureStore for token security
- **Prefix**: `picfluencer` to namespace storage keys

#### 3.2.2 Sign In Flow

Located in `apps/native/components/sign-in.tsx`:

```typescript
const { data: session } = authClient.useSession();

const handleSignIn = async () => {
  await authClient.signIn.email({
    email: email,
    password: password,
  });
  queryClient.invalidateQueries();
};
```

**Process:**
1. User enters email and password
2. Client calls `authClient.signIn.email()`
3. Request sent to `/api/auth/sign-in/email`
4. Server validates credentials
5. JWT token returned in response
6. Token stored in SecureStore automatically
7. Session state updated via `useSession` hook
8. UI re-renders with authenticated state

#### 3.2.3 Sign Up Flow

Located in `apps/native/components/sign-up.tsx`:

```typescript
const handleSignUp = async () => {
  await authClient.signUp.email({
    email: email,
    password: password,
    name: name,
  });
  queryClient.invalidateQueries();
};
```

**Process:**
1. User enters name, email, password
2. Client calls `authClient.signUp.email()`
3. Request sent to `/api/auth/sign-up/email`
4. Server creates user account
5. Session automatically created
6. Token stored and user logged in

#### 3.2.4 Token Storage Security

**SecureStore Features:**
- **iOS**: Stored in iOS Keychain
- **Android**: Stored in Android Keystore
- **Encryption**: Hardware-backed encryption when available
- **Isolation**: App-specific, not accessible by other apps

**Storage Keys:**
- `picfluencer.session.token`: JWT token
- `picfluencer.session.expiresAt`: Token expiration
- `picfluencer.session.userId`: User ID

#### 3.2.5 Session Management

```typescript
const { data: session } = authClient.useSession();

// Check if user is authenticated
if (session?.user) {
  // User is logged in
  console.log(session.user.email);
}

// Sign out
await authClient.signOut();
queryClient.invalidateQueries(); // Clear cached data
```

**Session Object:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
  session: {
    id: string;
    token: string;
    expiresAt: Date;
  };
}
```

### 3.3 API Integration (oRPC Client)

#### 3.3.1 oRPC Client Setup

Located in `apps/native/utils/orpc.ts`:

```typescript
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouterClient } from "@picfluencer/api/routers/index";
import { authClient } from "@/lib/auth-client";

export const link = new RPCLink({
  url: `${process.env.EXPO_PUBLIC_SERVER_URL}/rpc`,
  headers() {
    const headers = new Map<string, string>();
    const cookies = authClient.getCookie();
    if (cookies) {
      headers.set("Cookie", cookies);
    }
    return Object.fromEntries(headers);
  },
});

export const client: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
```

**Features:**
- **Type Safety**: `AppRouterClient` type imported from server
- **Auto Headers**: Auth cookies automatically included
- **React Query Integration**: TanStack Query utilities
- **Server URL**: Configured via environment variable

#### 3.3.2 Data Fetching Patterns

**Query (GET operations):**
```typescript
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

// Fetch todos
const todos = useQuery(orpc.todo.getAll.queryOptions());

// Access data
if (todos.isLoading) {
  return <ActivityIndicator />;
}

if (todos.error) {
  return <Text>Error: {todos.error.message}</Text>;
}

return todos.data.map(todo => <TodoItem key={todo.id} todo={todo} />);
```

**Mutation (POST operations):**
```typescript
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

// Create todo mutation
const createMutation = useMutation(
  orpc.todo.create.mutationOptions({
    onSuccess: () => {
      todos.refetch(); // Refresh list
      setNewTodoText(""); // Clear input
    },
  })
);

// Trigger mutation
const handleAddTodo = () => {
  createMutation.mutate({ text: newTodoText });
};
```

**Protected Data:**
```typescript
// Automatically fails if not authenticated
const privateData = useQuery(orpc.privateData.queryOptions());

// Returns: { message: string, user: User }
```

#### 3.3.3 React Query Configuration

Located in `apps/native/utils/orpc.ts`:

```typescript
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.log(error);
    },
  }),
});
```

**Features:**
- **Error Handling**: Global error callback
- **Caching**: Automatic response caching
- **Deduplication**: Prevents duplicate requests
- **Optimistic Updates**: Can be configured per mutation

### 3.4 State Management

**Primary State Management: React Query (TanStack Query)**

The app uses **React Query** as its primary state management solution, handling:
- Server state (API responses)
- Caching and synchronization
- Loading and error states
- Automatic refetching
- Optimistic updates

**Local State: React Hooks**
- Component-level state with `useState`
- Form state with `useState` or `@tanstack/react-form`
- No Redux, Zustand, or Context API for global state

**Authentication State: Better Auth**
- Session state managed by Better Auth
- Accessed via `authClient.useSession()` hook
- Automatically synced with SecureStore

### 3.5 UI Components and Styling

#### 3.5.1 React Native Unistyles

**Theme Configuration (`apps/native/theme.ts`):**
```typescript
export const lightTheme = {
  colors: {
    typography: "#000000",
    background: "#FFFFFF",
    primary: "#007AFF",
    destructive: "#FF3B30",
    border: "#E5E5EA",
    success: "#34C759",
    // ... more colors
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

export const darkTheme = {
  // Dark mode colors
};
```

**Styling Pattern:**
```typescript
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function MyScreen() {
  const { theme } = useUnistyles();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.typography,
    fontSize: 28,
    fontWeight: "bold",
  },
}));
```

**Features:**
- **Type-Safe**: Full TypeScript support
- **Theme-Aware**: Automatic dark/light mode
- **Performance**: Compiled styles, no runtime overhead
- **Responsive**: Breakpoint support

#### 3.5.2 Component Library

**Core Components:**
- **`@expo/vector-icons`**: Icon library (Ionicons, MaterialIcons)
- **React Native Built-ins**: View, Text, TextInput, TouchableOpacity, ScrollView
- **Custom Components**: Container, HeaderButton, SignIn, SignUp

**No External UI Kit:**
The project doesn't use a component library like React Native Paper or Native Base. All UI is custom-built with Unistyles.

### 3.6 AI Chat Integration

#### 3.6.1 AI Chat Screen

Located in `apps/native/app/(drawer)/ai.tsx`:

```typescript
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";

export default function AIScreen() {
  const [input, setInput] = useState("");
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/ai"),
    }),
    onError: (error) => console.error(error),
  });
  
  const onSubmit = () => {
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };
  
  return (
    <View>
      <ScrollView>
        {messages.map(message => (
          <View key={message.id}>
            <Text>{message.role}: {message.parts[0].text}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput value={input} onChangeText={setInput} />
      <Button onPress={onSubmit} title="Send" />
    </View>
  );
}
```

**Features:**
- **Streaming**: Real-time token streaming
- **Auto-Scroll**: Scrolls to bottom as messages arrive
- **Error Handling**: Displays errors inline
- **Message History**: Maintains conversation context

#### 3.6.2 Fetch Polyfill

Expo's `fetch` is used instead of global fetch for better React Native compatibility:

```typescript
import { fetch as expoFetch } from "expo/fetch";

// Expo fetch handles:
// - React Native network layer
// - Proper stream handling
// - Cookie management
```

### 3.7 Error Handling & User Feedback

#### 3.7.1 API Error Handling

```typescript
const todos = useQuery(orpc.todo.getAll.queryOptions());

if (todos.error) {
  return (
    <View>
      <Text>Error: {todos.error.message}</Text>
      <Button title="Retry" onPress={() => todos.refetch()} />
    </View>
  );
}
```

#### 3.7.2 Loading States

```typescript
if (todos.isLoading) {
  return <ActivityIndicator size="large" color={theme.colors.primary} />;
}

if (createMutation.isPending) {
  return <ActivityIndicator size="small" />;
}
```

#### 3.7.3 User Alerts

```typescript
import { Alert } from "react-native";

const handleDeleteTodo = (id: number) => {
  Alert.alert(
    "Delete Todo",
    "Are you sure?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]
  );
};
```

### 3.8 Environment Variables

Located in `apps/native/.env`:

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `EXPO_PUBLIC_SERVER_URL` | Backend API URL | Yes | `http://localhost:3000` |

**Notes:**
- Variables prefixed with `EXPO_PUBLIC_` are exposed to client
- Never store secrets in client environment variables
- Different URLs for dev/staging/production

---

## 4. AI Integration Layer (End-to-End Flow)

### 4.1 AI Service Overview

**Current Integration: Google Gemini 2.5 Flash**

The application uses the Vercel AI SDK to integrate with Google's Gemini AI model for chat-based interactions.

**Integration Points:**
- **Backend Endpoint:** `/ai` (POST)
- **Model:** `gemini-2.5-flash` via `@ai-sdk/google`
- **Client Hook:** `useChat` from `@ai-sdk/react`
- **Streaming:** Yes (token-by-token)

### 4.2 Backend AI Implementation

Located in `apps/server/src/index.ts`:

```typescript
import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

app.post("/ai", async (c) => {
  const body = await c.req.json();
  const uiMessages = body.messages || [];
  
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(uiMessages),
  });
  
  return result.toUIMessageStreamResponse();
});
```

**Flow:**
1. **Receive Messages**: Client sends conversation history
2. **Convert Format**: `convertToModelMessages` transforms UI messages to AI format
3. **Stream Generation**: `streamText` calls Gemini API with streaming enabled
4. **Return Stream**: `toUIMessageStreamResponse` formats as UI Message Stream

**Message Format:**
```typescript
type UIMessage = {
  id: string;
  role: "user" | "assistant";
  parts: Array<{ type: "text"; text: string }>;
};
```

### 4.3 Frontend AI Implementation

Located in `apps/native/app/(drawer)/ai.tsx`:

```typescript
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const { messages, error, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/ai"),
  }),
  onError: (error) => console.error(error),
});
```

**Features:**
- **Message Management**: Automatically maintains conversation state
- **Streaming Updates**: Re-renders as tokens arrive
- **Error Handling**: Catches and exposes errors
- **Optimistic Updates**: Immediately shows user messages

### 4.4 AI Request/Response Flow

```mermaid
sequenceDiagram
    participant User
    participant App as Mobile App
    participant Server as Hono Server
    participant Gemini as Google Gemini

    User->>App: Types message
    App->>App: Add user message to state
    App->>Server: POST /ai {messages}
    Server->>Gemini: streamText(model, messages)
    
    loop Token Streaming
        Gemini-->>Server: Token chunk
        Server-->>App: Stream chunk
        App->>App: Append to assistant message
        App->>User: Display updated message
    end
    
    Gemini-->>Server: [Stream complete]
    Server-->>App: [Close stream]
    App->>App: Mark message as complete
```

**Detailed Steps:**

1. **User Input**
   - User types message in TextInput
   - Taps send button

2. **Client Processing**
   - `sendMessage({ text: input })` called
   - Message added to local state immediately (optimistic update)
   - HTTP POST request sent to `/ai` endpoint

3. **Server Processing**
   - Request arrives at Hono server
   - Messages converted to AI format
   - Gemini API called with streaming enabled

4. **AI Generation**
   - Gemini processes prompt
   - Generates response token by token
   - Each token streamed back to server

5. **Streaming Response**
   - Server forwards each token to client
   - Client's `useChat` hook receives chunks
   - Assistant message built incrementally

6. **UI Updates**
   - React re-renders on each token
   - ScrollView auto-scrolls to bottom
   - Message appears to "type out" in real-time

7. **Completion**
   - Stream closes when generation complete
   - Final message stored in state
   - Ready for next user input

### 4.5 AI Configuration

**Environment Variables:**
```env
GOOGLE_GENERATIVE_AI_API_KEY=<your-api-key>
```

**Model Configuration:**
```typescript
const model = google("gemini-2.5-flash");
// Could be configured with:
// - temperature
// - maxTokens
// - topP, topK
// - stopSequences
```

**Current Settings:**
- Model: Gemini 2.5 Flash (fast, cost-effective)
- Streaming: Enabled
- Max Tokens: Default (8192)
- Temperature: Default (0.7)

### 4.6 Future AI Integrations

**Planned Integrations (per PRD):**

The architecture supports adding multiple AI providers:

**Text Generation:**
- OpenAI GPT-4/GPT-3.5
- Anthropic Claude
- Mistral AI

**Image Generation:**
- Replicate (Stable Diffusion, DALL-E)
- FAL
- AWS SageMaker endpoints

**Implementation Pattern:**
```typescript
// Extensible router structure
app.post("/ai/text", async (c) => {
  const { provider, model, messages } = await c.req.json();
  
  switch (provider) {
    case "openai":
      return streamText({ model: openai(model), messages });
    case "anthropic":
      return streamText({ model: anthropic(model), messages });
    case "google":
      return streamText({ model: google(model), messages });
  }
});

app.post("/ai/image", async (c) => {
  const { provider, prompt } = await c.req.json();
  
  // Call image generation API
  // Return image URL or presigned URL
});
```

### 4.7 AI Error Handling

**Backend Errors:**
- API key invalid: 401 Unauthorized
- Rate limit exceeded: 429 Too Many Requests
- Model unavailable: 503 Service Unavailable
- Timeout: 504 Gateway Timeout

**Frontend Handling:**
```typescript
const { error } = useChat({
  onError: (error) => {
    console.error("AI Error:", error);
    // Show user-friendly error message
  },
});

if (error) {
  return <Text>Unable to connect to AI service. Please try again.</Text>;
}
```

### 4.8 AI Security Considerations

**API Key Protection:**
- ✅ API key stored on server only
- ✅ Never exposed to client
- ✅ Loaded from environment variables
- ✅ Not committed to version control

**Content Filtering:**
- ⚠️ Currently no content filtering (planned for v1)
- Future: Implement guardrails for inappropriate content
- Future: Rate limiting per user
- Future: Usage tracking and quotas

**User Privacy:**
- ⚠️ Conversations currently not saved (stateless)
- Future: Optional conversation history with user consent
- Future: Data retention policy
- Future: GDPR compliance measures


---

## 5. ORM and Data Layer Analysis

### 5.1 Prisma ORM Implementation

The project uses **Prisma** as its database ORM, configured in `packages/db`.

#### 5.1.1 Prisma Configuration

**Generator Configuration (`prisma/schema/schema.prisma`):**
```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
  runtime = "bun"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Features:**
- **Output Directory**: `../generated` (outside schema dir)
- **Module Format**: ESM for Bun compatibility
- **Runtime**: Optimized for Bun
- **Database**: PostgreSQL

#### 5.1.2 Schema Organization

Schemas are split across multiple files:

```
packages/db/prisma/schema/
├── schema.prisma    # Generator and datasource config
├── auth.prisma      # Better Auth tables
└── todo.prisma      # Application tables
```

**auth.prisma:**
```prisma
model User {
  id            String    @id @map("_id")
  name          String
  email         String
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id @map("_id")
  expiresAt DateTime
  token     String
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@map("session")
}

model Account {
  id                    String    @id @map("_id")
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime

  @@map("account")
}

model Verification {
  id         String    @id @map("_id")
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@map("verification")
}
```

**todo.prisma:**
```prisma
model Todo {
  id        Int     @id @default(autoincrement())
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
```

#### 5.1.3 Prisma Client Usage

**Client Initialization (`packages/db/src/index.ts`):**
```typescript
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

export default prisma;
```

**Usage in API Routes:**
```typescript
import prisma from "@picfluencer/db";

// Find all
const todos = await prisma.todo.findMany({
  orderBy: { id: "asc" },
});

// Create
const todo = await prisma.todo.create({
  data: { text: "New todo" },
});

// Update
const updated = await prisma.todo.update({
  where: { id: 1 },
  data: { completed: true },
});

// Delete
await prisma.todo.delete({
  where: { id: 1 },
});
```

#### 5.1.4 Database Migrations

**Development Workflow:**
```bash
# 1. Modify schema files
# 2. Generate Prisma client
bun db:generate

# 3. Push changes to database (no migration files)
bun db:push

# OR create migration (recommended for production)
bun db:migrate
```

**Migration Commands:**
- `bun db:generate`: Regenerate Prisma client
- `bun db:push`: Push schema to database (dev only)
- `bun db:migrate`: Create and apply migration
- `bun db:studio`: Open Prisma Studio GUI

**Migration Files:**
Located in `packages/db/prisma/migrations/` (if using migrate)

### 5.2 Data Access Patterns

#### 5.2.1 Direct Prisma Usage

Currently, the codebase uses Prisma directly in router handlers:

```typescript
export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    return await prisma.todo.findMany({
      orderBy: { id: "asc" },
    });
  }),
};
```

**Advantages:**
- Simple, direct access
- No extra abstraction layer
- Type-safe by default

**Considerations:**
- Business logic in routes
- Harder to test in isolation
- Repeated code across routers

#### 5.2.2 Future: Repository Pattern

For scalability, consider adding a repository layer:

```typescript
// packages/db/src/repositories/TodoRepository.ts
export class TodoRepository {
  async findAll() {
    return prisma.todo.findMany({
      orderBy: { id: "asc" },
    });
  }
  
  async create(text: string) {
    return prisma.todo.create({
      data: { text },
    });
  }
}

// Usage in router
const todoRepo = new TodoRepository();
const todos = await todoRepo.findAll();
```

### 5.3 Transaction Handling

**Prisma Transactions:**
```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email, name },
  });
  
  await tx.account.create({
    data: { userId: user.id, provider: "email" },
  });
});
```

**Use Cases:**
- Creating related records atomically
- Updating multiple tables
- Ensuring data consistency

### 5.4 Database Performance

**Indexing:**
- `@@unique([email])` on User table
- `@@unique([token])` on Session table
- Primary keys auto-indexed

**Query Optimization:**
- Use `select` to limit fields
- Use `include` for relations
- Avoid N+1 queries with `include`

**Connection Pooling:**
Prisma handles connection pooling automatically. Configure with:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=10"
```

### 5.5 Type Safety

**Generated Types:**
Prisma generates TypeScript types for all models:

```typescript
import { Prisma, Todo, User, Session } from "@picfluencer/db";

// Model types
const todo: Todo = {
  id: 1,
  text: "Example",
  completed: false,
};

// Input types
const createInput: Prisma.TodoCreateInput = {
  text: "New todo",
};

// Type-safe queries
const todos: Todo[] = await prisma.todo.findMany();
```

**Benefits:**
- Autocomplete in IDE
- Compile-time type checking
- Refactoring safety

### 5.6 Database Schema Evolution

**Current Tables:**
1. **user** - User accounts
2. **session** - Active sessions
3. **account** - OAuth accounts
4. **verification** - Email verification tokens
5. **todo** - Example todo items

**Future Tables (per PRD):**
The following tables will be needed for v1:

```prisma
// Content creation
model CreatorProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(...)
  niche        String
  tone         String
  audience     String
  sampleLinks  String[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ContentIdea {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String
  category    String
  platforms   String[]
  status      String   // draft, published, archived
  createdAt   DateTime @default(now())
}

model Script {
  id        String   @id @default(cuid())
  ideaId    String
  idea      ContentIdea @relation(...)
  hook      String
  content   String
  cta       String
  createdAt DateTime @default(now())
}

model Caption {
  id        String   @id @default(cuid())
  scriptId  String
  platform  String
  text      String
  hashtags  String[]
  createdAt DateTime @default(now())
}

model Asset {
  id        String   @id @default(cuid())
  userId    String
  type      String   // thumbnail, image, video
  url       String
  metadata  Json?
  createdAt DateTime @default(now())
}
```

### 5.7 No Drizzle ORM

**Note:** The project description mentions optional Drizzle ORM support, but the current implementation uses **Prisma exclusively**. There is no Drizzle setup detected in the codebase.

If Drizzle were to be added, it would likely be:
- Configured in `packages/db` alongside Prisma
- Toggled via environment variable
- Used for edge-runtime compatibility

### 5.8 No Redis Integration

**Current Status:** The project does not currently use Redis for caching or pub/sub.

**Future Considerations:**
For production scaling, Redis could be added for:
- Session storage (alternative to database)
- API response caching
- Rate limiting
- WebSocket pub/sub (multi-server setup)

### 5.9 No RabbitMQ Integration

**Current Status:** No message queue system is implemented.

**Future Use Cases:**
For asynchronous processing:
- Long-running AI tasks
- Batch image processing
- Email notifications
- Analytics aggregation

**Potential Implementation:**
```typescript
// packages/queue/src/producer.ts
export async function enqueueAITask(taskData) {
  const channel = await getChannel();
  await channel.sendToQueue('ai-tasks', Buffer.from(JSON.stringify(taskData)));
}

// Worker process
const channel = await getChannel();
channel.consume('ai-tasks', async (msg) => {
  const task = JSON.parse(msg.content.toString());
  await processAITask(task);
  channel.ack(msg);
});
```

---

## 6. Authentication & Authorization (Better Auth)

### 6.1 Better Auth Architecture

**Better Auth** is a modern, type-safe authentication library for full-stack TypeScript applications.

#### 6.1.1 Server Configuration

Located in `packages/auth/src/index.ts`:

```typescript
import { expo } from '@better-auth/expo';
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@picfluencer/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    process.env.CORS_ORIGIN || "",
    "mybettertapp://",
    "exp://"
  ],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [expo()]
});
```

**Configuration Breakdown:**

**Database Adapter:**
- Uses Prisma adapter for session/user storage
- Automatically manages User, Session, Account, Verification tables

**Trusted Origins:**
- `CORS_ORIGIN`: Web/dev server origin
- `mybettertapp://`: Deep link scheme for OAuth
- `exp://`: Expo development scheme

**Email/Password Auth:**
- Enabled for email-based registration
- Passwords hashed with bcrypt automatically
- Email verification optional (can be enabled)

**Cookie Configuration:**
- `sameSite: "none"`: Required for cross-origin (mobile → server)
- `secure: true`: HTTPS only (enforced in production)
- `httpOnly: true`: Not accessible via JavaScript (XSS protection)

**Expo Plugin:**
- Handles React Native-specific auth flows
- OAuth deep link management
- SecureStore integration

#### 6.1.2 Client Configuration

Located in `apps/native/lib/auth-client.ts`:

```typescript
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme: "mybettertapp",
      storagePrefix: "picfluencer",
      storage: SecureStore,
    }),
  ],
});
```

**Client Features:**
- React hooks for auth state (`useSession`)
- Automatic token management
- Deep link handling for OAuth
- SecureStore for token persistence

### 6.2 Authentication Endpoints

Better Auth provides these endpoints automatically:

| Endpoint | Method | Purpose | Body | Response |
|----------|--------|---------|------|----------|
| `/api/auth/sign-up/email` | POST | Register with email | `{ email, password, name }` | `{ user, session }` |
| `/api/auth/sign-in/email` | POST | Login with email | `{ email, password }` | `{ user, session }` |
| `/api/auth/sign-out` | POST | Logout | - | `{ success: true }` |
| `/api/auth/session` | GET | Get current session | - | `{ user, session }` |
| `/api/auth/refresh` | POST | Refresh session | - | `{ session }` |
| `/api/auth/forgot-password` | POST | Request password reset | `{ email }` | `{ success: true }` |
| `/api/auth/reset-password` | POST | Reset password | `{ token, password }` | `{ success: true }` |
| `/api/auth/verify-email` | POST | Verify email | `{ token }` | `{ success: true }` |

### 6.3 Session Management

#### 6.3.1 Session Creation

**Registration Flow:**
1. Client calls `authClient.signUp.email()`
2. Request sent to `/api/auth/sign-up/email`
3. Server creates User record in database
4. Server creates Session record with JWT token
5. Token returned in response and Set-Cookie header
6. Client stores token in SecureStore
7. Session object returned with user data

**Login Flow:**
1. Client calls `authClient.signIn.email()`
2. Request sent to `/api/auth/sign-in/email`
3. Server validates credentials
4. Server creates Session record
5. Token returned and stored
6. Session object returned

#### 6.3.2 Session Validation

**Request Flow:**
```typescript
// In API context creation (packages/api/src/context.ts)
export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return { session };
}
```

**Protected Procedure:**
```typescript
const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});
```

**Process:**
1. Request arrives with Cookie header
2. Context creation extracts session from cookie
3. `auth.api.getSession()` validates JWT token
4. If valid, session object added to context
5. If invalid/expired, session is null
6. Protected procedures check for session

#### 6.3.3 Session Expiration

**Default Expiration:**
- Sessions last 7 days by default
- Can be configured in Better Auth config

**Refresh Flow:**
```typescript
// Automatic refresh before expiration
await authClient.refresh();
```

**Handling Expiration:**
```typescript
// On 401 response
if (error.status === 401) {
  await authClient.signOut();
  navigate('/login');
}
```

### 6.4 Password Security

**Hashing:**
- Better Auth uses **bcrypt** for password hashing
- Salt rounds: 10 (default)
- Passwords never stored in plain text

**Validation:**
- Minimum length enforced client-side
- Complexity rules can be added
- No maximum length (bcrypt handles truncation)

### 6.5 Token Storage Security

**Mobile App (SecureStore):**
```typescript
import * as SecureStore from "expo-secure-store";

// Better Auth automatically uses SecureStore via plugin
expoClient({
  storage: SecureStore,
  storagePrefix: "picfluencer",
})
```

**Security Properties:**
- **iOS**: Stored in iOS Keychain (hardware encrypted)
- **Android**: Stored in Android Keystore (hardware encrypted)
- **Isolation**: App-specific, not accessible by other apps
- **Backup**: Can be configured to exclude from backups

**Storage Keys:**
- `picfluencer.auth.session`: Session token
- `picfluencer.auth.user`: User data (cached)

### 6.6 OAuth Support (Future)

Better Auth supports OAuth providers. To add Google/Apple login:

```typescript
export const auth = betterAuth({
  // ... existing config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
    },
  },
});
```

**OAuth Flow:**
1. User taps "Sign in with Google"
2. App opens OAuth URL in browser
3. User authorizes on Google
4. Redirects to `mybettertapp://oauth/callback?code=...`
5. App sends code to server
6. Server exchanges code for tokens
7. Server creates/links user account
8. Session created and returned

### 6.7 Role-Based Access Control (Future)

Currently, there are no roles in the User model. To add RBAC:

```prisma
model User {
  id    String @id
  email String
  role  String @default("user") // user, creator, admin
  // ...
}
```

```typescript
// Middleware for role check
const requireAdmin = o.middleware(async ({ context, next }) => {
  if (context.session?.user?.role !== "admin") {
    throw new ORPCError("FORBIDDEN");
  }
  return next({ context });
});

export const adminProcedure = protectedProcedure.use(requireAdmin);
```

### 6.8 Security Best Practices

**Implemented:**
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens in httpOnly cookies
- ✅ Tokens stored in SecureStore on mobile
- ✅ CORS configured with credentials
- ✅ Session validation on every request
- ✅ Automatic session expiration

**Recommended Additions:**
- ⚠️ Rate limiting on auth endpoints
- ⚠️ Account lockout after failed attempts
- ⚠️ Email verification for new accounts
- ⚠️ Two-factor authentication (2FA)
- ⚠️ Password strength requirements
- ⚠️ Audit logging for auth events

---

## 7. Real-Time Communication & Notifications

### 7.1 Current State: No WebSocket Implementation

**Current Status:** The project does **not** currently implement WebSockets for real-time communication.

**Why No WebSockets:**
- v1 focus is on content creation tools
- Chat feature uses HTTP streaming (not WebSocket)
- No real-time collaboration features yet

### 7.2 AI Streaming (HTTP Streaming)

Instead of WebSockets, the AI chat uses **HTTP streaming** via Server-Sent Events (SSE) pattern:

**Backend:**
```typescript
app.post("/ai", async (c) => {
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(uiMessages),
  });
  
  // Returns a streaming response
  return result.toUIMessageStreamResponse();
});
```

**Frontend:**
```typescript
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    fetch: expoFetch,
    api: "/ai",
  }),
});
```

**How It Works:**
1. Client sends POST request with messages
2. Server keeps connection open
3. AI tokens streamed back as they're generated
4. Client receives and renders incrementally
5. Connection closes when complete

**Advantages over WebSocket:**
- Simpler implementation
- Works with standard HTTP
- No persistent connection management
- Automatic reconnection via fetch

### 7.3 Future WebSocket Implementation

For v2+ features, WebSockets may be needed for:

**Use Cases:**
- Real-time collaboration on scripts
- Live notifications
- Multi-user editing
- Presence indicators (who's online)

**Potential Implementation:**

**Server Side (Hono + WebSocket):**
```typescript
import { Hono } from "hono";
import { upgradeWebSocket } from "hono/ws";

app.get(
  "/ws",
  upgradeWebSocket((c) => ({
    onOpen(evt, ws) {
      console.log("Client connected");
    },
    onMessage(evt, ws) {
      const data = JSON.parse(evt.data);
      // Handle message
      ws.send(JSON.stringify({ type: "ack" }));
    },
    onClose(evt, ws) {
      console.log("Client disconnected");
    },
  }))
);
```

**Client Side (React Native):**
```typescript
import { useEffect, useState } from "react";

export function useWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const socket = new WebSocket(url);
    
    socket.onopen = () => {
      console.log("Connected");
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };
    
    socket.onclose = () => {
      console.log("Disconnected");
    };
    
    setWs(socket);
    
    return () => socket.close();
  }, [url]);
  
  const send = (data: any) => {
    ws?.send(JSON.stringify(data));
  };
  
  return { messages, send };
}
```

### 7.4 Push Notifications (Not Implemented)

**Current Status:** No push notification system implemented.

**Future Implementation (Expo Notifications):**

**1. Get Push Token:**
```typescript
import * as Notifications from "expo-notifications";

const token = await Notifications.getExpoPushTokenAsync();
// Send token to server
await orpc.user.registerPushToken.mutate({ token: token.data });
```

**2. Store Token in Database:**
```prisma
model PushToken {
  id        String @id @default(cuid())
  userId    String
  token     String
  platform  String // ios, android
  createdAt DateTime @default(now())
  
  @@unique([userId, token])
}
```

**3. Send Notification from Server:**
```typescript
import { Expo } from "expo-server-sdk";

const expo = new Expo();

async function sendPushNotification(userId: string, title: string, body: string) {
  const tokens = await prisma.pushToken.findMany({
    where: { userId },
  });
  
  const messages = tokens.map(t => ({
    to: t.token,
    title,
    body,
    data: { screen: "Home" },
  }));
  
  await expo.sendPushNotificationsAsync(messages);
}
```

**4. Handle Notification in App:**
```typescript
Notifications.addNotificationReceivedListener(notification => {
  console.log("Notification received:", notification);
});

Notifications.addNotificationResponseReceivedListener(response => {
  const data = response.notification.request.content.data;
  // Navigate to screen
  navigation.navigate(data.screen);
});
```

### 7.5 Real-Time Architecture (Future)

For scaling to multiple servers with real-time features:

```mermaid
graph LR
    A[Mobile App 1] -->|WebSocket| B[Server 1]
    C[Mobile App 2] -->|WebSocket| D[Server 2]
    B <-->|Redis Pub/Sub| E[Redis]
    D <-->|Redis Pub/Sub| E
    B --> F[PostgreSQL]
    D --> F
```

**Redis Pub/Sub Pattern:**
```typescript
// Server 1 publishes message
redis.publish("chat:room1", JSON.stringify({
  type: "new_message",
  data: { message: "Hello" },
}));

// Server 2 subscribes and receives
redis.subscribe("chat:room1");
redis.on("message", (channel, message) => {
  const data = JSON.parse(message);
  // Broadcast to connected clients
  connectedClients.forEach(ws => ws.send(message));
});
```


---

## 8. Security and Best Practices

### 8.1 Authentication Security

**Implemented Security Measures:**

✅ **Password Hashing**
- bcrypt with 10 salt rounds
- Passwords never stored in plain text
- No password exposure in logs or responses

✅ **JWT Token Security**
- httpOnly cookies (not accessible via JavaScript)
- Secure flag (HTTPS only in production)
- sameSite: "none" (for cross-origin mobile apps)
- Short expiration (7 days default)

✅ **Token Storage**
- Mobile: Expo SecureStore (hardware-encrypted keychain)
- Never in localStorage or AsyncStorage
- Automatic cleanup on logout

✅ **Session Validation**
- Every API request validates session
- Expired sessions automatically rejected
- Unauthorized requests return 401

**Recommended Additions:**

⚠️ **Rate Limiting**
```typescript
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";

app.use("/api/auth/*", rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many attempts, please try again later",
}));
```

⚠️ **Account Lockout**
```typescript
// After 5 failed login attempts
if (user.failedLoginAttempts >= 5) {
  const lockoutEnd = user.lastFailedLogin + 30 * 60 * 1000; // 30 min
  if (Date.now() < lockoutEnd) {
    throw new Error("Account temporarily locked");
  }
}
```

⚠️ **Email Verification**
```typescript
// Better Auth supports email verification
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ email, token }) => {
      // Send email with verification link
    },
  },
});
```

### 8.2 API Security

**Implemented:**

✅ **CORS Configuration**
```typescript
app.use("/*", cors({
  origin: process.env.CORS_ORIGIN,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
```

✅ **Input Validation**
- Zod schemas validate all inputs
- Type-safe request bodies
- Automatic error responses for invalid data

✅ **Type Safety**
- End-to-end TypeScript
- oRPC enforces type contracts
- No runtime type coercion vulnerabilities

**Recommended Additions:**

⚠️ **Request Size Limits**
```typescript
app.use("/*", async (c, next) => {
  const contentLength = c.req.header("content-length");
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return c.json({ error: "Request too large" }, 413);
  }
  await next();
});
```

⚠️ **API Versioning**
```typescript
// Prefix routes with version
app.route("/api/v1", v1Router);
app.route("/api/v2", v2Router);
```

⚠️ **Request Logging**
```typescript
app.use("/*", async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  console.log(`${c.req.method} ${c.req.path} - ${duration}ms`);
});
```

### 8.3 Database Security

**Implemented:**

✅ **Connection String Security**
- Loaded from environment variables
- Never committed to version control
- SSL mode can be enforced in production

✅ **Parameterized Queries**
- Prisma uses prepared statements
- No SQL injection vulnerabilities
- Automatic input escaping

✅ **Access Control**
- Database user has limited permissions
- No direct database access from frontend
- All queries through API layer

**Recommended Additions:**

⚠️ **Read Replicas**
```typescript
// For scaling reads
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const prismaRead = new PrismaClient({
  datasources: {
    db: {
      url: process.env.READ_REPLICA_URL,
    },
  },
});
```

⚠️ **Database Backups**
- Automated daily backups
- Point-in-time recovery
- Backup retention policy

⚠️ **Query Monitoring**
- Slow query logging
- Query performance metrics
- Automated alerts for issues

### 8.4 Environment Variables

**Security Best Practices:**

✅ **Never Commit Secrets**
- `.env` in `.gitignore`
- `.env.example` for documentation
- Secrets managed via environment

✅ **Validation**
```typescript
// Validate required env vars at startup
const requiredEnvVars = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "GOOGLE_GENERATIVE_AI_API_KEY",
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`);
  }
}
```

✅ **Client-Side Separation**
- Only `EXPO_PUBLIC_*` vars exposed to mobile app
- Server secrets never sent to client
- API keys always server-side

**Production Secrets Management:**

⚠️ **Use Secret Manager**
```typescript
// AWS Secrets Manager
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

async function getSecret(secretName: string) {
  const client = new SecretsManager({ region: "us-east-1" });
  const response = await client.getSecretValue({ SecretId: secretName });
  return JSON.parse(response.SecretString);
}

// Or use environment variables from deployment platform
// Vercel, Railway, Heroku all provide secure env var management
```

### 8.5 AI Integration Security

**Implemented:**

✅ **API Key Protection**
- All AI API keys on server only
- Never exposed to client
- Loaded from environment variables

✅ **Server-Side Calls**
- All AI requests go through backend
- Client cannot directly call AI APIs
- Usage tracked and controlled

**Recommended Additions:**

⚠️ **Content Filtering**
```typescript
// Filter inappropriate content
import { Moderator } from "content-moderator";

const moderator = new Moderator(process.env.MODERATOR_API_KEY);

app.post("/ai", async (c) => {
  const { messages } = await c.req.json();
  const lastMessage = messages[messages.length - 1];
  
  // Check for inappropriate content
  const moderation = await moderator.check(lastMessage.text);
  if (moderation.flagged) {
    return c.json({ error: "Content violates policies" }, 400);
  }
  
  // Continue with AI generation
});
```

⚠️ **Rate Limiting per User**
```typescript
// Track AI usage per user
const usage = await prisma.aiUsage.findFirst({
  where: {
    userId: context.session.user.id,
    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  },
});

if (usage.requestCount >= 100) {
  throw new Error("Daily AI usage limit exceeded");
}
```

⚠️ **Cost Monitoring**
```typescript
// Track AI costs
await prisma.aiUsage.create({
  data: {
    userId,
    model: "gemini-2.5-flash",
    tokens: response.usage.totalTokens,
    cost: response.usage.totalTokens * 0.000001, // Example pricing
  },
});
```

### 8.6 Mobile App Security

**Implemented:**

✅ **Secure Token Storage**
- SecureStore for sensitive data
- Hardware-encrypted storage
- App-specific isolation

✅ **HTTPS Only**
- All API calls over HTTPS in production
- Certificate validation
- No plaintext transmission

✅ **Code Obfuscation**
- Production builds minified
- Hermes bytecode (React Native)
- Makes reverse engineering harder

**Recommended Additions:**

⚠️ **Certificate Pinning**
```typescript
// Pin server certificate
import { NetworkSecurityConfig } from "react-native-ssl-pinning";

NetworkSecurityConfig.pinCertificates({
  domain: "api.picfluencer.com",
  certificates: [
    "sha256/ABC123...",
  ],
});
```

⚠️ **Jailbreak Detection**
```typescript
import JailMonkey from "jail-monkey";

if (JailMonkey.isJailBroken()) {
  Alert.alert(
    "Security Warning",
    "This app cannot run on jailbroken/rooted devices"
  );
}
```

⚠️ **App Attestation**
```typescript
// iOS DeviceCheck / Android SafetyNet
// Verify app integrity before sensitive operations
```

### 8.7 Code Security Best Practices

**Implemented:**

✅ **TypeScript Strict Mode**
- Catches type errors at compile time
- Prevents common bugs
- Enforces type safety

✅ **Input Validation**
- Zod schemas for all inputs
- Runtime type checking
- Automatic sanitization

✅ **Error Handling**
```typescript
app.onError((err, c) => {
  console.error(err);
  
  // Don't leak internal errors
  if (process.env.NODE_ENV === "production") {
    return c.json({ error: "Internal server error" }, 500);
  }
  
  return c.json({ error: err.message }, 500);
});
```

**Recommended Additions:**

⚠️ **Dependency Scanning**
```bash
# Add to CI/CD
bun audit
npm audit
```

⚠️ **Static Analysis**
```bash
# ESLint security rules
npm install eslint-plugin-security

# Add to .eslintrc
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"]
}
```

⚠️ **Secret Scanning**
```bash
# Prevent committing secrets
# Use git-secrets or similar
git secrets --install
git secrets --register-aws
```

### 8.8 Compliance & Privacy

**Current Status:**

⚠️ **GDPR Compliance**
- Data collection disclosed in privacy policy
- User consent for data processing
- Right to deletion (implement user account deletion)
- Data export functionality

⚠️ **CCPA Compliance**
- Privacy policy disclosure
- Do Not Sell option
- Data access requests

**Recommended Implementation:**

```typescript
// User data export
export const userRouter = {
  exportData: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;
    
    const userData = {
      user: await prisma.user.findUnique({ where: { id: userId } }),
      todos: await prisma.todo.findMany({ where: { userId } }),
      // ... other user data
    };
    
    return userData;
  }),
  
  // User account deletion
  deleteAccount: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;
    
    await prisma.$transaction([
      prisma.todo.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
    
    return { success: true };
  }),
};
```

### 8.9 Monitoring & Incident Response

**Recommended Setup:**

⚠️ **Error Tracking**
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use("/*", async (c, next) => {
  try {
    await next();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
});
```

⚠️ **Audit Logging**
```typescript
// Log important events
await prisma.auditLog.create({
  data: {
    userId: context.session.user.id,
    action: "user.login",
    ipAddress: c.req.header("x-forwarded-for"),
    userAgent: c.req.header("user-agent"),
    timestamp: new Date(),
  },
});
```

⚠️ **Security Headers**
```typescript
app.use("/*", async (c, next) => {
  await next();
  
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("X-XSS-Protection", "1; mode=block");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  c.res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  );
});
```

---

## 9. API Reference Tables

### 9.1 REST API Endpoints

| Path | Method | Auth | Description | Request | Response |
|------|--------|------|-------------|---------|----------|
| `/` | GET | No | Health check | - | `"OK"` |
| `/api/auth/sign-up/email` | POST | No | Register user | `{ email, password, name }` | `{ user, session }` |
| `/api/auth/sign-in/email` | POST | No | Login user | `{ email, password }` | `{ user, session }` |
| `/api/auth/sign-out` | POST | Yes | Logout user | - | `{ success: true }` |
| `/api/auth/session` | GET | Yes | Get session | - | `{ user, session }` |
| `/api/auth/refresh` | POST | Yes | Refresh token | - | `{ session }` |
| `/ai` | POST | No | AI chat stream | `{ messages: UIMessage[] }` | Stream response |
| `/api-reference/*` | GET | No | OpenAPI docs | - | HTML/JSON |

### 9.2 oRPC Procedures

| Procedure | Auth | Description | Input | Output |
|-----------|------|-------------|-------|--------|
| `healthCheck` | No | Server health | - | `"OK"` |
| `privateData` | Yes | Protected endpoint | - | `{ message: string, user: User }` |
| `todo.getAll` | No | List all todos | - | `Todo[]` |
| `todo.create` | No | Create todo | `{ text: string }` | `Todo` |
| `todo.toggle` | No | Toggle completion | `{ id: number, completed: boolean }` | `Todo` |
| `todo.delete` | No | Delete todo | `{ id: number }` | `Todo` |

### 9.3 Frontend Screens & API Usage

| Screen | Route | APIs Called | Purpose |
|--------|-------|-------------|---------|
| Home | `/(drawer)/index` | `healthCheck`, `privateData` | Auth demo & API status |
| Todos | `/(drawer)/todos` | `todo.getAll`, `todo.create`, `todo.toggle`, `todo.delete` | Todo management |
| AI Chat | `/(drawer)/ai` | `/ai` (streaming) | AI conversation |
| Tabs | `/(drawer)/(tabs)` | - | Navigation demo |
| Modal | `/modal` | - | Modal demo |

### 9.4 Database Tables

| Table | Purpose | Key Fields | Relations |
|-------|---------|------------|-----------|
| `user` | User accounts | `id`, `email`, `name` | → `sessions`, `accounts` |
| `session` | Active sessions | `id`, `token`, `userId`, `expiresAt` | ← `user` |
| `account` | OAuth accounts | `id`, `userId`, `providerId` | ← `user` |
| `verification` | Email verification | `id`, `identifier`, `value`, `expiresAt` | - |
| `todo` | Todo items | `id`, `text`, `completed` | - |

### 9.5 Environment Variables

#### Server Environment Variables

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection | `postgresql://user:pass@localhost:5432/picfluencer` |
| `BETTER_AUTH_SECRET` | Yes | JWT signing secret | `<random-secret-64-chars>` |
| `BETTER_AUTH_URL` | Yes | Auth service URL | `http://localhost:3000` |
| `CORS_ORIGIN` | Yes | Allowed CORS origin | `http://localhost:8081` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Google Gemini API key | `AI...` |
| `NODE_ENV` | No | Environment | `development`, `production` |
| `PORT` | No | Server port | `3000` |

#### Mobile App Environment Variables

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `EXPO_PUBLIC_SERVER_URL` | Yes | Backend API URL | `http://localhost:3000` |

### 9.6 Workspace Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| `bun dev` | Root | Run all apps in dev mode |
| `bun dev:server` | Root | Run server only |
| `bun dev:native` | Root | Run mobile app only |
| `bun build` | Root | Build all packages/apps |
| `bun check-types` | Root | TypeScript type checking |
| `bun db:push` | Root | Push Prisma schema to DB |
| `bun db:migrate` | Root | Create & apply migration |
| `bun db:generate` | Root | Generate Prisma client |
| `bun db:studio` | Root | Open Prisma Studio |

---

## 10. Architecture Diagrams

### 10.1 Monorepo Dependency Graph

```mermaid
graph TD
    subgraph "Applications"
        A[apps/server<br/>Hono API Server]
        B[apps/native<br/>React Native App]
    end
    
    subgraph "Shared Packages"
        C[@picfluencer/api<br/>oRPC Routers]
        D[@picfluencer/auth<br/>Better Auth Config]
        E[@picfluencer/db<br/>Prisma Client]
    end
    
    subgraph "External Services"
        F[PostgreSQL<br/>Database]
        G[Google Gemini<br/>AI Service]
    end
    
    A --> C
    A --> D
    A --> E
    A --> G
    B --> C
    C --> D
    C --> E
    D --> E
    E --> F
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#95e1d3
    style D fill:#f38181
    style E fill:#aa96da
    style F fill:#ffeaa7
    style G fill:#74b9ff
```

### 10.2 Request Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant M as Mobile App
    participant H as Hono Server
    participant O as oRPC Handler
    participant A as Auth Middleware
    participant P as Prisma Client
    participant D as PostgreSQL

    U->>M: Interact with UI
    M->>H: HTTP Request + Cookie
    H->>H: Logger Middleware
    H->>H: CORS Middleware
    
    alt Better Auth Route
        H->>A: /api/auth/*
        A->>D: Validate/Create Session
        D-->>A: Session Data
        A-->>M: Response + Set-Cookie
    else oRPC Route
        H->>O: Create Context
        O->>A: Extract Session
        A->>D: Validate Token
        D-->>A: Session/User
        A-->>O: Context w/ Session
        O->>O: Validate Input (Zod)
        O->>P: Handler Function
        P->>D: SQL Query
        D-->>P: Query Result
        P-->>O: Data
        O-->>H: Response
        H-->>M: JSON Response
    else AI Route
        H->>G: POST /ai
        G->>AI: Stream Request
        loop Token Streaming
            AI-->>G: Token Chunk
            G-->>M: Stream Chunk
        end
    end
    
    M->>U: Update UI
```

### 10.3 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Mobile App
    participant S as Server
    participant BA as Better Auth
    participant SS as SecureStore
    participant DB as PostgreSQL

    rect rgb(200, 220, 240)
    Note over U,DB: Sign Up Flow
    U->>A: Enter email/password
    A->>S: POST /api/auth/sign-up/email
    S->>BA: Process Registration
    BA->>DB: Create User
    BA->>DB: Create Session
    DB-->>BA: User & Session
    BA-->>S: JWT Token
    S-->>A: Response + Set-Cookie
    A->>SS: Store Token
    SS-->>A: Success
    A->>U: Navigate to Home
    end

    rect rgb(240, 220, 200)
    Note over U,DB: Subsequent Requests
    U->>A: Use App
    A->>SS: Get Token
    SS-->>A: Token
    A->>S: API Request + Cookie
    S->>BA: Validate Token
    BA->>DB: Check Session
    DB-->>BA: Session Valid
    BA-->>S: Session Data
    S->>S: Process Request
    S-->>A: Response
    A->>U: Display Data
    end

    rect rgb(220, 240, 220)
    Note over U,DB: Sign Out Flow
    U->>A: Tap Sign Out
    A->>S: POST /api/auth/sign-out
    S->>BA: Invalidate Session
    BA->>DB: Delete Session
    DB-->>BA: Success
    BA-->>S: Success
    S-->>A: Response
    A->>SS: Clear Token
    SS-->>A: Success
    A->>U: Navigate to Login
    end
```

### 10.4 AI Chat Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Chat Screen
    participant H as useChat Hook
    participant F as Fetch API
    participant S as Server
    participant G as Gemini API

    U->>C: Type message & send
    C->>H: sendMessage({ text })
    H->>H: Add user message (optimistic)
    C->>U: Show user message
    
    H->>F: POST /ai { messages }
    F->>S: HTTP Request
    S->>G: streamText(model, messages)
    
    G-->>S: Start stream
    S-->>F: Stream response
    
    loop Token Streaming
        G->>S: Generate token
        S->>F: Send token chunk
        F->>H: Process chunk
        H->>H: Append to assistant message
        H->>C: Update messages state
        C->>U: Display typing effect
    end
    
    G-->>S: Stream complete
    S-->>F: Close stream
    F-->>H: Stream done
    H->>H: Mark message complete
    H->>C: Final update
    C->>U: Show complete message
```

### 10.5 Mobile App Navigation Structure

```mermaid
graph TD
    A[Root Stack] --> B[Drawer Navigator]
    A --> C[Modal Screen]
    
    B --> D[Home Screen]
    B --> E[Tabs Navigator]
    B --> F[Todos Screen]
    B --> G[AI Chat Screen]
    
    E --> H[Tab One]
    E --> I[Tab Two]
    
    style A fill:#4ecdc4
    style B fill:#95e1d3
    style C fill:#ffeaa7
    style D fill:#74b9ff
    style E fill:#a29bfe
    style F fill:#fd79a8
    style G fill:#fdcb6e
    style H fill:#55efc4
    style I fill:#81ecec
```

### 10.6 Data Flow: Creating a Todo

```mermaid
sequenceDiagram
    participant UI as Todos Screen
    participant RQ as React Query
    participant OC as oRPC Client
    participant RS as RPC Link
    participant SR as Server
    participant RT as Router Handler
    participant PR as Prisma
    participant DB as PostgreSQL

    UI->>RQ: createMutation.mutate({ text })
    RQ->>OC: orpc.todo.create({ text })
    OC->>RS: Format RPC request
    RS->>SR: POST /rpc/todo.create
    SR->>RT: Route to handler
    RT->>RT: Validate input (Zod)
    RT->>PR: prisma.todo.create()
    PR->>DB: INSERT INTO todo
    DB-->>PR: New record
    PR-->>RT: Todo object
    RT-->>SR: Return data
    SR-->>RS: HTTP Response
    RS-->>OC: Parse response
    OC-->>RQ: Return data
    RQ->>RQ: Invalidate cache
    RQ->>RQ: onSuccess callback
    RQ-->>UI: Update state
    UI->>UI: Refetch todos
    UI->>UI: Clear input
    UI->>UI: Re-render list
```

---

## 11. Development Workflow

### 11.1 Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd picfluencer

# Install dependencies
bun install

# Setup environment variables
cp apps/server/.env.example apps/server/.env
cp apps/native/.env.example apps/native/.env

# Edit .env files with your values
# - DATABASE_URL
# - BETTER_AUTH_SECRET
# - GOOGLE_GENERATIVE_AI_API_KEY
# - CORS_ORIGIN
# - EXPO_PUBLIC_SERVER_URL

# Setup database
bun db:push

# Start development
bun dev
```

### 11.2 Development Commands

```bash
# Run everything
bun dev                  # Server + Native app

# Run individually
bun dev:server          # Backend only (port 3000)
bun dev:native          # Mobile app only (Expo)

# Database operations
bun db:push             # Push schema to DB (no migrations)
bun db:migrate          # Create migration & apply
bun db:generate         # Regenerate Prisma client
bun db:studio           # Open Prisma Studio (GUI)

# Build
bun build               # Build all packages/apps
bun check-types         # TypeScript type check

# Mobile app specific
cd apps/native
bun android             # Run on Android device/emulator
bun ios                 # Run on iOS simulator
bun web                 # Run in web browser
```

### 11.3 Development Workflow

**1. Backend Development**
```bash
# Terminal 1: Run server with hot reload
bun dev:server

# Terminal 2: Watch database
bun db:studio

# Make changes to:
# - packages/api/src/routers/*.ts (add endpoints)
# - packages/db/prisma/schema/*.prisma (modify schema)
# - apps/server/src/index.ts (add routes)

# After schema changes:
bun db:generate
bun db:push
```

**2. Frontend Development**
```bash
# Terminal 1: Run Expo
bun dev:native

# Expo DevTools will open in browser
# Scan QR code with Expo Go app

# Make changes to:
# - apps/native/app/**/*.tsx (screens)
# - apps/native/components/**/*.tsx (components)
# - apps/native/utils/orpc.ts (API client)

# Changes hot reload automatically
```

**3. Full-Stack Feature Development**

```bash
# 1. Define database schema
# packages/db/prisma/schema/feature.prisma
model Feature {
  id   Int    @id @default(autoincrement())
  name String
}

# 2. Generate and push
bun db:generate
bun db:push

# 3. Create API router
# packages/api/src/routers/feature.ts
export const featureRouter = {
  getAll: publicProcedure.handler(async () => {
    return await prisma.feature.findMany();
  }),
};

# 4. Add to root router
# packages/api/src/routers/index.ts
export const appRouter = {
  // ... existing
  feature: featureRouter,
};

# 5. Use in mobile app
# apps/native/app/(drawer)/feature.tsx
const features = useQuery(orpc.feature.getAll.queryOptions());
```

### 11.4 Testing Strategy

**Current Status:** No tests implemented yet.

**Recommended Testing Setup:**

**1. Backend Unit Tests (Vitest)**
```typescript
// packages/api/src/routers/todo.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { testClient } from "../test-utils";

describe("Todo Router", () => {
  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });
  
  it("should create todo", async () => {
    const result = await testClient.todo.create({ text: "Test" });
    expect(result.text).toBe("Test");
    expect(result.completed).toBe(false);
  });
  
  it("should list todos", async () => {
    await testClient.todo.create({ text: "Todo 1" });
    await testClient.todo.create({ text: "Todo 2" });
    
    const todos = await testClient.todo.getAll();
    expect(todos).toHaveLength(2);
  });
});
```

**2. Frontend Component Tests (Jest + React Native Testing Library)**
```typescript
// apps/native/app/(drawer)/todos.test.tsx
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TodosScreen from "./todos";

describe("TodosScreen", () => {
  it("should add todo", async () => {
    const { getByPlaceholderText, getByText } = render(<TodosScreen />);
    
    const input = getByPlaceholderText("Add a new task...");
    const button = getByText("Add");
    
    fireEvent.changeText(input, "New todo");
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(getByText("New todo")).toBeTruthy();
    });
  });
});
```

**3. E2E Tests (Detox for React Native)**
```typescript
// e2e/todos.e2e.ts
describe("Todo Feature", () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  it("should complete full todo workflow", async () => {
    await element(by.id("drawer-button")).tap();
    await element(by.text("Todos")).tap();
    
    await element(by.id("todo-input")).typeText("E2E Test Todo");
    await element(by.id("add-button")).tap();
    
    await expect(element(by.text("E2E Test Todo"))).toBeVisible();
    
    await element(by.id("todo-checkbox-1")).tap();
    await expect(element(by.id("todo-1"))).toHaveLabel("completed");
  });
});
```

### 11.5 Deployment

**Backend Deployment (Recommended: Railway/Render)**

```bash
# 1. Build for production
bun build

# 2. Set environment variables in platform
# - DATABASE_URL (production database)
# - BETTER_AUTH_SECRET
# - GOOGLE_GENERATIVE_AI_API_KEY
# - CORS_ORIGIN (production mobile app origin)
# - NODE_ENV=production

# 3. Deploy
git push railway main
# or
railway up
```

**Mobile App Deployment**

```bash
# 1. Configure app.json
{
  "expo": {
    "name": "Picfluencer",
    "slug": "picfluencer",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.picfluencer.app"
    },
    "android": {
      "package": "com.picfluencer.app"
    }
  }
}

# 2. Build for iOS
eas build --platform ios

# 3. Build for Android
eas build --platform android

# 4. Submit to stores
eas submit --platform ios
eas submit --platform android
```

**Environment-Specific Configs**

```bash
# Development
EXPO_PUBLIC_SERVER_URL=http://localhost:3000

# Staging
EXPO_PUBLIC_SERVER_URL=https://staging-api.picfluencer.com

# Production
EXPO_PUBLIC_SERVER_URL=https://api.picfluencer.com
```

### 11.6 Database Migrations in Production

```bash
# 1. Create migration locally
bun db:migrate

# 2. Commit migration files
git add packages/db/prisma/migrations
git commit -m "Add feature table"

# 3. Deploy (migration runs automatically if configured)
# Or manually run:
bun --cwd packages/db prisma migrate deploy
```

### 11.7 Monitoring & Debugging

**Server Logs**
```bash
# Development
bun dev:server  # Logs to console

# Production (with logging service)
# - Railway: Automatic log collection
# - Render: Dashboard logs
# - Or use: Datadog, LogRocket, etc.
```

**Mobile App Debugging**
```bash
# React Native Debugger
# Open React Native Debugger app
# Shake device → "Debug"

# Expo DevTools
# Available at http://localhost:19002
# View logs, reload, open on device

# Chrome DevTools
# Shake device → "Debug Remote JS"
```

**Database Queries**
```bash
# Prisma Studio
bun db:studio
# Opens GUI at http://localhost:5555

# Or connect with pgAdmin/TablePlus
# using DATABASE_URL
```

---

## Summary

This architecture document provides a comprehensive analysis of the Picfluencer monorepo, covering:

✅ **Monorepo Structure**: Turborepo with 2 apps (server, native) and 3 packages (api, auth, db)

✅ **Backend Architecture**: Hono.js server with oRPC for type-safe APIs, Better Auth for authentication, Prisma for database

✅ **Frontend Architecture**: React Native with Expo Router, React Query for data fetching, Unistyles for theming

✅ **AI Integration**: Google Gemini 2.5 Flash with streaming responses via Vercel AI SDK

✅ **Security**: JWT tokens, SecureStore, input validation, CORS, prepared statements

✅ **Development Workflow**: Bun runtime, hot reloading, type-safe end-to-end development

The current v0 implementation provides a solid foundation with authentication, database, API layer, and AI chat. Future enhancements will add content creation features per the PRD, including idea generation, script writing, caption generation, and cross-platform content tools for influencers.

**Architecture Strengths:**
- Type-safe end-to-end (TypeScript everywhere)
- Modern, performant stack (Bun, Hono, Expo)
- Clear separation of concerns (monorepo packages)
- Developer-friendly (hot reload, type inference)
- Scalable foundation (can add WebSockets, caching, queues)

**Next Steps for Production:**
1. Add comprehensive tests (unit, integration, e2e)
2. Implement rate limiting and request throttling
3. Add monitoring and error tracking (Sentry)
4. Set up CI/CD pipeline
5. Implement content creation features from PRD
6. Add file upload/storage for media assets
7. Optimize database queries and add indexes
8. Implement user analytics and usage tracking

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-10-13  
**Maintained By:** Development Team
