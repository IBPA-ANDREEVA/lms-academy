"use client";

import { useEffect, useState } from "react";
import { identityConstraints } from "@/lib/api/generated/identity-constraints";
import { useRouter } from "next/navigation";
import { AuthContent } from "../auth-content";
import { viewTitles, type AuthView } from "../auth-modal";
import { useIdentity } from "../identity-provider";
import { ResetForm } from "../reset-form";
import { VerificationForm } from "../verification-form";
import styles from "../auth-modal.module.css";

type PageView = Exclude<AuthView, "account"> | "reset";
const destinations: Record<AuthView, string> = {
  login: "/login",
  account: "/login",
  register: "/register",
  forgot: "/forgot-password",
  verify: "/verify-email",
};

/** Email-link secrets are accepted only in the fragment, never sent in a GET.
 * Capture once after hydration and immediately remove from browser history.
 * Consumption still requires an explicit POST, so previews cannot use a link. */
function TokenForm({
  view,
  onViewChange,
}: {
  view: "reset" | "verify";
  onViewChange: (view: AuthView) => void;
}) {
  const [link, setLink] = useState<{ token: string; revision: number } | null>(
    null,
  );
  useEffect(() => {
    let active = true;
    const readLink = () => {
      if (!active) return;
      const value =
        new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname,
      );
      const token =
        value.length <= identityConstraints.VerifyEmailRequest.token.max
          ? value
          : "";
      setLink((previous) => ({
        token,
        revision: (previous?.revision ?? 0) + 1,
      }));
    };
    void Promise.resolve().then(readLink);
    window.addEventListener("hashchange", readLink);
    return () => {
      active = false;
      window.removeEventListener("hashchange", readLink);
    };
  }, []);
  if (link === null) return <p role="status">Открываем страницу…</p>;
  return view === "reset" ? (
    <ResetForm
      key={link.revision}
      token={link.token}
      onViewChange={onViewChange}
    />
  ) : (
    <VerificationForm
      key={link.revision}
      token={link.token}
      onViewChange={onViewChange}
    />
  );
}

export function IdentitySection({ view }: { view: PageView }) {
  const router = useRouter();
  const { user } = useIdentity();
  const activeView = view === "login" && user ? "account" : view;
  const title =
    activeView === "reset" ? "Новый пароль" : viewTitles[activeView];
  const navigate = (next: AuthView) => router.push(destinations[next]);
  return (
    <section
      className={styles.pagePanel}
      data-view={activeView}
      aria-labelledby="identity-page-title"
    >
      <div className={styles.frame}>
        <h1 id="identity-page-title" className={styles.title}>
          {title}
        </h1>
        {view === "reset" || view === "verify" ? (
          <TokenForm key={view} view={view} onViewChange={navigate} />
        ) : (
          <AuthContent view={activeView as AuthView} onViewChange={navigate} />
        )}
      </div>
    </section>
  );
}
