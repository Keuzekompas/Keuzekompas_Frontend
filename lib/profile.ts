import { apiFetch } from "@/utils/apiFetch";
import { Profile } from "../app/types/profile";
import { JsonResponse } from "../app/types/jsonResponse";

export async function getProfile(): Promise<Profile> {
  const response = await apiFetch<JsonResponse<Profile>>("/user/profile", {
    method: "GET",
  });
  return response.data;
}
