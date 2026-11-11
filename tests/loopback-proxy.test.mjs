import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { test } from "node:test";
import { createLoopbackProxyOptions } from "./helpers/loopback-proxy.mjs";

test("proxy rejects requests that could replace the upstream authority", () => {
  const options = createLoopbackProxyOptions("http://127.0.0.1:3117");
  for (const url of [undefined, "", "http://example.invalid/private", "//example.invalid/private",
    "/\\example.invalid/private", "\\\\example.invalid/private", "/a\r\nHost: example.invalid", "/a#fragment", "*"]) {
    assert.throws(() => options({ url, method: "GET", headers: {} }), TypeError);
  }
  for (const base of ["https://localhost", "http://example.invalid", "http://127.0.0.1.example.invalid",
    "http://user:password@localhost", "http://localhost/path", "http://localhost/?query", "http://localhost/#hash"]) {
    assert.throws(() => createLoopbackProxyOptions(base), TypeError);
  }
  assert.equal(createLoopbackProxyOptions("http://[::1]:3117")({ url: "/", headers: {} }).hostname, "::1");
});

test("proxy preserves streaming, method, body and Next query paths only to its configured upstream", async (t) => {
  const received = [];
  const upstream = http.createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    received.push({ url: request.url, host: request.headers.host, encoding: request.headers["accept-encoding"], method: request.method, body });
    response.writeHead(200, { "content-type": "text/plain" });
    response.write("shell:");
    setImmediate(() => response.end("segment"));
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");
  t.after(() => new Promise(resolve => upstream.close(resolve)));
  const origin = `http://127.0.0.1:${upstream.address().port}`;
  const options = createLoopbackProxyOptions(origin);
  const proxy = http.createServer((request, response) => {
    let target;
    try { target = options(request); } catch { response.writeHead(400).end(); return; }
    const outgoing = http.request(target, incoming => incoming.pipe(response));
    outgoing.on("error", () => response.writeHead(502).end());
    request.pipe(outgoing);
  });
  proxy.listen(0, "127.0.0.1");
  await once(proxy, "listening");
  t.after(() => new Promise(resolve => proxy.close(resolve)));
  async function send(path) {
    return new Promise((resolve, reject) => {
      const request = http.request({ hostname: "127.0.0.1", port: proxy.address().port, path, method: "POST", headers: { host: "attacker.invalid", "accept-encoding": "gzip" } }, async response => {
        let body = "";
        for await (const chunk of response) body += chunk;
        resolve({ status: response.statusCode, body });
      });
      request.on("error", reject);
      request.end("request-body");
    });
  }
  for (const path of ["/courses/course-lashes?_rsc=abc", "/_next/static/app.js", "/%2f%2fexample.invalid?next=http://example.invalid"]) {
    assert.deepEqual(await send(path), { status: 200, body: "shell:segment" });
    assert.deepEqual(received.at(-1), { url: path, host: new URL(origin).host, encoding: "identity", method: "POST", body: "request-body" });
  }
  const before = received.length;
  for (const path of ["http://example.invalid/private", "//example.invalid/private", "/\\example.invalid/private"]) {
    assert.equal((await send(path)).status, 400);
  }
  assert.equal(received.length, before, "Rejected requests must never reach an upstream");
});
