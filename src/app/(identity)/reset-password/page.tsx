import { IdentityPage } from "@/features/identity/identity-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...pageMetadata(
    "Новый пароль",
    "Смена пароля по ссылке восстановления доступа.",
  ),
  referrer: "no-referrer" as const,
};
export default function Page() {
  return <IdentityPage view="reset" />;
}
