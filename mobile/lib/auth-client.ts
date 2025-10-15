import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Get the API URL from environment or use localhost
const getApiUrl = () => {
  // Try to get from Expo config first (using app.config.js)
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }

  // Fallback to manifest (older Expo versions)
  if (Constants.manifest?.extra?.apiUrl) {
    return Constants.manifest.extra.apiUrl;
  }

  // Default to localhost for development
  // Note: Use your machine's IP address instead of localhost for physical devices
  // For iOS Simulator: localhost works fine
  // For Android Emulator: Use 10.0.2.2:3000
  // For Physical devices: Use your machine's IP address
  return "http://localhost:3000/api/auth";
};

export const authClient = createAuthClient({
  baseURL: getApiUrl(),

  plugins: [
    // Expo plugin for mobile support
    expoClient({
      scheme: "picfluencer", // Your app's scheme for deep linking
      storagePrefix: "picfluencer", // Prefix for secure storage keys
      storage: SecureStore, // Secure storage for session data
    }),

    // Enable anonymous authentication
    anonymousClient(),

    // Enable magic link authentication
    magicLinkClient(),
  ],

  // Configure fetch options for mobile
  fetchOptions: {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  },
});

// Export specific methods for easier use
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateUser,
  deleteUser,
  listSessions,
  revokeSession,
  revokeSessions,
  revokeOtherSessions,
  linkSocial,
  unlinkSocial,
} = authClient;

// Helper functions for auth flows
export const authHelpers = {
  // Sign in anonymously for quick onboarding
  signInAnonymously: async () => {
    try {
      const result = await authClient.signIn.anonymous();
      return { success: true, data: result };
    } catch (error) {
      console.error("Anonymous sign in error:", error);
      return { success: false, error };
    }
  },

  // Send magic link to email
  sendMagicLink: async (email: string) => {
    try {
      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: `${getApiUrl()}/magic-link/verify`,
      });
      return { success: true, data: result };
    } catch (error) {
      console.error("Magic link error:", error);
      return { success: false, error };
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, name?: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });
      return { success: true, data: result };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error };
    }
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });
      return { success: true, data: result };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error };
    }
  },

  // Check if user is anonymous
  isAnonymous: (user: any) => {
    return user?.isAnonymous === true;
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      const session = await authClient.getSession();
      return session;
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await authClient.signOut();
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { success: false, error };
    }
  },
};

// Type exports
export type Session = Awaited<ReturnType<typeof authClient.getSession>>;
export type User = Session extends { user: infer U } ? U : never;