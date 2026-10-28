// Keep file access out of the production route graph as well as denying requests.
export async function GET(request: Request) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.SECTIONS_WORKSPACE !== "1"
  )
    return new Response("Not found", { status: 404 });
  const { handleGet } = await import("@/features/section-planning/server");
  return handleGet(request);
}
export async function POST(request: Request) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.SECTIONS_WORKSPACE !== "1"
  )
    return new Response("Not found", { status: 404 });
  const { handlePost } = await import("@/features/section-planning/server");
  return handlePost(request);
}
