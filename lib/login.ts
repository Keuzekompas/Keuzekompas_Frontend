import { apiFetch } from "@/utils/apiFetch";
import { LoginResponse } from "../app/types/login";
import { JsonResponse } from "../app/types/jsonResponse";

export async function loginAPI(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiFetch<JsonResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });

  // Check if we got a user object or if 2FA is required.
  // We no longer check for 'token' in the body because it's in a cookie now.
  if (!response.data.user && !response.data.requires2FA) {
    throw new Error(
      "Something went wrong. Please try again later."
    );
  }

  return response.data;
}

export async function verify2faAPI(
  code: string
): Promise<LoginResponse> {
  // We no longer send tempToken in body, backend reads it from cookie
  const response = await apiFetch<JsonResponse<LoginResponse>>("/auth/verify-2fa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
    skipAuth: true,
  });

  // Success check: we should have a user object
  if (!response.data.user) {
    throw new Error("Verification failed.");
  }

  return response.data;
}
