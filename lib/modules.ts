import { JsonResponse } from "@/app/types/jsonResponse";
import type { ModuleResponse } from "@/app/types/module";
import { apiFetch } from "@/utils/apiFetch";

export async function getModules(
): Promise<ModuleResponse[]> {
  const data = await apiFetch<JsonResponse<ModuleResponse>>("/modules");
  return Array.isArray(data.data) ? (data.data as ModuleResponse[]) : [];
}

export async function getModuleById(
  id: string,
): Promise<JsonResponse<ModuleResponse> | null> {
  try {
    return await apiFetch<JsonResponse<ModuleResponse>>(`/modules/${id}`);
  } catch {
    return null;
  }
}
