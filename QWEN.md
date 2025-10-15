# Picfluencer Project Context

## Project Overview

Picfluencer is an AI-powered application hub designed for micro and nano influencers (1K-100K followers) to streamline their content creation workflow. The platform helps creators generate ideas, scripts, captions, and thumbnails for short-form video platforms like YouTube Shorts, TikTok, Instagram Reels, and X, with cross-platform repurposing capabilities.

The project follows a modern full-stack architecture with:
- Backend API built with Hono.js, Prisma ORM, and better-auth for authentication
- Mobile application built with Expo (React Native)
- PostgreSQL database for data persistence
- AI integration for content generation

## Architecture

### Backend API (`backend-api/`)
- Runtime: Bun
- Framework: Hono.js
- Database: PostgreSQL with Prisma ORM
- Authentication: better-auth
- Language: TypeScript

Key dependencies:
- `hono`: Web framework
- `@prisma/client`: Database ORM
- `better-auth`: Authentication solution

### Mobile Application (`mobile/`)
- Framework: Expo (React Native)
- Navigation: Expo Router with bottom tabs
- Language: TypeScript

Key dependencies:
- `expo`: Core Expo SDK
- `react-native`: React Native framework
- `@react-navigation`: Navigation library

## Development Setup

### Prerequisites
- Bun (runtime for backend)
- Node.js/npm (for mobile app)
- PostgreSQL database

### Backend API

1. Navigate to the backend directory:
```bash
cd backend-api
```

2. Install dependencies:
```bash
bun install
```

3. Run development server:
```bash
bun run dev
```

The backend API will be available at http://localhost:3000

### Mobile Application

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Additional commands:
```bash
npm run android    # Run on Android emulator/device
npm run ios         # Run on iOS simulator
npm run web         # Run in web browser
```

## Project Structure

```
picfluencer/
├── backend-api/           # Backend API service
│   ├── prisma/            # Prisma schema and migrations
│   ├── src/               # Source code
│   │   ├── generated/     # Generated Prisma client
│   │   └── index.ts       # Entry point
│   ├── package.json       # Dependencies and scripts
│   └── tsconfig.json      # TypeScript configuration
├── mobile/                # Mobile application
│   ├── app/               # App screens and routing
│   ├── components/        # Reusable UI components
│   ├── assets/            # Images and static assets
│   ├── package.json       # Dependencies and scripts
│   └── app.json           # Expo configuration
└── docs/                 # Documentation
```

## Key Features (from PRD)

### Milestone 1: Core Creation Loop
- Onboarding and personalization
- Idea generator
- Hook and angle generator
- Script outline for short-form video
- Caption and hashtag generator
- Titles and thumbnail prompts
- Save, versioning, and library
- Export to clipboard/files
- Feedback and rating loop
- Basic safety and guardrails

### Milestone 2: Packaging, Repurposing, and Growth Helpers
- Cross-platform repurposing
- Content calendar and reminders
- Trend radar (P1)
- Brand pitch/DM generator (P1)
- Rate card and mini media kit (P1)
- Basic analytics and attribution (P1)
- UTM/link helper (P1)
- Templates gallery and community prompts (P1)

## Database Schema

The backend uses Prisma ORM with a PostgreSQL database. The schema is defined in `backend-api/prisma/schema.prisma`, which currently includes basic configuration for PostgreSQL connectivity.

## Authentication

The project uses `better-auth` for authentication, which integrates with Prisma for storing user data. The authentication system supports:
- Email/password authentication
- Session management
- Social login (configurable)

## Environment Variables

Both services require environment configuration:
- Backend API needs `DATABASE_URL` for PostgreSQL connection
- Authentication secrets for better-auth
- API keys for AI services (implementation dependent)

## Deployment Considerations

- The backend API is designed to run with Bun runtime
- Mobile app uses Expo for cross-platform deployment
- PostgreSQL database required for data persistence
- Authentication requires secure secret management
- Consider CORS configuration for cross-domain requests