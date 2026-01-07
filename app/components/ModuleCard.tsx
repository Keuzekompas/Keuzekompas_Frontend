"use client";
import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { ModuleListResponse } from '../types/moduleList';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { addFavorite, removeFavorite } from '@/lib/modules';

type ModuleCardProps = ModuleListResponse & {
  initialIsFavorite?: boolean;
  onRemove?: (id: string) => void;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ _id, name, description, location, studycredit, initialIsFavorite = false, onRemove }) => {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    
    if (isLoading) return;
    setIsLoading(true);

    try {
      let success;
      if (isFavorite) {
        success = await removeFavorite(_id);
        if (success && onRemove) {
          onRemove(_id);
        }
      } else {
        success = await addFavorite(_id);
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
    <Link href={`/modules/${_id}`} className="block mb-4 group">
      <div className="bg-(--bg-input) text-(--text-primary) p-4 rounded-lg shadow-md flex justify-between items-start transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-[1.01] group-hover:bg-(--bg-card)">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-(--text-secondary) max-h-12 overflow-hidden text-ellipsis">{description}</p>
          <div className="flex items-center mt-4 text-(--text-secondary)">
            <div className="flex items-center mr-4">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
            <div>
              <span>{t('moduleDetail.ec')}: {studycredit}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={toggleFavorite}
          disabled={isLoading}
          className="cursor-pointer focus:outline-hidden p-1 rounded-full hover:bg-(--bg-hover) transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-6 h-6 shrink-0 text-red-500" />
          ) : (
            <HeartIcon className="w-6 h-6 shrink-0 text-(--icon-color) hover:text-red-500" />
          )}
        </button>
      </div>
    </Link>
  );
};

export default ModuleCard;
