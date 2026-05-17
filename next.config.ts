import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
