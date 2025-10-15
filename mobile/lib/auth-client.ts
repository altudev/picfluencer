import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Platform-specific API URL detection
const getApiUrl = () => {
  // Try to get from Expo config first (using app.config.js)
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }

  // Fallback to manifest (older Expo versions)
  if (Constants.manifest?.extra?.apiUrl) {
    return Constants.manifest.extra.apiUrl;
  }

  // Platform-specific defaults for development
  const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Check if running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';

    if (Platform.OS === 'android') {
      // Android Emulator uses 10.0.2.2 to access host machine's localhost
      // Physical Android devices need the machine's actual IP
      const isEmulator = !Constants.isDevice;

      if (isEmulator) {
        return "http://10.0.2.2:3000/api/auth";
      } else {
        // For physical device, you need to set your machine's IP in .env
        console.warn("Running on physical Android device. Make sure to set API_URL in .env with your machine's IP address");
        return "http://10.0.2.2:3000/api/auth"; // Fallback, should be overridden by .env
      }
    } else if (Platform.OS === 'ios') {
      // iOS Simulator can use localhost
      return "http://localhost:3000/api/auth";
    } else {
      // Web or other platforms
      return "http://localhost:3000/api/auth";
    }
  }

  // Production default
  return "http://localhost:3000/api/auth";
};

// Log the detected API URL for debugging
const apiUrl = getApiUrl();
console.log("🔗 Auth API URL:", apiUrl);
console.log("📱 Platform:", Platform.OS);
console.log("🔧 Is Device:", Constants.isDevice);

export const authClient = createAuthClient({
  baseURL: apiUrl,

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

// Export the hooks and methods directly from authClient
export const useSession = () => authClient.useSession();

// Export auth methods
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const getSession = authClient.getSession;