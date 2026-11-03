import { pageMetadata } from "@/lib/seo/metadata";
import { ComponentPreviewPage } from "@/features/component-preview";

export const metadata = pageMetadata("Компоненты — предпросмотр", "Внутренняя проверка компонентов интерфейса. Демонстрационные данные.");

export default function ComponentsPreview() {
  return <ComponentPreviewPage />;
}
