import { IdentitySection } from "./sections/identity-section";
import type { AuthView } from "./auth-modal";
import styles from "./auth-modal.module.css";

export function IdentityPage({
  view,
}: {
  view: Exclude<AuthView, "account"> | "reset";
}) {
  return (
    <main id="main-content" className={styles.page}>
      <IdentitySection view={view} />
    </main>
  );
}
