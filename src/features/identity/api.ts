import { apiRequest } from "@/lib/api/client";
import type { components, paths } from "@/lib/api/generated/schema";

type Schemas = components["schemas"];
type BaseResponse = Schemas["BaseResponse"];
export type RegisterRequest = Schemas["RegisterRequest"];
export type CurrentUser = Schemas["CurrentUserResponse"];
export type Sessions = Schemas["SessionsResponse"];

// Restrict endpoint spellings to the generated OpenAPI path keys.
const endpoint = <T extends keyof paths>(path: T) => path;
export const registerStudent = (data: RegisterRequest) =>
  apiRequest<BaseResponse>(endpoint("/api/v1/auth/register"), "POST", data);
export const verifyEmail = (token: string) =>
  apiRequest<BaseResponse>(endpoint("/api/v1/auth/verify-email"), "POST", {
    token,
  } satisfies Schemas["VerifyEmailRequest"]);
export const resendVerification = (email: string) =>
  apiRequest<BaseResponse>(
    endpoint("/api/v1/auth/resend_verify_email"),
    "POST",
    { email } satisfies Schemas["ResendVerificationRequest"],
  );
export const login = (data: Schemas["LoginRequest"]) =>
  apiRequest<BaseResponse>(endpoint("/api/v1/auth/login"), "POST", data);
export const logout = () =>
  apiRequest<BaseResponse>(endpoint("/api/v1/auth/logout"), "POST");
export const getCurrentUser = (signal?: AbortSignal) =>
  apiRequest<CurrentUser>(
    endpoint("/api/v1/auth/me"),
    "GET",
    undefined,
    signal,
  );
export const getSessions = (after?: string, signal?: AbortSignal) =>
  apiRequest<Sessions>(
    `${endpoint("/api/v1/auth/sessions")}${after ? `?after=${encodeURIComponent(after)}` : ""}`,
    "GET",
    undefined,
    signal,
  );
export const revokeSession = (id: string) =>
  apiRequest<BaseResponse>(
    `/api/v1/auth/sessions/${encodeURIComponent(id)}`,
    "DELETE",
  );
export const forgotPassword = (data: Schemas["ForgotPasswordRequest"]) =>
  apiRequest<BaseResponse>(
    endpoint("/api/v1/auth/password/forgot"),
    "POST",
    data,
  );
export const resetPassword = (data: Schemas["ResetPasswordRequest"]) =>
  apiRequest<BaseResponse>(
    endpoint("/api/v1/auth/password/reset"),
    "POST",
    data,
  );
