import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  allowedDevOrigins: ['192.168.43.68'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10MB',
    },
    proxyClientMaxBodySize: '10MB',
  },
};

export default nextConfig;
