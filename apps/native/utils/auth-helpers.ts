import { authClient } from '../lib/auth-client';

/**
 * Sign in as an anonymous user
 * This allows users to use the app without providing personal information
 * and later link their account when they're ready to sign up
 */
export const signInAnonymously = async () => {
	try {
		const result = await authClient.signIn.anonymous();
		if (result.error) {
			throw new Error(result.error.message || 'Failed to sign in anonymously');
		}
		return result.data;
	} catch (error) {
		console.error('Anonymous sign-in error:', error);
		throw error;
	}
};

/**
 * Check if the current user is anonymous
 */
export const isCurrentUserAnonymous = async () => {
	try {
		const session = await authClient.getSession();
		return session.data?.user?.isAnonymous || false;
	} catch (error) {
		console.error('Error checking user anonymity:', error);
		return false;
	}
};

/**
 * Link an anonymous account to an email account
 * This is called when an anonymous user decides to sign up with email
 * All their data will be migrated to the new account
 */
export const linkAnonymousToEmail = async (email: string, password: string, name?: string) => {
	try {
		// First check if current user is anonymous
		const isAnonymous = await isCurrentUserAnonymous();
		
		if (!isAnonymous) {
			throw new Error('Current user is not anonymous');
		}

		// Get current anonymous user to preserve their generated name if no name provided
		const session = await authClient.getSession();
		const anonymousName = session.data?.user?.name || "Creator";

		// Sign up with email - this will automatically trigger the onLinkAccount callback
		const result = await authClient.signUp.email({
			email,
			password,
			name: name || anonymousName,
		});

		if (result.error) {
			throw new Error(result.error.message || 'Failed to link account');
		}

		return result.data;
	} catch (error) {
		console.error('Account linking error:', error);
		throw error;
	}
};

/**
 * Sign in with email and automatically link if current user is anonymous
 */
export const signInWithEmail = async (email: string, password: string) => {
	try {
		// Check if current user is anonymous
		const isAnonymous = await isCurrentUserAnonymous();
		
		if (isAnonymous) {
			// If anonymous, we need to handle this differently
			// Better Auth will automatically link the accounts during sign in
			console.log('Anonymous user detected, will link accounts during sign in');
		}

		const result = await authClient.signIn.email({
			email,
			password,
		});

		if (result.error) {
			throw new Error(result.error.message || 'Failed to sign in');
		}

		return result.data;
	} catch (error) {
		console.error('Email sign-in error:', error);
		throw error;
	}
};