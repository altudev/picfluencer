// Dynamic configuration for Expo with environment variable support
// This file allows us to use environment variables in the Expo configuration

// Load environment variables
const loadEnv = () => {
  try {
    // In development, we can use dotenv
    require('dotenv').config();
    return process.env;
  } catch {
    // In production builds, use EAS Build environment variables
    return process.env;
  }
};

const env = loadEnv();

// Helper to get environment variable with fallback
const getEnvVar = (key, fallback) => {
  return env[key] || fallback;
};

module.exports = {
  expo: {
    name: getEnvVar('APP_NAME', 'Picfluencer'),
    slug: 'picfluencer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: getEnvVar('APP_SCHEME', 'picfluencer'),
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    // Splash screen configuration
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },

    // iOS specific configuration
    ios: {
      supportsTablet: true,
      bundleIdentifier: getEnvVar('IOS_BUNDLE_ID', 'com.picfluencer.app'),
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        NSCameraUsageDescription: 'This app uses the camera to capture content for your posts.',
        NSPhotoLibraryUsageDescription: 'This app accesses your photo library to select content for your posts.',
        NSMicrophoneUsageDescription: 'This app uses the microphone to record audio for your video content.'
      }
    },

    // Android specific configuration
    android: {
      package: getEnvVar('ANDROID_PACKAGE_NAME', 'com.picfluencer.app'),
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'RECORD_AUDIO'
      ],
      edgeToEdgeEnabled: true
    },

    // Web configuration
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },

    // Plugins configuration
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ]
    ],

    // Experiments
    experiments: {
      typedRoutes: true
    },

    // Extra fields for runtime configuration
    // These can be accessed via Constants.expoConfig.extra
    extra: {
      // API Configuration
      apiUrl: getEnvVar('API_URL', 'http://localhost:3000/api/auth'),
      apiBaseUrl: getEnvVar('API_BASE_URL', 'http://localhost:3000'),

      // Environment
      appEnv: getEnvVar('APP_ENV', 'development'),

      // Feature flags
      features: {
        anonymousAuth: getEnvVar('ENABLE_ANONYMOUS_AUTH', 'true') === 'true',
        magicLink: getEnvVar('ENABLE_MAGIC_LINK', 'true') === 'true',
        socialAuth: getEnvVar('ENABLE_SOCIAL_AUTH', 'false') === 'true',
        biometricAuth: getEnvVar('ENABLE_BIOMETRIC_AUTH', 'false') === 'true',
        aiFeatures: getEnvVar('ENABLE_AI_FEATURES', 'false') === 'true'
      },

      // Analytics (optional)
      analytics: {
        segmentWriteKey: getEnvVar('SEGMENT_WRITE_KEY', ''),
        amplitudeApiKey: getEnvVar('AMPLITUDE_API_KEY', ''),
        mixpanelToken: getEnvVar('MIXPANEL_TOKEN', ''),
        posthogApiKey: getEnvVar('POSTHOG_API_KEY', ''),
        posthogHost: getEnvVar('POSTHOG_HOST', 'https://app.posthog.com')
      },

      // Error tracking (optional)
      errorTracking: {
        sentryDsn: getEnvVar('SENTRY_DSN', ''),
        sentryEnv: getEnvVar('SENTRY_ENV', 'development'),
        bugsnagApiKey: getEnvVar('BUGSNAG_API_KEY', '')
      },

      // Legal
      legal: {
        termsUrl: getEnvVar('TERMS_OF_SERVICE_URL', 'https://picfluencer.app/terms'),
        privacyUrl: getEnvVar('PRIVACY_POLICY_URL', 'https://picfluencer.app/privacy'),
        supportEmail: getEnvVar('SUPPORT_EMAIL', 'support@picfluencer.app')
      },

      // EAS Build configuration
      eas: {
        projectId: getEnvVar('EAS_PROJECT_ID', '')
      }
    },

    // Updates configuration (for OTA updates)
    updates: {
      fallbackToCacheTimeout: 0,
      url: getEnvVar('EAS_UPDATE_URL', ''),
      enabled: getEnvVar('APP_ENV', 'development') !== 'development'
    },

    // Runtime version for EAS Update
    runtimeVersion: {
      policy: 'appVersion'
    }
  }
};