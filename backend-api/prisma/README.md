# Prisma + Better Auth Integration

This project uses Prisma ORM with PostgreSQL for database management, integrated with Better Auth for authentication.

## Database Configuration

- **Database**: PostgreSQL
- **Connection**: Configured via `DATABASE_URL` in `.env` file
- **Schema**: Single `schema.prisma` file containing all models

## Current Models

### Authentication Models (Better Auth)

- **User** - User accounts with support for anonymous authentication
  - Includes `isAnonymous` field for anonymous users
  - Email, name, image, and verification status

- **Session** - Active user sessions
  - Token-based sessions with expiration
  - IP address and user agent tracking

- **Account** - OAuth and credential provider accounts
  - Supports multiple auth providers per user
  - Stores access/refresh tokens for OAuth

- **Verification** - Email verification and magic link tokens
  - Used for email verification and passwordless login

## Commands

```bash
# Generate Prisma Client
bun run prisma:generate

# Create and run migrations
bun run prisma:migrate

# Push schema changes directly (development)
bun run prisma:push

# Open Prisma Studio (GUI for database)
bun run prisma:studio

# Full setup (generate + migrate)
bun run db:setup
```

## Working with the Database

### Initial Setup
1. Ensure PostgreSQL is running
2. Set `DATABASE_URL` in `.env` file
3. Run `bun run db:setup` to create tables

### Making Schema Changes
1. Edit `schema.prisma` file
2. Run `bunx prisma generate` to update the client
3. Run `bunx prisma migrate dev --name describe-change` to create migration

### Development Tips
- Use `bunx prisma studio` to view and edit data visually
- Use `bunx prisma db push` for rapid prototyping (skips migrations)
- Always run `bunx prisma generate` after schema changes

## Future Models (To Be Added)

When needed, the following models can be added to support additional features:

- **CreatorProfile** - Creator-specific profile data
- **Content** - Generated content (ideas, scripts, captions)
- **Subscription** - User subscription plans
- **Payment** - Payment records and transactions