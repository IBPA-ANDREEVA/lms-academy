import { apiPost } from "@/lib/api/client";

import type { components } from "@/lib/api/generated/schema";

type BaseResponse = components["schemas"]["BaseResponse"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];

export function registerStudent(
  data: RegisterRequest,
) {
  return apiPost<BaseResponse>(
    "/api/v1/auth/register",
    data,
  );
}

export function verifyEmail(token: string) {
  return apiPost<BaseResponse>(
    "/api/v1/auth/verify-email",
    { token },
  );
}

export function resendVerification(email: string) {
  return apiPost<BaseResponse>(
    "/api/v1/auth/resend-verification",
    { email },
  );
}
