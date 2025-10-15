import { expo } from '@better-auth/expo';
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@picfluencer/db";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || "", "mybettertapp://", "exp://"],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [
		expo(),
		anonymous({
			emailDomainName: "picfluencer.app",
			onLinkAccount: async ({ anonymousUser, newUser }) => {
				// Migrate all user data from anonymous to new account
				// This will include:
				// - Content library (ideas, scripts, captions, saved assets)
				// - Profile settings (niche, voice, preferences)
				// - Analytics data and feedback ratings
				
				// TODO: Implement data migration logic here
				// This will need to be updated once we have the actual data models
				// for content, profiles, and analytics
				
				console.log(`Linking anonymous user ${anonymousUser.id} to new user ${newUser.id}`);
				
				// Example of what the migration might look like:
				// await prisma.content.updateMany({
				//   where: { userId: anonymousUser.id },
				//   data: { userId: newUser.id }
				// });
				//
				// await prisma.userProfile.updateMany({
				//   where: { userId: anonymousUser.id },
				//   data: { userId: newUser.id }
				// });
				//
				// await prisma.analytics.updateMany({
				//   where: { userId: anonymousUser.id },
				//   data: { userId: newUser.id }
				// });
			},
			disableDeleteAnonymousUser: false, // Delete anonymous user after linking
			generateName: () => {
				// Generate a random name for anonymous users
				const adjectives = ["Creative", "Inspired", "Talented", "Artistic", "Innovative"];
				const nouns = ["Creator", "Artist", "Influencer", "Visionary", "Storyteller"];
				const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
				const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
				return `${randomAdjective} ${randomNoun}`;
			}
		})
	]
});
