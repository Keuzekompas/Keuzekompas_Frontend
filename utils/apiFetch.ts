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

function buildHeaders(options: FetchOptions) {
  const headers: Record<string, string> = {
    ...options.headers,
  };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

function buildFetchParams(options: FetchOptions, headers: Record<string, string>) {
  return {
    ...(options.noStore ? { cache: "no-store" } : {}),
    ...("revalidate" in options
      ? { next: { revalidate: options.revalidate } }
      : {}),
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers,
    credentials: options.credentials ?? "include",
    body: options.body,
  } as RequestInit & { next?: { revalidate?: number } };
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  return await res.text();
}

function handleNonOk(res: Response, response: any): never {
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

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers = buildHeaders(options);
  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, buildFetchParams(options, headers));
  } catch (error) {
    throw new Error("NETWORK_ERROR", { cause: error });
  }

  const response = await parseResponse(res);

  if (!res.ok) {
    return handleNonOk(res, response);
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