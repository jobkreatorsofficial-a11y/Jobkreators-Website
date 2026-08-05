import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Brand logos render at quality 95 (crisp raster — see DESIGN.md). Next 16
    // defaults images.qualities to [75], so 95 must be allow-listed.
    qualities: [75, 95],
  },
  // The old employer form at /submit-role is superseded by
  // /for-employers/submit-role. Keep external links (email signatures, prior
  // shares, indexed URLs) working with a permanent 301.
  async redirects() {
    return [
      {
        source: "/submit-role",
        destination: "/for-employers/submit-role",
        statusCode: 301,
      },
    ];
  },
  // Belt-and-suspenders noindex for the (formerly public) admin portal, on top of
  // the layout's robots metadata — search engines must never crawl it.
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
