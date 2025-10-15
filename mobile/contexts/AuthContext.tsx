import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authClient, authHelpers, type User, type Session } from "@/lib/auth-client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAnonymous: boolean;
  signInAnonymously: () => Promise<any>;
  sendMagicLink: (email: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check and refresh session
  const refreshSession = async () => {
    try {
      const currentSession = await authHelpers.getCurrentSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setUser(null);
      setSession(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const initAuth = async () => {
      setIsLoading(true);
      try {
        await refreshSession();
      } catch (error) {
        console.log("Initial session refresh failed, user not logged in");
      } finally {
        setIsLoading(false);
      }

      // Only set up refresh interval after initial load
      interval = setInterval(refreshSession, 5 * 60 * 1000);
    };

    initAuth();

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = authClient.subscribe((newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    // Ensure we return a cleanup function, not a Promise
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    isAnonymous: authHelpers.isAnonymous(user),

    signInAnonymously: async () => {
      setIsLoading(true);
      const result = await authHelpers.signInAnonymously();
      if (result.success) {
        await refreshSession();
      }
      setIsLoading(false);
      return result;
    },

    sendMagicLink: async (email: string) => {
      setIsLoading(true);
      const result = await authHelpers.sendMagicLink(email);
      setIsLoading(false);
      return result;
    },

    signUpWithEmail: async (email: string, password: string, name?: string) => {
      setIsLoading(true);
      const result = await authHelpers.signUpWithEmail(email, password, name);
      if (result.success) {
        await refreshSession();
      }
      setIsLoading(false);
      return result;
    },

    signInWithEmail: async (email: string, password: string) => {
      setIsLoading(true);
      const result = await authHelpers.signInWithEmail(email, password);
      if (result.success) {
        await refreshSession();
      }
      setIsLoading(false);
      return result;
    },

    signOut: async () => {
      setIsLoading(true);
      const result = await authHelpers.signOut();
      if (result.success) {
        setUser(null);
        setSession(null);
      }
      setIsLoading(false);
      return result;
    },

    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Optional: Auth guard component
interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireVerified?: boolean;
  allowAnonymous?: boolean;
}

export function AuthGuard({
  children,
  fallback = null,
  requireVerified = false,
  allowAnonymous = false
}: AuthGuardProps) {
  const { user, isLoading, isAnonymous } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  if (isAnonymous && !allowAnonymous) {
    return <>{fallback}</>;
  }

  if (requireVerified && !user.emailVerified) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}