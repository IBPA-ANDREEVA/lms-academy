import "server-only";

// Explicit opt-in only. Pass the boolean, never process.env, to client providers.
export const testPreview = process.env.TEST_PREVIEW === "true";

export function siteOrigin(): string | undefined {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
      ["localhost", "127.0.0.1"].includes(url.hostname)) return undefined;
    return url.origin;
  } catch { return undefined; }
}
