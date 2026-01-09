"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { addFavorite, removeFavorite, getFavoriteModules } from "@/lib/modules";
import { useLanguage } from "@/app/context/LanguageContext";

type FavoriteIconProps = {
  moduleId: string;
  onRemove?: (id: string) => void;
};

const FavoriteIcon: React.FC<FavoriteIconProps> = ({
  moduleId,
  onRemove,
}) => {
  const { language } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if this module is in the user's favorites on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await getFavoriteModules(language);
        setIsFavorite(favorites.some(fav => fav._id === moduleId));
      } catch (error) {
        console.error("Error checking favorite status", error);
      } finally {
        setIsInitialized(true);
      }
    };

    checkFavoriteStatus();
  }, [moduleId, language]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    try {
      let success;
      if (isFavorite) {
        success = await removeFavorite(moduleId);
        if (success && onRemove) {
          onRemove(moduleId);
        }
      } else {
        success = await addFavorite(moduleId);
      }

      if (success) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading || !isInitialized}
      className="cursor-pointer focus:outline-hidden p-1 rounded-full hover:bg-(--bg-input) transition-colors"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <HeartIconSolid className="w-6 h-6 shrink-0 text-(--color-brand)" />
      ) : (
        <HeartIcon className="w-6 h-6 shrink-0 text-(--icon-color) hover:text-(--color-brand)" />
      )}
    </button>
  );
};

export default FavoriteIcon;
