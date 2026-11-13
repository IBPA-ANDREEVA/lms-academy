"use client";

import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotForm } from "./forgot-form";
import { AccountPanel } from "./account-panel";
import { VerificationForm } from "./verification-form";
import type { AuthView } from "./auth-modal";

/** Keep unfinished inputs across view switches; account data loads only when visible. */
export function AuthContent({
  view,
  onViewChange,
}: {
  view: AuthView;
  onViewChange: (view: AuthView) => void;
}) {
  return (
    <>
      <div data-auth-view="login" hidden={view !== "login"}>
        <LoginForm onViewChange={onViewChange} />
      </div>
      <div data-auth-view="register" hidden={view !== "register"}>
        <RegisterForm onViewChange={onViewChange} />
      </div>
      <div data-auth-view="forgot" hidden={view !== "forgot"}>
        <ForgotForm onViewChange={onViewChange} />
      </div>
      {view === "verify" && (
        <div data-auth-view="verify">
          <VerificationForm onViewChange={onViewChange} />
        </div>
      )}
      {view === "account" && (
        <div data-auth-view="account">
          <AccountPanel onViewChange={onViewChange} />
        </div>
      )}
    </>
  );
}
