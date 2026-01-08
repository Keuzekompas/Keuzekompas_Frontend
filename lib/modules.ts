import { JsonResponse } from "@/app/types/jsonResponse";
import type { ModuleListResponse, PaginatedModuleListResponse } from "@/app/types/moduleList";
import type { ModuleDetailResponse } from "@/app/types/moduleDetail";
import { apiFetch } from "@/utils/apiFetch";

export interface GetModulesParams {
  language?: string;
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  studycredit?: number;
}

export async function getModules(
  params: GetModulesParams
): Promise<{ modules: ModuleListResponse[], total: number }> {
  const { language, page = 1, limit = 10, search, location, studycredit } = params;
  
  const queryParams = new URLSearchParams();
  if (language) queryParams.set("lang", language.toLowerCase());
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());
  if (search) queryParams.set("search", search);
  if (location && location !== "None") queryParams.set("location", location);
  if (studycredit && studycredit !== 0) queryParams.set("studycredit", studycredit.toString());

  const data = await apiFetch<JsonResponse<PaginatedModuleListResponse>>(`/modules?${queryParams.toString()}`);
  
  if (data.data && 'modules' in data.data) {
      return {
          modules: data.data.modules,
          total: data.data.total
      };
  }
  
  return { modules: [], total: 0 };
}

export async function getFavoriteModules(
  language?: string
): Promise<ModuleListResponse[]> {
  const query = language ? `?lang=${language.toLowerCase()}` : "";
  const data = await apiFetch<JsonResponse<ModuleListResponse[]>>(`/user/favorites${query}`);
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