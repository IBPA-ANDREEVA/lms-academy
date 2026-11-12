import type { NextConfig } from "next";

const apiOrigin =
  process.env.API_INTERNAL_ORIGIN ??
  "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  distDir: process.env.LMS_BUILD_DIR || ".next",
  devIndicators: { position: "bottom-right" },
  cacheComponents: true,
  partialPrefetching: true,

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
