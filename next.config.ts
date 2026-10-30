import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: ".next-auth-check",
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
