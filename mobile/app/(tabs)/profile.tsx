import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, session, isAnonymous, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              router.replace('/(tabs)/auth');
            } else {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notAuthContainer}>
          <IconSymbol name="person.crop.circle" size={80} color={colors.tabIconDefault} />
          <ThemedText type="title" style={styles.notAuthTitle}>Not Signed In</ThemedText>
          <ThemedText style={styles.notAuthText}>
            Please sign in to view your profile
          </ThemedText>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.tint }]}
            onPress={() => router.replace('/(tabs)/auth')}
          >
            <ThemedText style={styles.signInButtonText}>Go to Sign In</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <ThemedText style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || '?'}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.name}>
            {user.name || 'Guest User'}
          </ThemedText>
          {isAnonymous && (
            <View style={[styles.anonymousBadge, { backgroundColor: colors.tint + '20' }]}>
              <ThemedText style={[styles.anonymousBadgeText, { color: colors.tint }]}>
                Anonymous Account
              </ThemedText>
            </View>
          )}
        </ThemedView>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account Information</ThemedText>

          <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault + '30' }]}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>User ID:</ThemedText>
              <ThemedText style={styles.infoValue}>{user.id}</ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.email || (isAnonymous ? 'Anonymous (No email)' : 'Not provided')}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Name:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.name || (isAnonymous ? 'Anonymous User' : 'Not provided')}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email Verified:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.emailVerified ? 'Yes' : 'No'}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Account Type:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {isAnonymous ? 'Anonymous' : 'Regular'}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Session Information</ThemedText>

          <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault + '30' }]}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Session ID:</ThemedText>
              <ThemedText style={[styles.infoValue, styles.smallText]} numberOfLines={1}>
                {session?.id || 'No active session'}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Created At:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Updated At:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Unknown'}
              </ThemedText>
            </View>
          </View>
        </View>

        {isAnonymous && (
          <View style={styles.section}>
            <View style={[styles.upgradeCard, { backgroundColor: colors.tint + '10', borderColor: colors.tint }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.tint} />
              <ThemedText style={styles.upgradeTitle}>Upgrade Your Account</ThemedText>
              <ThemedText style={styles.upgradeText}>
                You're currently using an anonymous account. Create a full account to save your progress and access all features.
              </ThemedText>
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/(tabs)/auth')}
              >
                <ThemedText style={styles.upgradeButtonText}>Create Account</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: colors.tabIconDefault + '50' }]}
            onPress={handleSignOut}
          >
            <IconSymbol name="arrow.right.square" size={20} color="#FF3B30" />
            <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notAuthTitle: {
    fontSize: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  notAuthText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 32,
  },
  signInButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '600',
    color: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  anonymousBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  anonymousBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  smallText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  upgradeCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  upgradeButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});