import { IdentityPage } from "@/features/identity/identity-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...pageMetadata(
    "Восстановление пароля",
    "Запрос восстановления доступа к аккаунту.",
  ),
  referrer: "no-referrer" as const,
};
export default function Page() {
  return <IdentityPage view="forgot" />;
}
