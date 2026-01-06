"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { RecommendedModule } from '../types/ai';
import { getRecommendations } from '../../lib/ai';

interface RecommendationContextType {
  recommendations: RecommendedModule[];
  loading: boolean;
  error: string | null;
  fetchRecommendations: (params: { interests: string; location: string; ecs: string; tags: string[] }) => Promise<void>;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider = ({ children }: { children: ReactNode }) => {
  const [recommendations, setRecommendations] = useState<RecommendedModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (params: { interests: string; location: string; ecs: string; tags: string[] }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendations(params);
      setRecommendations(data);
    } catch (err) {
      setError('Failed to fetch recommendations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecommendationContext.Provider value={{ recommendations, loading, error, fetchRecommendations }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};
