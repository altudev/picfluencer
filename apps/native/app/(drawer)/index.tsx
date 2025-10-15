import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { AnonymousSignIn } from "@/components/anonymous-sign-in";
import { queryClient, orpc } from "@/utils/orpc";

export default function Home() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());
	const privateData = useQuery(orpc.privateData.queryOptions());
	const { data: session } = authClient.useSession();

	return (
		<Container>
			<ScrollView>
				<View style={styles.pageContainer}>
					<Text style={styles.headerTitle}>Picfluencer</Text>
					{session?.user ? (
						<View style={styles.sessionInfoCard}>
							<View style={styles.sessionUserRow}>
								<Text style={styles.welcomeText}>
									Welcome,{" "}
									<Text style={styles.userNameText}>{session.user.name}</Text>
									{session.user.isAnonymous && (
										<Text style={styles.anonymousBadge}> (Anonymous)</Text>
									)}
								</Text>
							</View>
							<Text style={styles.emailText}>{session.user.email}</Text>
							{session.user.isAnonymous && (
								<Text style={styles.anonymousNote}>
									You're using the app anonymously. Sign up to save your work permanently!
								</Text>
							)}

							<TouchableOpacity
								style={styles.signOutButton}
								onPress={() => {
									authClient.signOut();
									queryClient.invalidateQueries();
								}}
							>
								<Text style={styles.signOutButtonText}>Sign Out</Text>
							</TouchableOpacity>
						</View>
					) : null}
					<View style={styles.apiStatusCard}>
						<Text style={styles.cardTitle}>API Status</Text>
						<View style={styles.apiStatusRow}>
							<View
								style={[
									styles.statusIndicatorDot,
									healthCheck.data
										? styles.statusIndicatorGreen
										: styles.statusIndicatorRed,
								]}
							/>
							<Text style={styles.mutedText}>
								{healthCheck.isLoading
									? "Checking..."
									: healthCheck.data
										? "Connected to API"
										: "API Disconnected"}
							</Text>
						</View>
					</View>
					<View style={styles.privateDataCard}>
						<Text style={styles.cardTitle}>Private Data</Text>
						{privateData && (
							<View>
								<Text style={styles.mutedText}>
									{privateData.data?.message}
								</Text>
							</View>
						)}
					</View>
					{!session?.user && (
						<>
							<SignIn />
							<SignUp />
							<AnonymousSignIn />
						</>
					)}
				</View>
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create((theme) => ({
	pageContainer: {
		paddingHorizontal: 8,
	},
	headerTitle: {
		color: theme?.colors?.typography,
		fontSize: 30,
		fontWeight: "bold",
		marginBottom: 16,
	},
	sessionInfoCard: {
		marginBottom: 24,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme?.colors?.border,
	},
	sessionUserRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	welcomeText: {
		color: theme?.colors?.typography,
		fontSize: 16,
	},
	userNameText: {
		fontWeight: "500",
		color: theme?.colors?.typography,
	},
	anonymousBadge: {
		fontSize: 12,
		color: theme?.colors?.primary,
		fontStyle: "italic",
	},
	emailText: {
		color: theme?.colors?.typography,
		fontSize: 14,
		marginBottom: 8,
	},
	anonymousNote: {
		color: theme?.colors?.primary,
		fontSize: 12,
		marginBottom: 16,
		textAlign: "center",
		fontStyle: "italic",
	},
	signOutButton: {
		backgroundColor: theme?.colors?.destructive,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 6,
		alignSelf: "flex-start",
	},
	signOutButtonText: {
		fontWeight: "500",
	},
	apiStatusCard: {
		marginBottom: 24,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme?.colors?.border,
		padding: 16,
	},
	cardTitle: {
		marginBottom: 12,
		fontWeight: "500",
		color: theme?.colors?.typography,
	},
	apiStatusRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	statusIndicatorDot: {
		height: 12,
		width: 12,
		borderRadius: 9999,
	},
	statusIndicatorGreen: {
		backgroundColor: theme.colors.success,
	},
	statusIndicatorRed: {
		backgroundColor: theme.colors.destructive,
	},
	mutedText: {
		color: theme?.colors?.typography,
	},
	privateDataCard: {
		marginBottom: 24,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme?.colors?.border,
		padding: 16,
	},
}));
