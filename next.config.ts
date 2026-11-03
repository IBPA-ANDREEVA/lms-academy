import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isolated build directories let verification leave the owner's dev server running.
  distDir: process.env.LMS_BUILD_DIR || ".next",
  devIndicators: { position: "bottom-right" },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
