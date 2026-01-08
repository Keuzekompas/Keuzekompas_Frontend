import { JsonResponse } from "@/app/types/jsonResponse";
import type { ModuleListResponse } from "@/app/types/moduleList";
import type { ModuleDetailResponse } from "@/app/types/moduleDetail";
import { apiFetch } from "@/utils/apiFetch";

export async function getModules(
  language?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  location?: string,
  ects?: number
): Promise<ModuleListResponse[]> {
  const params = new URLSearchParams();
  if (language) params.append("lang", language.toLowerCase());
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (location && location !== "None") params.append("location", location);
  if (ects && ects !== 0) params.append("studycredit", ects.toString());

  const data = await apiFetch<JsonResponse<ModuleListResponse>>(`/modules?${params.toString()}`);
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
