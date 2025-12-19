import { JsonResponse } from "@/app/types/jsonResponse";
import type { ModuleResponse } from "@/app/types/module";
import { apiFetch, type FetchOptions } from "@/utils/apiFetch";

export async function getModules(
  options: FetchOptions = { skipAuth: false }
): Promise<ModuleResponse[]> {
  const data = await apiFetch<JsonResponse<ModuleResponse>>("/modules", options);
  return Array.isArray(data.data) ? (data.data as ModuleResponse[]) : [];
}

export async function getModuleById(
  id: string,
  options: FetchOptions = { skipAuth: false }
): Promise<JsonResponse<ModuleResponse> | null> {
  try {
    return await apiFetch<JsonResponse<ModuleResponse>>(`/modules/${id}`, options);
  } catch {
    return null;
  }
}
