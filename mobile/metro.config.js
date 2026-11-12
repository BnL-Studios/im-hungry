
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Support SQLite WebAssembly.
if (!config.resolver.assetExts.includes("wasm")) {
  config.resolver.assetExts.push("wasm");
}

// Support Drizzle's generated SQL migration imports.
if (!config.resolver.sourceExts.includes("sql")) {
  config.resolver.sourceExts.push("sql");
}

// Enable SharedArrayBuffer for SQLite on web.
const originalEnhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, metroServer) => {
  const enhancedMiddleware = originalEnhanceMiddleware
    ? originalEnhanceMiddleware(middleware, metroServer)
    : middleware;

  return (req, res, next) => {
    res.setHeader(
      "Cross-Origin-Embedder-Policy",
      "credentialless"
    );
    res.setHeader(
      "Cross-Origin-Opener-Policy",
      "same-origin"
    );

    return enhancedMiddleware(req, res, next);
  };
};

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
