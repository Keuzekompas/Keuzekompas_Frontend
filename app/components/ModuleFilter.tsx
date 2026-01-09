"use client";
import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ModuleCard from "./ModuleCard";
import { ModuleListResponse } from "../types/moduleList";
import { useTranslation } from "react-i18next";

export interface FilterState {
  search: string;
  location: string;
  studycredit: number;
}

interface ModuleFilterProps {
  modules: ModuleListResponse[];
  favoriteIds?: Set<string>;
  totalCount: number;
  onFilterChange: (filters: FilterState) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const ModuleFilter = ({ modules, favoriteIds = new Set(), totalCount, onFilterChange, onLoadMore, hasMore }: ModuleFilterProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("None");
  const [studycredit, setStudycredit] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search: searchQuery,
        location,
        studycredit
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, location, studycredit, onFilterChange]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
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
  }, [hasMore, onLoadMore]);

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder={t('moduleFilter.searchPlaceholder')}
          className="w-full p-2 pl-10 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary) placeholder-(--text-placeholder)"
          onChange={(e) => setSearchQuery(e.target.value)}
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
            onChange={(e) => setStudycredit(Number.parseInt(e.target.value))}
          >
            <option value="0">{t('moduleFilter.all')}</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-(--text-secondary) font-medium">
        {searchQuery !== "" || location !== "None" || studycredit !== 0 
          ? t('moduleFilter.resultsFound', { count: totalCount })
          : t('moduleFilter.totalCount', { count: totalCount })
        }
      </div>

      <div className="space-y-4">
        {modules.length > 0 ? (
          <>
            {modules.map((module) => (
              <ModuleCard key={module._id} {...module} initialIsFavorite={favoriteIds.has(module._id)} />
            ))}
            {hasMore && (
              <div ref={observerTarget} className="h-10 flex justify-center items-center">
                <span className="text-sm text-(--text-secondary)">Loading more...</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-(--text-secondary) mt-8">
            {t('moduleFilter.noModulesFound')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleFilter;
