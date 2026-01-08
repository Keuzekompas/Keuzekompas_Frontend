"use client";

import { useState, useEffect } from "react";
import ModuleFilter from "../components/ModuleFilter";
import ModulesHeader from "../components/ModulesHeader";
import { getFavoriteModules } from "@/lib/modules";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTranslation } from "react-i18next";

const ModulesPage = () => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const fetchedFavorites = await getFavoriteModules(language);
        setFavoriteIds(new Set(fetchedFavorites.map(m => m._id)));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [language, t]);

  if (loading) {
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
        <ModuleFilter favoriteIds={favoriteIds} />
      </div>
    </div>
  );
};

export default ModulesPage;
