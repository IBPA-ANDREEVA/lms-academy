import type { Metadata } from "next";
import { ComponentPreviewPage } from "@/features/component-preview";

export const metadata: Metadata = {
  title: "Компоненты — предпросмотр",
  robots: { index: false, follow: false },
};

export default function ComponentsPreview() {
  return <ComponentPreviewPage />;
}
