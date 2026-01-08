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

  // Check if token is present
  if (!response.data.token) {
    throw new Error(
      "Something went wrong. Please try again later. (No token received.)"
    );
  }

  return response.data;
}
