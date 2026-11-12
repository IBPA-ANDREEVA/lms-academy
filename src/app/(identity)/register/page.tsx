import { IdentityPage } from "@/features/identity/identity-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...pageMetadata("Регистрация", "Создание аккаунта Beauty Business Academy."),
  referrer: "no-referrer" as const,
};
export default function Page() {
  return <IdentityPage view="register" />;
}
