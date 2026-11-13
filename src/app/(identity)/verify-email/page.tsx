import { IdentityPage } from "@/features/identity/identity-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...pageMetadata(
    "Подтверждение почты",
    "Подтверждение электронной почты аккаунта.",
  ),
  referrer: "no-referrer" as const,
};
export default function Page() {
  return <IdentityPage view="verify" />;
}
