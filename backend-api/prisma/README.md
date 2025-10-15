# Prisma Schema Organization

This project uses Prisma's multi-schema file support (prismaSchemaFolder) to organize database models into logical modules.

## Structure

```
prisma/
├── schema.prisma      # Main config with generator and datasource
├── schema/           # Folder containing all schema modules
│   ├── db.prisma         # Database configuration
│   ├── better-auth.prisma # Authentication models (User, Session, Account, Verification)
│   ├── creator.prisma    # Creator profile and content models (future)
│   └── payment.prisma    # Payment and subscription models (future)
└── migrations/       # Database migrations (auto-generated)
```

## How it Works

With the `prismaSchemaFolder` preview feature enabled, Prisma automatically discovers and merges all `.prisma` files in the `schema/` directory when you run commands like:

- `bunx prisma generate` - Generates the Prisma Client
- `bunx prisma migrate dev` - Creates and runs migrations
- `bunx prisma studio` - Opens Prisma Studio

## Adding New Schema Files

1. Create a new `.prisma` file in the `schema/` folder
2. Add your models (they'll automatically be included)
3. Run `bunx prisma generate` to update the client
4. Run `bunx prisma migrate dev` to create migrations

## Current Models

### Authentication (better-auth.prisma)
- **User** - User accounts with support for anonymous auth
- **Session** - Active user sessions
- **Account** - OAuth provider accounts
- **Verification** - Email verification tokens

### Future Models (commented out)
- **CreatorProfile** - Creator-specific profile data
- **Content** - Generated content (ideas, scripts, captions)
- **Subscription** - User subscription plans
- **Payment** - Payment records

## Commands

```bash
# Generate Prisma Client
bun run prisma:generate

# Create and run migrations
bun run prisma:migrate

# Push schema changes directly (skip migrations)
bun run prisma:push

# Open Prisma Studio
bun run prisma:studio

# Setup database (generate + migrate)
bun run db:setup
```

## Notes

- The `prismaSchemaFolder` feature is currently in preview
- All schema files in the `schema/` directory are automatically merged
- Relations between models in different files work seamlessly
- The main `schema.prisma` file must contain the generator and datasource blocks