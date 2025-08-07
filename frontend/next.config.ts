import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_FRONTEND_PORT: process.env.NEXT_PUBLIC_FRONTEND_PORT || '3000',
  },
  // Optional: Configure server port
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
