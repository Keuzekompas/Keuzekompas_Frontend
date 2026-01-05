import { JsonResponse } from "@/app/types/jsonResponse";
import type { ModuleListResponse } from "@/app/types/moduleList";
import type { ModuleDetailResponse } from "@/app/types/moduleDetail";
import { apiFetch } from "@/utils/apiFetch";

export async function getModules(
): Promise<ModuleListResponse[]> {
  const data = await apiFetch<JsonResponse<ModuleListResponse>>("/modules");
  return Array.isArray(data.data) ? (data.data as ModuleListResponse[]) : [];
}

export async function getModuleById(
  id: string,
): Promise<JsonResponse<ModuleDetailResponse> | null> {
  try {
    return await apiFetch<JsonResponse<ModuleDetailResponse>>(`/modules/${id}`);
  } catch {
    return null;
  }
}
