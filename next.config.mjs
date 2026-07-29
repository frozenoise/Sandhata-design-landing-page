import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@sandhata/spectra"] = path.resolve(
      __dirname,
      "packages/spectra/src/index.js"
    );
    return config;
  },
};

export default nextConfig;
