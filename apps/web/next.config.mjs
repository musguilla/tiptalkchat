/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tiptalk/economy'],
  experimental: { typedRoutes: false },
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  // Standalone output produces a self-contained server in .next/standalone/
  // including only the deps actually used. Required for the minimal Docker
  // image used by Railway.
  output: 'standalone',
  // Workspace root for tracing — without this, Next can't resolve monorepo deps.
  outputFileTracingRoot: new URL('../../', import.meta.url).pathname,
  // ESLint runs separately via `pnpm lint`. Inline rule lookups (like
  // @next/next/no-img-element used in the eslint-disable-next-line comments)
  // fail here because the Next plugin isn't loaded by the root eslintrc.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
