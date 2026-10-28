import assert from "node:assert/strict";
const dev = process.env.SECTIONS_URL || "http://127.0.0.1:3000";
const production =
  process.env.SECTIONS_PRODUCTION_URL || "http://127.0.0.1:3001";
const endpoint = dev + "/dev/sections/data";
let r = await fetch(endpoint);
assert.equal(r.status, 200);
const bundle = await r.json();
assert.equal(bundle.pages.length, 60);
const token = bundle.token;
for (const [label, headers, body, status] of [
  [
    "missing token",
    { "Content-Type": "application/json", Origin: dev },
    "{}",
    403,
  ],
  [
    "foreign origin",
    {
      "Content-Type": "application/json",
      Origin: "http://evil.test",
      "x-planning-token": token,
    },
    "{}",
    403,
  ],
  [
    "wrong type",
    { "Content-Type": "text/plain", Origin: dev, "x-planning-token": token },
    "{}",
    415,
  ],
  [
    "malformed JSON",
    {
      "Content-Type": "application/json",
      Origin: dev,
      "x-planning-token": token,
    },
    "{",
    400,
  ],
  [
    "unknown keys",
    {
      "Content-Type": "application/json",
      Origin: dev,
      "x-planning-token": token,
    },
    '{"filename":"../../outside"}',
    400,
  ],
  [
    "oversized body",
    {
      "Content-Type": "application/json",
      Origin: dev,
      "x-planning-token": token,
    },
    "x".repeat(512001),
    413,
  ],
]) {
  r = await fetch(endpoint, { method: "POST", headers, body });
  assert.equal(r.status, status, label);
  console.log("PASS " + label + " -> " + status);
}
r = await fetch(endpoint, { headers: { "x-forwarded-host": "evil.test" } });
assert.equal(r.status, 403);
console.log("PASS forwarded host -> 403");
for (const route of ["/dev/sections", "/dev/sections/data"]) {
  r = await fetch(production + route);
  assert.equal(r.status, 404);
  console.log("PASS production GET " + route + " -> 404");
}
r = await fetch(production + "/dev/sections/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: production,
    "x-planning-token": token,
  },
  body: "{}",
});
assert.equal(r.status, 404);
console.log("PASS production POST -> 404 (server started with opt-in enabled)");
