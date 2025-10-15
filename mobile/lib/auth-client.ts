import { createAuthClient } from 'better-auth/client';
import { anonymousClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [
    anonymousClient()
  ]
});

export const { signIn, signUp, useSession, signOut } = authClient;