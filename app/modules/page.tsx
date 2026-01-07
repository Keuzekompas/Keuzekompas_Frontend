"use client";

import { useState, useEffect } from "react";
import ModuleFilter from "../components/ModuleFilter";
import ModulesHeader from "../components/ModulesHeader";
import { getModules, getFavoriteModules } from "@/lib/modules";
import type { ModuleListResponse } from "@/app/types/moduleList";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTranslation } from "react-i18next";

const ModulesPage = () => {
  const [modules, setModules] = useState<ModuleListResponse[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchModulesAndFavorites = async () => {
      try {
        setLoading(true);
        const [fetchedModules, fetchedFavorites] = await Promise.all([
          getModules(language),
          getFavoriteModules(language)
        ]);
        setModules(fetchedModules);
        setFavoriteIds(new Set(fetchedFavorites.map(m => m._id)));
      } catch (err) {
        console.error("Failed to fetch modules or favorites:", err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchModulesAndFavorites();
  }, [language, t]);

  if (loading && modules.length === 0) {
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
      <div className={`transition-opacity duration-300 ease-in-out ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <ModuleFilter modules={modules} favoriteIds={favoriteIds} />
      </div>
    </div>
  );
};

export default ModulesPage;
