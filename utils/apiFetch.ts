const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3080/api";

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
    typeof window !== "undefined" && !options.skipAuth
      ? localStorage.getItem("token")
      : null;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...(options.noStore ? { cache: "no-store" } : {}),
    ...("revalidate" in options
      ? { next: { revalidate: options.revalidate } }
      : {}),
    method: options.method,
    headers,
    body: options.body,
  });

  if (!res.ok) {
    throw new Error(
      `API request failed: ${res.status} ${res.statusText} (${path})`
    );
  }

  const json = await res.json();
  return "data" in json ? json.data : json;
}
