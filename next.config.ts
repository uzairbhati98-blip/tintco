import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // Temporarily ignore build errors (we'll fix them properly later)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, // Keep this to catch real errors
  },
};

export default nextConfig;