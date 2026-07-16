import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Brand logos render at quality 95 (crisp raster — see DESIGN.md). Next 16
    // defaults images.qualities to [75], so 95 must be allow-listed.
    qualities: [75, 95],
  },
};

export default nextConfig;
