"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ModuleFilter, { FilterState } from "../components/ModuleFilter";
import ModulesHeader from "../components/ModulesHeader";
import BackToTopButton from "../components/BackToTopButton";
import { getModules, getFavoriteModules } from "@/lib/modules";
import type { ModuleListResponse } from "@/app/types/moduleList";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTranslation } from "react-i18next";

const mergeUniqueModules = (prev: ModuleListResponse[], newModules: ModuleListResponse[]) => {
  const uniqueNewModules = newModules.filter(
    newM => !prev.some(existingM => existingM._id === newM._id)
  );
  return [...prev, ...uniqueNewModules];
};

const ModulesPage = () => {
  const [modules, setModules] = useState<ModuleListResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({ search: "", location: "None", studycredit: 0 });
  const [hasMore, setHasMore] = useState(true);

  // Keep track of mounted status
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Initial Fetch (Favorites + First Page)
  useEffect(() => {
    const init = async () => {
      try {
        setInitialLoading(true);
        const [modulesData, fetchedFavorites] = await Promise.all([
          getModules({ search: "", location: "None", studycredit: 0, page: 1, limit: 10, language }),
          getFavoriteModules(language)
        ]);
        
        if (isMounted.current) {
          setModules(modulesData.modules);
          setTotalCount(modulesData.total);
          setHasMore(modulesData.modules.length < modulesData.total);
          setFavoriteIds(new Set(fetchedFavorites.map(m => m._id)));
        }
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        if (isMounted.current) setError(t('common.error'));
      } finally {
        if (isMounted.current) setInitialLoading(false);
      }
    };
    init();
  }, [language, t]);

  // Fetch when filters change
  const handleFilterChange = useCallback(async (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    
    try {
      const data = await getModules({ ...newFilters, page: 1, limit: 10, language });
      if (isMounted.current) {
        setModules(data.modules);
        setTotalCount(data.total);
        setHasMore(data.modules.length < data.total);
      }
    } catch (err) {
      console.error(err);
    }
  }, [language]);

  // Load More (Infinite Scroll)
  const handleLoadMore = useCallback(async () => {
    if (initialLoading || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const data = await getModules({ ...filters, page: nextPage, limit: 10, language });
      
      if (isMounted.current) {
        setModules(prev => mergeUniqueModules(prev, data.modules));
        
        setPage(nextPage);
        setHasMore((modules.length + data.modules.length) < data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) setLoadingMore(false);
    }
  }, [page, filters, hasMore, initialLoading, loadingMore, language, modules.length]);

  if (initialLoading && modules.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-(--text-primary)">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-(--color-error)">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ModulesHeader />
      <div className={`transition-opacity duration-300 ease-in-out ${initialLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <ModuleFilter 
          modules={modules} 
          totalCount={totalCount} 
          favoriteIds={favoriteIds}
          onFilterChange={handleFilterChange}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
        {loadingMore && (
           <div className="py-4 text-center text-sm text-(--text-secondary)">
             {t('common.loading')}
           </div>
        )}
        <BackToTopButton />
      </div>
    </div>
  );
};

export default ModulesPage;
