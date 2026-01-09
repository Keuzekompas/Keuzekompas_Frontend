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

  // Check if token is present or 2FA is required
  if (!response.data.user && !response.data.requires2FA) {
    throw new Error(
      "Something went wrong. Please try again later."
    );
  }

  return response.data;
}

export async function verify2faAPI(
  code: string,
  tempToken?: string // Optional fallback
): Promise<LoginResponse> {
  const response = await apiFetch<JsonResponse<LoginResponse>>("/auth/verify-2fa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, tempToken }), // Send it if available
    skipAuth: true,
  });

  if (!response.data.user) {
    throw new Error("Verification failed.");
  }

  return response.data;
}
