# Anonymous Authentication in Picfluencer

## Overview

Picfluencer supports anonymous authentication using Better Auth's anonymous plugin. This allows users to start using the app immediately without providing personal information, while preserving the ability to link their account later to save their work permanently.

## How It Works

### Anonymous User Creation

When a user chooses to continue anonymously:
1. A temporary user account is created with:
   - A generated email address using the `picfluencer.app` domain
   - A randomly generated creative name (e.g., "Creative Artist", "Talented Influencer")
   - `isAnonymous` field set to `true`
2. A secure session is established using HTTP-only cookies
3. The user can access all app features immediately

### Account Linking

When an anonymous user decides to sign up with email:
1. The sign-up flow detects the anonymous session
2. The `onLinkAccount` callback is triggered during email registration
3. All user data is migrated from the anonymous account to the new email account
4. The anonymous account is deleted by default
5. The user retains all their created content, preferences, and data

## Implementation Details

### Server Configuration

The anonymous plugin is configured in [`packages/auth/src/index.ts`](packages/auth/src/index.ts):

```typescript
import { betterAuth, anonymous } from "better-auth";

export const auth = betterAuth({
  // ... other config
  plugins: [
    // ... other plugins
    anonymous({
      emailDomainName: "picfluencer.app",
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // Migrate all user data from anonymous to new account
        // TODO: Implement data migration logic for content, profiles, analytics
        console.log(`Linking anonymous user ${anonymousUser.id} to new user ${newUser.id}`);
      },
      disableDeleteAnonymousUser: false,
      generateName: () => {
        // Generate creative names for anonymous users
        const adjectives = ["Creative", "Inspired", "Talented", "Artistic", "Innovative"];
        const nouns = ["Creator", "Artist", "Influencer", "Visionary", "Storyteller"];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${randomAdjective} ${randomNoun}`;
      }
    })
  ]
});
```

### Database Schema

The User model includes an `isAnonymous` field:

```prisma
model User {
  id            String    @id @map("_id")
  name          String
  email         String
  emailVerified Boolean
  image         String?
  isAnonymous   Boolean?  @default(false)
  // ... other fields
}
```

### Mobile App Implementation

#### Auth Client Configuration

The mobile app auth client includes the anonymous client plugin in [`apps/native/lib/auth-client.ts`](apps/native/lib/auth-client.ts):

```typescript
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({ /* ... */ }),
    anonymousClient(),
  ],
});
```

#### Helper Functions

Auth helper functions are available in [`apps/native/utils/auth-helpers.ts`](apps/native/utils/auth-helpers.ts):

- `signInAnonymously()` - Sign in as an anonymous user
- `isCurrentUserAnonymous()` - Check if current user is anonymous
- `linkAnonymousToEmail()` - Link anonymous account to email
- `signInWithEmail()` - Sign in with email (handles anonymous linking)

#### Components

- **AnonymousSignIn** (`apps/native/components/anonymous-sign-in.tsx`) - Component for anonymous sign-up
- **SignUp** (`apps/native/components/sign-up.tsx`) - Updated to handle anonymous account linking
- **Home** (`apps/native/app/(drawer)/index.tsx`) - Shows anonymous status and appropriate messaging

## User Experience

### First-Time Users

1. Users see three options on the home screen:
   - Sign In (existing users)
   - Create Account (new users)
   - Continue Anonymously (try without email)

2. Choosing "Continue Anonymously":
   - Creates instant account access
   - Shows welcome message explaining anonymous mode
   - Emphasizes that data can be saved later by linking account

### Anonymous Users

Anonymous users see:
- "(Anonymous)" badge next to their name
- Prompt to sign up to save work permanently
- Full access to all app features
- No restrictions on content creation

### Account Linking

When anonymous users decide to sign up:
1. Sign-up form shows "Link Your Account" instead of "Create Account"
2. Pre-fills name with current anonymous username
3. Shows explanation about data preservation
4. On successful sign-up, displays confirmation that all data has been preserved

## Data Migration

The `onLinkAccount` callback is responsible for migrating data when linking accounts. Currently, it:

1. Logs the linking operation
2. Provides a placeholder for data migration logic

**TODO: Implement data migration for:**
- Content library (ideas, scripts, captions, saved assets)
- User profile settings (niche, voice, preferences)
- Analytics data and feedback ratings
- Any other user-specific data

## API Endpoints

Better Auth automatically handles these endpoints:

- `POST /api/auth/sign-in/anonymous` - Create anonymous session
- `GET /api/auth/get-session` - Get current session (includes `isAnonymous` field)
- `POST /api/auth/sign-up/email` - Sign up with email (triggers linking if anonymous)

## Security Considerations

- Anonymous users have temporary email addresses that are not valid for communication
- Session cookies are secure with `httpOnly`, `secure`, and `sameSite` attributes
- Anonymous accounts are automatically deleted after successful linking
- All authentication follows Better Auth's security best practices

## Testing

Anonymous authentication can be tested using the Better Auth API endpoints directly or through the mobile app interface. The test verifies:

1. Anonymous sign-in creates valid user with `isAnonymous: true`
2. Session validation works correctly
3. User data includes the anonymous flag
4. Account linking preserves data (when implemented)

## Future Enhancements

1. **Data Migration Implementation** - Complete the `onLinkAccount` callback
2. **Anonymous User Limits** - Consider usage limits for anonymous users
3. **Account Recovery** - Allow anonymous users to recover sessions if cleared
4. **Analytics Tracking** - Track anonymous user conversion rates
5. **A/B Testing** - Test different anonymous user experiences