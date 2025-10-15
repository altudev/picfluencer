const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Enable unstable_enablePackageExports to resolve Better Auth exports
config.resolver.unstable_enablePackageExports = true;

module.exports = config;