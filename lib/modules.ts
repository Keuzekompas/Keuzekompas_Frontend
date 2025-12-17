import type { Module } from "@/app/types/module";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:1000";

type FetchOptions = {
  revalidate?: number; // seconds
  noStore?: boolean;
};

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...(options.noStore ? { cache: "no-store" } : {}),
    ...(options.revalidate != null ? { next: { revalidate: options.revalidate } } : {}),
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText} (${path})`);
  }

  return res.json() as Promise<T>;
}

export async function getModules(options: FetchOptions = {}): Promise<Module[]> {
  const data = await apiFetch<unknown>("/modules", options);
  return Array.isArray(data) ? (data as Module[]) : [];
}

export async function getModuleById(id: string, options: FetchOptions = {}): Promise<Module | null> {
  try {
    return await apiFetch<Module>(`/modules/${id}`, options);
  } catch {
    return null;
  }
}
