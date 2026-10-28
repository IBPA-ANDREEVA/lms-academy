import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import localFont from "next/font/local";
import { ComponentWorkspace } from "@/features/component-registry";
const manrope = localFont({
  src: "../../../features/section-planning/fonts/Manrope.ttf",
  weight: "400 700",
  display: "swap",
});
export const metadata = {
  title: "Реестр компонентов — LMS",
  robots: { index: false, follow: false },
};
async function LocalWorkspace() {
  const { localHeaders } = await import("@/features/component-registry/access");
  try {
    localHeaders(await headers());
  } catch {
    notFound();
  }
  return <ComponentWorkspace />;
}
export default function Page() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.COMPONENTS_WORKSPACE !== "1"
  )
    notFound();
  return (
    <div lang="ru" className={manrope.className}>
      <Suspense fallback={<p>Загрузка реестра…</p>}>
        <LocalWorkspace />
      </Suspense>
    </div>
  );
}
