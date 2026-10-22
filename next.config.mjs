import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack is the default bundler as of Next.js 16 and does not read the
  // webpack() function below — it needs its own equivalent alias config.
  // Kept both: webpack() still applies if anyone runs `next build --webpack`.
  turbopack: {
    // Unlike webpack's resolve.alias below, Turbopack's resolveAlias rejects
    // an absolute filesystem path here (mangles it into a bogus relative
    // import) — it wants a path relative to this config file instead.
    resolveAlias: {
      "@sandhata/spectra": "./packages/spectra/src/index.js",
    },
  },
  webpack: (config) => {
    config.resolve.alias["@sandhata/spectra"] = path.resolve(
      __dirname,
      "packages/spectra/src/index.js"
    );
    return config;
  },
};

export default nextConfig;
