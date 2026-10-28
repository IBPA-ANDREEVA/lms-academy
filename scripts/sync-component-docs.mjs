import { registryRuntime } from "./component-registry-runtime.mjs";
import { rm } from "node:fs/promises";
const rt = await registryRuntime();
try {
  await rt.store.syncDocs();
  console.log("Component documentation regenerated.");
} finally {
  await rm(rt.dir, { recursive: true, force: true });
}
