// This plugin code is sourced from https://github.com/AppAndFlow/react-native-safe-area-context/issues/424#issuecomment-3605598854,
// used to fix the CMake path-too-long issue encountered when building react-native-safe-area-context on Windows.
const { withAppBuildGradle } = require("expo/config-plugins");
const os = require("node:os");

/**
 * Expo config plugin to use a shorter CMake build path.
 * This fixes the Windows 260 character path limit issue with React Native builds.
 * Only applies on Windows.
 */
function withShortCmakePath(config) {
  // Only apply this fix on Windows
  if (os.platform() !== "win32") {
    return config;
  }

  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addShortCmakePath(
        config.modResults.contents
      );
    }

    return config;
  });
}

function addShortCmakePath(appBuildGradle) {
  // Check if already added
  if (appBuildGradle.includes("buildStagingDirectory")) {
    return appBuildGradle;
  }

  const cmakeConfig = `
    // Use shorter path for CMake build to avoid Windows 260 char path limit
    externalNativeBuild {
        cmake {
            buildStagingDirectory = file("C:/tmp/rn-cmake")
        }
    }`;

  // Find android { block and add after compileSdk line
  const pattern = /(android\s*\{[^}]*compileSdk[^\n]*\n)/;

  if (pattern.test(appBuildGradle)) {
    return appBuildGradle.replace(pattern, `$1${cmakeConfig}\n`);
  }

  return appBuildGradle;
}

module.exports = withShortCmakePath;
