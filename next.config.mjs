/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The design-system primitives live in /components as .jsx with sibling .d.ts.
  // transpilePackages not needed since they're local source imported directly.
};

export default nextConfig;
