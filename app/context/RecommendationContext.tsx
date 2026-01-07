"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { RecommendedModule } from '../types/ai';
import { getRecommendations } from '../../lib/ai';
import Cookies from 'js-cookie';

interface SearchParams {
  interests: string;
  location: string;
  ecs: string;
  tags: string[];
}

interface RecommendationContextType {
  recommendations: RecommendedModule[];
  loading: boolean;
  error: string | null;
  searchParams: SearchParams | null;
  fetchRecommendations: (params: SearchParams & { language: string }) => Promise<void>;
  setSearchParams: (params: SearchParams) => void;
  clearRecommendations: () => void;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider = ({ children }: { children: ReactNode }) => {
  const [recommendations, setRecommendations] = useState<RecommendedModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  // Load RESULTS from cookie on mount
  useEffect(() => {
    const savedResults = Cookies.get('ai_results');
    const savedParams = Cookies.get('ai_last_params'); // We store params loosely to allow language switch after reload
    
    if (savedResults) {
      try {
        setRecommendations(JSON.parse(savedResults));
      } catch (e) {
        console.error("Failed to parse saved recommendations", e);
      }
    }
    if (savedParams) {
        try {
            setSearchParams(JSON.parse(savedParams));
        } catch (e) {
            console.error("Failed to parse saved params", e);
        }
    }
  }, []);

  const fetchRecommendations = async (params: SearchParams & { language: string }) => {
    setLoading(true);
    setError(null);
    
    // Update params in state
    const paramsToSave = {
        interests: params.interests,
        location: params.location,
        ecs: params.ecs,
        tags: params.tags
    };
    setSearchParams(paramsToSave);
    
    // Save minimal context to cookie to support language switch after reload if results exist
    Cookies.set('ai_last_params', JSON.stringify(paramsToSave), { expires: 1 });

    try {
      const data = await getRecommendations(params);
      setRecommendations(data);
      // Save results to cookie
      Cookies.set('ai_results', JSON.stringify(data), { expires: 1 }); // 1 day
    } catch (err) {
      setError('Failed to fetch recommendations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearRecommendations = () => {
      setRecommendations([]);
      setSearchParams(null);
      Cookies.remove('ai_results');
      Cookies.remove('ai_last_params');
  };

  return (
    <RecommendationContext.Provider value={{ recommendations, loading, error, searchParams, setSearchParams, fetchRecommendations, clearRecommendations: clearRecommendations }}>
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
