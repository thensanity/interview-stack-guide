/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone is for Docker/ECS — Vercel uses its own output pipeline
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  },
};

module.exports = nextConfig;
