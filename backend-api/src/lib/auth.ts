import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { anonymous } from "better-auth/plugins";
import { magicLink } from "better-auth/plugins";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Base configuration
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  // Email configuration (using console for development)
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can enable later
  },

  // Plugins
  plugins: [
    // Anonymous authentication for quick onboarding
    anonymous({
      emailDomainName: "picfluencer.app",
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // Here we can transfer anonymous user data to the new user
        // For example: transfer any content created while anonymous
        console.log(`Linking anonymous user ${anonymousUser.id} to ${newUser.id}`);
        // TODO: Transfer user-generated content from anonymous to new user
      },
    }),

    // Magic link authentication
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        // For development, log to console
        console.log("================================================");
        console.log("Magic Link Authentication");
        console.log("Email:", email);
        console.log("Magic Link URL:", url);
        console.log("Token:", token);
        console.log("================================================");

        // TODO: In production, send actual email using a service like:
        // - Resend
        // - SendGrid
        // - AWS SES
        // - Postmark
      },
    }),
  ],

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache for 5 minutes
    },
  },

  // Advanced configuration for cross-origin requests
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Enable if using subdomains
    },
    // For development with different ports
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
    },
  },

  // User configuration
  user: {
    modelName: "User",
    fields: {
      email: "email",
      emailVerified: "emailVerified",
      name: "name",
      image: "image",
    },
  },
});

// Export types for use in the application
export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];
export type User = Session["user"];