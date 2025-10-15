import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// Import Prisma client from the generated location
import { PrismaClient } from './generated/prisma';
import { anonymous } from 'better-auth/plugins';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-development',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Add social providers as needed
  },
  plugins: [
    anonymous({
      // Options for anonymous authentication
      emailDomainName: 'picfluencer.anon',
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // Perform actions like moving data from anonymous user to the new user
        console.log(`Linking anonymous account ${anonymousUser.id} with new user ${newUser.id}`);
      },
    })
  ]
});