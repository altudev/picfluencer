import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { signIn, signUp, useSession } from '@/lib/auth-client';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: session } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to profile if already signed in
  useEffect(() => {
    if (session?.user) {
      router.replace('/(tabs)/profile');
    }
  }, [session]);

  // Show loading while checking auth status on first load
  if (session === undefined) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.anonymous();
      Alert.alert('Success', 'Signed in anonymously! You can start using the app immediately.');
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      Alert.alert('Error', 'Failed to sign in anonymously. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      if (isMagicLink) {
        await signIn.magicLink({
          email,
          callbackURL: "picfluencer://auth-callback"
        });
        Alert.alert('Success', 'Magic link sent! Check your email to continue.');
      } else if (isSignUp) {
        if (!password || !name) {
          Alert.alert('Error', 'Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        await signUp.email({
          email,
          password,
          name,
        });
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/(tabs)/profile');
      } else {
        if (!password) {
          Alert.alert('Error', 'Please enter your password.');
          setIsLoading(false);
          return;
        }
        await signIn.email({
          email,
          password,
        });
        Alert.alert('Success', 'Signed in successfully!');
        router.replace('/(tabs)/profile');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error?.message?.includes('Invalid')) {
        Alert.alert('Error', 'Invalid email or password.');
      } else {
        Alert.alert('Error', 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>Welcome to Picfluencer</ThemedText>
            <ThemedText style={styles.subtitle}>
              Get started quickly with anonymous sign-in or create an account
            </ThemedText>
          </ThemedView>

          <View style={styles.anonymousSection}>
            <ThemedText style={styles.sectionTitle}>Quick Start</ThemedText>
            <TouchableOpacity
              style={[styles.anonymousButton, { backgroundColor: colors.tint }]}
              onPress={handleAnonymousSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.anonymousButtonText}>
                  Continue as Guest
                </ThemedText>
              )}
            </TouchableOpacity>
            <ThemedText style={styles.anonymousNote}>
              No sign-up required. Your data will be saved and you can create an account later.
            </ThemedText>
          </View>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.tabIconDefault }]} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: colors.tabIconDefault }]} />
          </View>

          <View style={styles.authSection}>
            <ThemedText style={styles.sectionTitle}>
              {isMagicLink ? 'Magic Link Sign In' : isSignUp ? 'Create Account' : 'Sign In'}
            </ThemedText>

            {isSignUp && (
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.tabIconDefault
                }]}
                placeholder="Name"
                placeholderTextColor={colors.tabIconDefault}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <TextInput
              style={[styles.input, {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.tabIconDefault
              }]}
              placeholder="Email"
              placeholderTextColor={colors.tabIconDefault}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!isMagicLink && (
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.tabIconDefault
                }]}
                placeholder="Password"
                placeholderTextColor={colors.tabIconDefault}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            )}

            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: colors.tint }]}
              onPress={handleEmailAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.authButtonText}>
                  {isMagicLink ? 'Send Magic Link' : isSignUp ? 'Create Account' : 'Sign In'}
                </ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              {!isMagicLink && (
                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                  <ThemedText style={styles.switchText}>
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </ThemedText>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setIsMagicLink(!isMagicLink)}>
                <ThemedText style={[styles.switchText, { marginTop: 12 }]}>
                  {isMagicLink ? 'Use password instead' : 'Sign in with magic link'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  anonymousSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  anonymousButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  anonymousButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  anonymousNote: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.5,
  },
  authSection: {
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});