import { RecommendedModule } from "../app/types/ai";

interface RecommendationParams {
  interests: string;
  location: string;
  ecs: string;
  tags?: string[];
  language?: string;
}

export const getRecommendations = async (params: RecommendationParams): Promise<RecommendedModule[]> => {
  const requestBody: {
    description: string;
    preferred_location?: string;
    current_ects?: number;
    tags?: string[];
  } = {
    description: params.interests,
    tags: params.tags || [],
  };

  if (params.location !== "Geen") {
    requestBody.preferred_location = params.location;
  }

  if (params.ecs !== "Geen") {
    requestBody.current_ects = Number.parseInt(params.ecs, 10);
  }

  const lang = params.language || "NL";

  try {
    const response = await fetch(`http://localhost:8000/api/predict?language=${lang}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: Sends the HttpOnly cookie
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch recommendations');
    }

    const data = await response.json();
    console.log("Fetched recommendations:", data);
    return data.recommendations as RecommendedModule[];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};