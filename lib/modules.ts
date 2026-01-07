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
  const data = await apiFetch<JsonResponse<ModuleListResponse[]>>(`/user/favorites${query}`);
  console.log("Favorite Modules Data:", data);
  return Array.isArray(data.data) ? data.data : [];
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

export async function addFavorite(id: string): Promise<boolean> {
  try {
    await apiFetch(`/user/favorites/${id}`, { method: 'POST' });
    return true;
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return false;
  }
}

export async function removeFavorite(id: string): Promise<boolean> {
  try {
    await apiFetch(`/user/favorites/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return false;
  }
}
