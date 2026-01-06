"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFavoriteModules } from "@/lib/modules";
import { useLanguage } from "@/app/context/LanguageContext";
import type { ModuleListResponse } from "@/app/types/moduleList";

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
    <div className="flex items-center justify-between p-5">
      <h2 className="text-xl font-bold text-(--text-primary)]">
        {t("favoritesHeader.title")}
      </h2>
    </div>
  );
};

export default FavoritesPage;
