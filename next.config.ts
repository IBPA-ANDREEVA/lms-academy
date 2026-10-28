import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the component editor independent of an already-running section editor.
  distDir:
    process.env.COMPONENTS_BUILD_CHECK === "1"
      ? ".next-components-production"
      : process.env.NODE_ENV === "development" &&
          process.env.COMPONENTS_WORKSPACE === "1"
        ? ".next-components"
        : ".next",
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Only the Tailwind entry needs this loader. Rewriting *.module.css as
      // *.css discards Next's CSS-module class exports.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
