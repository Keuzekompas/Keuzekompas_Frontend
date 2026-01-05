const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:1000/api";

import { ApiError } from "../app/types/errors";

export type FetchOptions = {
  revalidate?: number;
  noStore?: boolean;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  skipAuth?: boolean; // Skip adding Authorization header
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const token =
    globalThis.window !== undefined && !options.skipAuth
      ? localStorage.getItem("token")
      : null;

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...(options.noStore ? { cache: "no-store" } : {}),
      ...("revalidate" in options
        ? { next: { revalidate: options.revalidate } }
        : {}),
      method: options.method,
      headers,
      body: options.body,
    });
  } catch (error) {
    throw new Error("NETWORK_ERROR", { cause: error });
  }

  const response = await res.json();

  if (!res.ok || (response.status !== 200 && response.status !== "success")) {
    throw new ApiError(
      response.message || res.statusText,
      response.status || res.status
    );
  }

  return response;
}
