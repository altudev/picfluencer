import { signInAnonymously } from "@/utils/auth-helpers";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export function AnonymousSignIn() {
	const [isLoading, setIsLoading] = useState(false);

	const handleAnonymousSignIn = async () => {
		setIsLoading(true);

		try {
			await signInAnonymously();
			Alert.alert(
				"Welcome!",
				"You're now using Picfluencer anonymously. You can create content and explore all features. When you're ready, link your account to save your progress permanently.",
				[{ text: "Get Started" }]
			);
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error ? error.message : "Failed to sign in anonymously"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Try Without Signing Up</Text>
			<Text style={styles.subtitle}>
				Start creating content immediately without providing an email address
			</Text>
			
			<TouchableOpacity
				onPress={handleAnonymousSignIn}
				disabled={isLoading}
				style={styles.anonymousButton}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="#666" />
				) : (
					<Text style={styles.anonymousButtonText}>Continue Anonymously</Text>
				)}
			</TouchableOpacity>
			
			<Text style={styles.note}>
				You can always link your account later to save your work
			</Text>
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
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: theme.colors.typography,
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: theme.colors.typography,
		marginBottom: 20,
		textAlign: "center",
		lineHeight: 20,
	},
	anonymousButton: {
		backgroundColor: "transparent",
		padding: 16,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: theme.colors.border,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		marginBottom: 12,
	},
	anonymousButtonText: {
		fontWeight: "500",
		color: theme.colors.typography,
	},
	note: {
		fontSize: 12,
		color: theme.colors.typography,
		textAlign: "center",
		opacity: 0.7,
	},
}));