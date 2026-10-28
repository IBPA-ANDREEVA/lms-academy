async function dispatch(request: Request) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.COMPONENTS_WORKSPACE !== "1"
  )
    return new Response("Not found", { status: 404 });
  const { handle } = await import("@/features/component-registry/server");
  return handle(request);
}
export const GET = dispatch;
export const POST = dispatch;
