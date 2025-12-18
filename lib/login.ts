import { apiFetch } from "@/utils/apiFetch";
import { loginResponse } from "../app/types/login";
import { JsonResponse } from "../app/types/jsonResponse";

export async function loginAPI(
  email: string,
  password: string
): Promise<loginResponse> {
  const response = await apiFetch<JsonResponse<loginResponse>>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });

  // Controleer of er een token is, anders is login mislukt
  if (!response.data.token) {
    throw new Error("Login failed");
  }

  if (typeof window !== "undefined" && response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
}
