"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFavoriteModules } from "@/lib/modules";
import { useLanguage } from "@/app/context/LanguageContext";
import type { ModuleListResponse } from "@/app/types/moduleList";
import ModuleCard from "@/app/components/ModuleCard";

const FavoritesPage = () => {
  const [favoriteModules, setFavoriteModules] = useState<ModuleListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFavoriteModules = async () => {
      try {
        setLoading(true);
        const fetchedFavoriteModules = await getFavoriteModules(language);
        setFavoriteModules(fetchedFavoriteModules);
      } catch (err) {
        console.error("Failed to fetch favorite modules:", err);
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteModules();
  }, [language, t]);

    if (loading && favoriteModules.length === 0) {
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
    <div className="p-5">
       <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-(--text-primary)">
          {t("favoritesHeader.title")}
        </h2>
       </div>

       {favoriteModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteModules.map((module) => (
             <ModuleCard key={module._id} {...module} initialIsFavorite={true} />
          ))}
        </div>
       ) : (
        <div className="flex justify-center items-center mt-10">
          <p className="text-(--text-secondary)">{t('moduleFilter.noModulesFound')}</p>
        </div>
       )}
    </div>
  );
};

export default FavoritesPage;
