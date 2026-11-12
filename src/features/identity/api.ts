import { apiPost } from "@/lib/api/client";

type BaseResponse = {
  message: string;
};

export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

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
