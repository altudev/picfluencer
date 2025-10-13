import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { useMutation, useQuery } from "@tanstack/react-query";

import { Container } from "@/components/container";
import { orpc } from "@/utils/orpc";

export default function TodosScreen() {
	const [newTodoText, setNewTodoText] = useState("");
	const { theme } = useUnistyles();

	const todos = useQuery(orpc.todo.getAll.queryOptions());
	const createMutation = useMutation(
		orpc.todo.create.mutationOptions({
			onSuccess: () => {
				todos.refetch();
				setNewTodoText("");
			},
		}),
	);
	const toggleMutation = useMutation(
		orpc.todo.toggle.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		}),
	);
	const deleteMutation = useMutation(
		orpc.todo.delete.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		}),
	);

	const handleAddTodo = () => {
		if (newTodoText.trim()) {
			createMutation.mutate({ text: newTodoText });
		}
	};

	const handleToggleTodo = (id: number, completed: boolean) => {
		toggleMutation.mutate({ id, completed: !completed });
	};

	const handleDeleteTodo = (id: number) => {
		Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => deleteMutation.mutate({ id }),
			},
		]);
	};

	const isLoading = todos.isLoading;
	const isCreating = createMutation.isPending;
	const primaryButtonTextColor = theme.colors.background;

	return (
		<Container>
			<ScrollView style={styles.scrollView}>
				<View style={styles.headerContainer}>
					<Text style={styles.headerTitle}>Todo List</Text>
					<Text style={styles.headerSubtitle}>
						Manage your tasks efficiently
					</Text>

					<View style={styles.inputContainer}>
						<TextInput
							value={newTodoText}
							onChangeText={setNewTodoText}
							placeholder="Add a new task..."
							placeholderTextColor={theme.colors.border}
							editable={!isCreating}
							style={styles.textInput}
							onSubmitEditing={handleAddTodo}
							returnKeyType="done"
						/>
						<TouchableOpacity
							onPress={handleAddTodo}
							disabled={isCreating || !newTodoText.trim()}
							style={[
								styles.addButton,
								(isCreating || !newTodoText.trim()) && styles.addButtonDisabled,
							]}
						>
							{isCreating ? (
								<ActivityIndicator
									size="small"
									color={primaryButtonTextColor}
								/>
							) : (
								<Ionicons name="add" size={24} color={primaryButtonTextColor} />
							)}
						</TouchableOpacity>
					</View>
				</View>

				{isLoading && (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={theme.colors.primary} />
						<Text style={styles.loadingText}>Loading todos...</Text>
					</View>
				)}

				{todos.data && todos.data.length === 0 && !isLoading && (
					<Text style={styles.emptyText}>No todos yet. Add one!</Text>
				)}
				{todos.data?.map(
					(todo: { id: number; text: string; completed: boolean }) => (
						<View key={todo.id} style={styles.todoItem}>
							<TouchableOpacity
								onPress={() => handleToggleTodo(todo.id, todo.completed)}
								style={styles.todoContent}
							>
								<Ionicons
									name={todo.completed ? "checkbox" : "square-outline"}
									size={24}
									color={
										todo.completed
											? theme.colors.primary
											: theme.colors.typography
									}
									style={styles.checkbox}
								/>
								<Text
									style={[
										styles.todoText,
										todo.completed && styles.todoTextCompleted,
									]}
								>
									{todo.text}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
								<Ionicons
									name="trash-outline"
									size={24}
									color={theme.colors.destructive}
								/>
							</TouchableOpacity>
						</View>
					),
				)}
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create((theme) => ({
	scrollView: {
		flex: 1,
	},
	headerContainer: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.lg,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.border,
		backgroundColor: theme.colors.background,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: theme.colors.typography,
		marginBottom: theme.spacing.sm,
	},
	headerSubtitle: {
		fontSize: 16,
		color: theme.colors.typography,
		marginBottom: theme.spacing.md,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: theme.spacing.md,
	},
	textInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderRadius: 8,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		color: theme.colors.typography,
		backgroundColor: theme.colors.background,
		marginRight: theme.spacing.sm,
		fontSize: 16,
	},
	addButton: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.sm,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	addButtonDisabled: {
		backgroundColor: theme.colors.border,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing.lg,
	},
	loadingText: {
		marginTop: theme.spacing.sm,
		fontSize: 16,
		color: theme.colors.typography,
	},
	emptyText: {
		textAlign: "center",
		marginTop: theme.spacing.xl,
		fontSize: 16,
		color: theme.colors.typography,
	},
	todoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.border,
		backgroundColor: theme.colors.background,
	},
	todoContent: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	checkbox: {
		marginRight: theme.spacing.md,
	},
	todoText: {
		fontSize: 16,
		color: theme.colors.typography,
		flex: 1,
	},
	todoTextCompleted: {
		textDecorationLine: "line-through",
		color: theme.colors.border,
	},
}));
