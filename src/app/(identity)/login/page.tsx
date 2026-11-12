import { IdentityPage } from "@/features/identity/identity-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...pageMetadata("Вход", "Вход в аккаунт Beauty Business Academy."),
  referrer: "no-referrer" as const,
};
export default function Page() {
  return <IdentityPage view="login" />;
}
