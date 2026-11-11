/** Request options for local browser-test proxies; never derive the upstream host from a request. */
export function createLoopbackProxyOptions(base) {
  const upstream = new URL(base);
  if (upstream.protocol !== "http:" ||
      !["localhost", "127.0.0.1", "[::1]"].includes(upstream.hostname) ||
      upstream.username || upstream.password || upstream.pathname !== "/" ||
      upstream.search || upstream.hash) {
    throw new TypeError("FRONTEND_URL must be a loopback HTTP origin.");
  }
  // Node's hostname option uses an unbracketed IPv6 address.
  const hostname = upstream.hostname === "[::1]" ? "::1" : upstream.hostname;
  return (request) => {
    const path = request.url;
    // Accept origin-form only. In particular, //host and absolute URLs cannot
    // override the configured origin as they could with new URL(path, base).
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//") ||
        /[\\\s#]/u.test(path)) {
      throw new TypeError("Test proxy requires an origin-form request path.");
    }
    return {
      protocol: "http:",
      hostname,
      port: upstream.port || "80",
      path,
      method: request.method,
      headers: { ...request.headers, host: upstream.host, "accept-encoding": "identity" },
    };
  };
}
