

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// SDK 53 specific configurations
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false; // Try changing this to true

module.exports = withNativeWind(config, { input: './global.css' });

// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');
 
// const config = getDefaultConfig(__dirname)
// config.resolver.sourceExts.push('cjs');
// config.resolver.unstable_enablePackageExports = false;
 
// module.exports = withNativeWind(config, { input: './global.css' })
