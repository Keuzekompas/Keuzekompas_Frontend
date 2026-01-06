"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getModules } from "@/lib/modules";
import { useLanguage } from "@/app/context/LanguageContext";

const FavoritesPage = () => {
  const { t } = useTranslation();
  const fetchFavoriteModules = async () => {
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const [favoriteModules, setFavoriteModules] = useState<FavoriteModuleListResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
      const fetchFavoriteModules = async () => {
        try {
          setLoading(true);
          const fetchedFavoriteModules = await getModules(language);
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

    return (
      <div className="flex items-center justify-between p-5">
        <h2 className="text-xl font-bold text-(--text-primary)]">
          {t("favoritesHeader.title")}
        </h2>
      </div>
    );
  };
};

export default FavoritesPage;
