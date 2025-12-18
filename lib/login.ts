import { apiFetch } from "@/utils/apiFetch";
import { loginResponse } from "../app/types/login";

export async function loginAPI(
  email: string,
  password: string
): Promise<loginResponse> {
  const data = await apiFetch<loginResponse>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    skipAuth: true, // Dont send token for login
  });

  // Store token in localStorage
  if (typeof window !== "undefined" && data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}
