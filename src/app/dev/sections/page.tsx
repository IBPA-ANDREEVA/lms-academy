import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { SectionWorkspace } from "@/features/section-planning";

const manrope = localFont({
  src: "../../../features/section-planning/fonts/Manrope.ttf",
  weight: "400 700",
  display: "swap",
});
export const metadata = {
  title: "Структуры страниц — LMS",
  robots: { index: false, follow: false },
};
export default function Page() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.SECTIONS_WORKSPACE !== "1"
  )
    notFound();
  return (
    <div lang="ru" className={manrope.className}>
      <SectionWorkspace />
    </div>
  );
}
