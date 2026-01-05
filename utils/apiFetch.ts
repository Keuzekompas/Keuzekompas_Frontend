const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:1000/api";

import { ApiError } from "../app/types/errors";

export type FetchOptions = {
  revalidate?: number;
  noStore?: boolean;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  skipAuth?: boolean; // bij 
  credentials?: RequestCredentials; // optioneel override
};
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...options.headers,
  };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...(options.noStore ? { cache: "no-store" } : {}),
      ...("revalidate" in options
        ? { next: { revalidate: options.revalidate } }
        : {}),
      method: options.method ?? (options.body ? "POST" : "GET"),
      headers,
      credentials: options.credentials ?? "include",

      body: options.body,
    });
  } catch (error) {
    throw new Error("NETWORK_ERROR", { cause: error });
  }
  let response: any = null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    response = await res.json();
  } else {
    response = await res.text();
  }
  if (!res.ok) {
    const message =
      typeof response === "object" && response?.message
        ? response.message
        : res.statusText;

    const status =
      typeof response === "object" && response?.status
        ? response.status
        : res.status;

    throw new ApiError(message, status);
  }

  if (
    typeof response === "object" &&
    response !== null &&
    "status" in response &&
    response.status !== 200 &&
    response.status !== "success"
  ) {
    throw new ApiError(response.message || res.statusText, response.status);
  }

  return response as T;
}