import assert from "node:assert/strict";
import http from "node:http";
function foreignHost(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, { headers: { Host: "attacker.example:3001" } }, (r) => {
        let body = "";
        r.on("data", (chunk) => (body += chunk));
        r.on("end", () => resolve({ status: r.statusCode, body }));
      })
      .on("error", reject);
  });
}
const dev = process.env.COMPONENTS_URL || "http://127.0.0.1:3001";
const production =
  process.env.COMPONENTS_PRODUCTION_URL || "http://127.0.0.1:3002";
for (const endpoint of [
  "/dev/components",
  "/dev/components/data",
  "/dev/components/data?component=public-header&image=ref-test",
]) {
  const r = await fetch(production + endpoint);
  assert.equal(r.status, 404, endpoint);
}
assert.equal(
  (
    await fetch(production + "/dev/components/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
  ).status,
  404,
);
assert.equal((await foreignHost(dev + "/dev/components/data")).status, 403);
const deniedUI = await foreignHost(dev + "/dev/components");
// Next's streamed Suspense boundary can retain HTTP 200 while rendering notFound.
assert.ok(
  deniedUI.status === 404 ||
    deniedUI.body.includes("NEXT_HTTP_ERROR_FALLBACK;404"),
);
assert.ok(!deniedUI.body.includes("Поиск компонентов"));
assert.equal(
  (
    await fetch(dev + "/dev/components/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://attacker.example",
      },
      body: "{}",
    })
  ).status,
  403,
);
assert.equal(
  (
    await fetch(dev + "/dev/components/data", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: dev },
      body: "{}",
    })
  ).status,
  403,
);
const response = await fetch(dev + "/dev/components/data");
assert.equal(response.status, 200);
assert.equal(response.headers.get("cache-control"), "no-store");
const bundle = await response.json();
assert.ok(bundle.token);
assert.equal(bundle.pages.length, 60);
assert.ok(bundle.components.length >= 66);
assert.equal(
  (
    await fetch(
      dev + "/dev/components/data?component=..%2Foutside&image=ref-test",
    )
  ).status,
  400,
);
assert.equal(
  (
    await fetch(dev + "/dev/components/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: dev,
        "x-registry-token": bundle.token,
      },
      body: JSON.stringify({
        action: "create",
        id: "../escape",
        reviewer: "TEST",
        definition: {},
      }),
    })
  ).status,
  400,
);
console.log(
  "PASS actual HTTP: production UI/data/image/write 404 with opt-in enabled; Host, origin, CSRF, traversal blocked; dev read no-store.",
);
