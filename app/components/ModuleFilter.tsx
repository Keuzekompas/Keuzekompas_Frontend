"use client";
import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ModuleCard from "./ModuleCard";
import { ModuleListResponse } from "../types/moduleList";
import { useTranslation } from "react-i18next";

const ModuleFilter = ({ modules, favoriteIds = new Set() }: { modules: ModuleListResponse[], favoriteIds?: Set<string> }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("None");
  const [ects, setEcts] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredModules = modules.filter((module) => {
    const searchMatch = module.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const locationMatch =
      location === "None" ||
      module.location?.toLowerCase().includes(location.toLowerCase());

    const ectsMatch = ects === 0 || module.studycredit === ects;
    return searchMatch && locationMatch && ectsMatch;
  });

  const displayedModules = filteredModules.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery, location, ects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 10);
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
  }, [displayedModules.length]);

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
            onChange={(e) => setEcts(Number.parseInt(e.target.value))}
          >
            <option value="0">{t('moduleFilter.all')}</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {displayedModules.length > 0 ? (
          <>
            {displayedModules.map((module) => (
              <ModuleCard key={module._id} {...module} initialIsFavorite={favoriteIds.has(module._id)} />
            ))}
            {visibleCount < filteredModules.length && (
              <div ref={observerTarget} className="h-10 flex justify-center items-center">
                {/* Sentinel for infinite scroll */}
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
