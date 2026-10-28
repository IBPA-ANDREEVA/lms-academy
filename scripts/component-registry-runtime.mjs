import ts from "typescript";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
// Compile the actual dependency-free Node layer for scripts/tests without adding a runtime dependency.
export async function registryRuntime() {
  const dir = await mkdtemp(path.join(tmpdir(), "lms-registry-runtime-"));
  for (const name of ["model", "validation", "access", "store", "server"]) {
    const source = await readFile(
      `src/features/component-registry/${name}.ts`,
      "utf8",
    );
    const out = ts
      .transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      })
      .outputText.replace(/from (["'])(\.\/[^"']+)\1/g, 'from "$2.mjs"');
    await writeFile(path.join(dir, `${name}.mjs`), out);
  }
  return {
    dir,
    store: await import(pathToFileURL(path.join(dir, "store.mjs")).href),
    validation: await import(
      pathToFileURL(path.join(dir, "validation.mjs")).href
    ),
    model: await import(pathToFileURL(path.join(dir, "model.mjs")).href),
    server: await import(pathToFileURL(path.join(dir, "server.mjs")).href),
  };
}
