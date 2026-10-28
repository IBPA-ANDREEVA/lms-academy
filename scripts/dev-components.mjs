import { spawn } from "node:child_process";
// Loopback binding is part of the access boundary, not an optional suggestion.
if (process.argv.slice(2).some((arg) => /hostname|host|^-H$/.test(arg)))
  throw new Error("The registry must bind to 127.0.0.1.");
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    ...process.argv.slice(2),
    "--hostname",
    "127.0.0.1",
  ],
  {
    stdio: "inherit",
    env: { ...process.env, COMPONENTS_WORKSPACE: "1", SECTIONS_WORKSPACE: "1" },
  },
);
child.on("exit", (code) => process.exit(code ?? 1));
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
