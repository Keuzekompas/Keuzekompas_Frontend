import { JsonResponse } from "@/app/types/jsonResponse";
import type { ModuleListResponse } from "@/app/types/moduleList";
import type { ModuleDetailResponse } from "@/app/types/moduleDetail";
import { apiFetch } from "@/utils/apiFetch";

export async function getModules(
  language?: string
): Promise<ModuleListResponse[]> {
  const query = language ? `?lang=${language.toLowerCase()}` : "";
  const data = await apiFetch<JsonResponse<ModuleListResponse>>(`/modules${query}`);
  return Array.isArray(data.data) ? (data.data as ModuleListResponse[]) : [];
}

export async function getFavoriteModules(
  language?: string
): Promise<ModuleListResponse[]> {
  const query = language ? `?lang=${language.toLowerCase()}` : "";
  const data = await apiFetch<JsonResponse<ModuleListResponse>>(`/modules/favorites${query}`);
  return Array.isArray(data.data) ? (data.data as ModuleListResponse[]) : [];
}

export async function getModuleById(
  id: string,
  language?: string
): Promise<JsonResponse<ModuleDetailResponse> | null> {
  try {
    const query = language ? `?lang=${language.toLowerCase()}` : "";
    return await apiFetch<JsonResponse<ModuleDetailResponse>>(`/modules/${id}${query}`);
  } catch {
    return null;
  }
}
