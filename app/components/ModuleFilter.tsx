"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ModuleCard from "./ModuleCard";
import { ModuleListResponse } from "../types/moduleList";
import { useTranslation } from "react-i18next";
import { getModules } from "@/lib/modules";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useLanguage } from "@/app/context/LanguageContext";

const ModuleFilter = ({ favoriteIds = new Set() }: { favoriteIds?: Set<string> }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [modules, setModules] = useState<ModuleListResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [location, setLocation] = useState("None");
  const [ects, setEcts] = useState(0);
  const [_page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const LIMIT = 10;

  const fetchModulesData = useCallback(async (currentPage: number, isLoadMore: boolean = false) => {
    setLoading(true);
    try {
      const newModules = await getModules(
        language,
        currentPage,
        LIMIT,
        debouncedSearch,
        location,
        ects
      );

      if (newModules.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setModules((prev) => {
        if (!isLoadMore) return newModules;
        const existingIds = new Set(prev.map((m) => m._id));
        const uniqueNewModules = newModules.filter((m) => !existingIds.has(m._id));
        return [...prev, ...uniqueNewModules];
      });
    } catch (error) {
      console.error("Failed to fetch modules", error);
    } finally {
      setLoading(false);
    }
  }, [language, debouncedSearch, location, ects]);

  // Initial fetch and filter changes
  useEffect(() => {
    setPage(1);
    // When filters change, we reset the list. 
    // We can't rely on 'page' state being 1 immediately inside fetchModulesData if we just set it.
    // So we pass 1 explicitly.
    fetchModulesData(1, false);
  }, [fetchModulesData]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchModulesData(nextPage, true);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, fetchModulesData]);

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={t('moduleFilter.searchPlaceholder')}
          className="w-full p-2 pl-10 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary) placeholder-(--text-placeholder)"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-(--icon-color)" />
        </div>
      </div>

      <div className="flex flex-row gap-4 mb-4">
        <div className="w-1/2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-(--text-secondary)"
          >
            {t('moduleFilter.location')}
          </label>
          <select
            id="location"
            className="w-full p-2 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary)"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          >
            <option value="None">{t('moduleFilter.none')}</option>
            <option value="Breda">{t('moduleFilter.breda')}</option>
            <option value="Den Bosch">{t('moduleFilter.denBosch')}</option>
            <option value="Tilburg">{t('moduleFilter.tilburg')}</option>
          </select>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="ects"
            className="block text-sm font-medium text-(--text-secondary)"
          >
            {t('moduleFilter.ects')}
          </label>
          <select
            id="ects"
            className="w-full p-2 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary)"
            onChange={(e) => setEcts(Number.parseInt(e.target.value))}
            value={ects}
          >
            <option value="0">{t('moduleFilter.all')}</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {modules.length > 0 ? (
          <>
            {modules.map((module) => (
              <ModuleCard key={module._id} {...module} initialIsFavorite={favoriteIds.has(module._id)} />
            ))}
            {hasMore && (
              <div ref={observerTarget} className="h-10 flex justify-center items-center">
                {loading && <p>{t('common.loading')}</p>}
              </div>
            )}
          </>
        ) : (
           !loading && (
            <div className="text-center text-(--text-secondary) mt-8">
              {t('moduleFilter.noModulesFound')}
            </div>
          )
        )}
        {loading && modules.length === 0 && (
           <div className="flex justify-center items-center h-20">
             <p className="text-lg text-(--text-primary)">{t('common.loading')}</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default ModuleFilter;
