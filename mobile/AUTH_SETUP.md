# Expo Authentication Setup with Better Auth

This document describes the authentication implementation for the Picfluencer mobile app using Better Auth with Expo.

## Features Implemented

✅ **Anonymous Authentication** - Users can start using the app immediately without creating an account
✅ **Email/Password Authentication** - Traditional sign-up and sign-in flow
✅ **Magic Link Authentication** - Passwordless authentication via email
✅ **Expo Plugin Integration** - Secure session management with expo-secure-store
✅ **Profile Management** - View user data and session information
✅ **Auth Context** - Centralized authentication state management

## Setup Complete

### 1. Dependencies Installed
- `@better-auth/expo` - Better Auth Expo integration
- `expo-secure-store` - Secure storage for session data
- `expo-linking` - Deep linking support
- `expo-web-browser` - OAuth browser support
- `expo-constants` - Access to app configuration

### 2. Backend Configuration
- Added Expo plugin to Better Auth configuration
- Configured trusted origins for deep linking (`picfluencer://`)
- Set up CORS for mobile/web clients

### 3. Mobile Client Configuration
- Created auth client with Expo plugin (`/lib/auth-client.ts`)
- Implemented auth context provider (`/contexts/AuthContext.tsx`)
- Configured Metro bundler for Better Auth package exports
- Updated app scheme to `picfluencer` in `app.json`

### 4. UI Components Created
- **Auth Screen** (`/app/(tabs)/auth.tsx`)
  - Anonymous sign-in button (guest mode)
  - Email/password sign-in and sign-up forms
  - Magic link authentication option
  - Toggle between sign-in/sign-up modes

- **Profile Screen** (`/app/(tabs)/profile.tsx`)
  - Display user information (ID, email, name, verification status)
  - Show session details
  - Anonymous account badge and upgrade prompt
  - Sign out functionality

## Testing Instructions

### Prerequisites

1. **Start PostgreSQL database:**
   ```bash
   docker start postgres_db
   ```

2. **Apply database migrations (if not already done):**
   ```bash
   cd /picfluencer/backend-api
   bunx prisma migrate dev
   ```

3. **Start the backend server:**
   ```bash
   cd /picfluencer/backend-api
   bun run dev
   # Server runs on http://localhost:3000
   ```

### Running the Mobile App

1. **Start Expo development server:**
   ```bash
   cd /picfluencer/mobile
   bun start
   ```

2. **Choose your platform:**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser
   - Scan QR code with Expo Go app for physical device

### Testing Anonymous Authentication

1. Open the app and navigate to the **Sign In** tab
2. Click **"Continue as Guest"** button
3. You'll be signed in anonymously and redirected to the Profile tab
4. Verify the profile shows:
   - User ID (auto-generated)
   - "Anonymous Account" badge
   - Account Type: Anonymous
   - Upgrade account prompt

### Testing Email/Password Authentication

1. Navigate to the **Sign In** tab
2. Click "Don't have an account? Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click **"Create Account"**
5. Verify redirect to Profile tab with user details

### Testing Magic Link Authentication

1. Navigate to the **Sign In** tab
2. Click "Sign in with magic link"
3. Enter email address
4. Click **"Send Magic Link"**
5. Check backend console for the magic link URL (in development)
6. In production, this would send an actual email

### Important Notes for Different Environments

#### iOS Simulator
- Use `http://localhost:3000` as the API URL
- Works out of the box

#### Android Emulator
- Change `localhost` to `10.0.2.2` in `/lib/auth-client.ts`
- Example: `http://10.0.2.2:3000/api/auth`

#### Physical Device
- Find your machine's IP address:
  - Mac: `ifconfig | grep "inet "`
  - Windows: `ipconfig`
  - Linux: `ip addr show`
- Update the API URL in `/lib/auth-client.ts` to your IP
- Example: `http://192.168.1.100:3000/api/auth`
- Ensure your device is on the same network

## API Endpoints Used

- `POST /api/auth/sign-in/anonymous` - Anonymous authentication
- `POST /api/auth/sign-up/email` - Email/password registration
- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-in/magic-link` - Send magic link
- `GET /api/auth/session` - Get current session
- `POST /api/auth/sign-out` - Sign out user

## Security Features

- Session data stored securely using `expo-secure-store`
- Cookies managed automatically by the Expo plugin
- CSRF protection handled by Better Auth
- Anonymous accounts can be upgraded to full accounts later

## Next Steps

- [ ] Implement social authentication (Google, Apple)
- [ ] Add email verification flow
- [ ] Implement account linking for anonymous users
- [ ] Add password reset functionality
- [ ] Implement biometric authentication
- [ ] Add session management (view/revoke other sessions)

## Troubleshooting

### "Network request failed" error
- Ensure backend is running on port 3000
- Check API URL configuration for your environment
- Verify PostgreSQL is running

### Session not persisting
- Check that expo-secure-store is properly installed
- Verify the Expo plugin is configured in auth client
- Clear app data and try again

### Anonymous sign-in not working
- Ensure anonymous plugin is enabled in backend auth config
- Check that database migrations have been applied
- Verify Prisma client is generated

### Metro bundler errors
- Clear Metro cache: `npx expo start --clear`
- Ensure `unstable_enablePackageExports` is enabled in metro.config.js
- Restart the Expo development server