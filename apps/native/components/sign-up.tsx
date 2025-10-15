import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";
import { isCurrentUserAnonymous, linkAnonymousToEmail } from "@/utils/auth-helpers";
import { useState, useEffect } from "react";
import {
	ActivityIndicator,
	Alert,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAnonymousUser, setIsAnonymousUser] = useState(false);

	// Check if current user is anonymous when component mounts
	useEffect(() => {
		const checkAnonymousStatus = async () => {
			try {
				const anonymous = await isCurrentUserAnonymous();
				setIsAnonymousUser(anonymous);
				if (anonymous) {
					// Pre-fill name with anonymous user's current name if available
					const session = await authClient.getSession();
					const currentName = session.data?.user?.name;
					if (currentName) {
						setName(currentName);
					}
				}
			} catch (error) {
				console.error('Error checking anonymous status:', error);
			}
		};

		checkAnonymousStatus();
	}, []);

	const handleSignUp = async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (isAnonymousUser) {
				// Link anonymous account to new email account
				await linkAnonymousToEmail(email, password, name);
				Alert.alert(
					"Account Linked!",
					"Your anonymous account has been successfully linked to your email. All your data has been preserved.",
					[{ text: "OK" }]
				);
			} else {
				// Normal sign up flow
				await authClient.signUp.email(
					{
						name,
						email,
						password,
					},
					{
						onError: (error) => {
							setError(error.error?.message || "Failed to sign up");
							setIsLoading(false);
						},
						onSuccess: () => {
							Alert.alert(
								"Account Created!",
								"Your account has been successfully created.",
								[{ text: "OK" }]
							);
						},
						onFinished: () => {
							setIsLoading(false);
						},
					},
				);
			}

			// Reset form and refresh queries on success
			setName("");
			setEmail("");
			setPassword("");
			queryClient.refetchQueries();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Failed to sign up");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{isAnonymousUser ? "Link Your Account" : "Create Account"}
			</Text>
			{isAnonymousUser && (
				<Text style={styles.subtitle}>
					Link your anonymous session to an email account to save your progress
				</Text>
			)}

			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

			<TextInput
				style={styles.input}
				placeholder="Name"
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<TextInput
				style={styles.inputLast}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<TouchableOpacity
				onPress={handleSignUp}
				disabled={isLoading}
				style={styles.button}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="#fff" />
				) : (
					<Text style={styles.buttonText}>Sign Up</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		marginTop: 24,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: theme.colors.typography,
		marginBottom: 16,
	},
	subtitle: {
		fontSize: 14,
		color: theme.colors.typography,
		marginBottom: 16,
		textAlign: "center",
	},
	errorContainer: {
		marginBottom: 16,
		padding: 12,
		borderRadius: 6,
	},
	errorText: {
		color: theme.colors.destructive,
		fontSize: 14,
	},
	input: {
		marginBottom: 12,
		padding: 16,
		borderRadius: 6,
		color: theme.colors.typography,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	inputLast: {
		marginBottom: 16,
		padding: 16,
		borderRadius: 6,
		color: theme.colors.typography,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	button: {
		backgroundColor: theme.colors.primary,
		padding: 16,
		borderRadius: 6,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		fontWeight: "500",
	},
}));
