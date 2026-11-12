import { readFile, writeFile } from "node:fs/promises";
const schema = JSON.parse(await readFile("backend/openapi/identity.json", "utf8"));
const constraints = {};
for (const name of ["RegisterRequest", "LoginRequest", "ResetPasswordRequest", "VerifyEmailRequest"]) {
  constraints[name] = Object.fromEntries(Object.entries(schema.components.schemas[name].properties)
    .map(([field, value]) => [field, { min: value.minLength, max: value.maxLength }]));
}
await writeFile("src/lib/api/generated/identity-constraints.ts", `// Generated from backend/openapi/identity.json. Do not edit.\nexport const identityConstraints = ${JSON.stringify(constraints, null, 2)} as const;\n`);
