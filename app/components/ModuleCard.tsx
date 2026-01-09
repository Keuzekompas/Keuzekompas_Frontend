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
  score?: number;
  showReasonButton?: boolean;
  onReasonClick?: () => void;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  _id, 
  name, 
  description, 
  location, 
  studycredit, 
  initialIsFavorite = false, 
  onRemove,
  showReasonButton: explicitShowReasonButton,
  onReasonClick: explicitOnReasonClick
}) => {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  
  const showReasonButton = explicitShowReasonButton ?? false;
  const onReasonClick = explicitOnReasonClick;

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
    <Link href={`/modules/${_id}`} className="block mb-4 group relative">
      <div className="bg-(--bg-input) text-(--text-primary) p-4 rounded-lg shadow-md flex justify-between items-start transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-[1.01] group-hover:bg-(--bg-card)">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex justify-between items-center mb-1">
             <h3 className="font-bold text-lg leading-tight">{name}</h3>
          </div>
          <p className="text-(--text-secondary) text-sm line-clamp-2">{description}</p>
          <div className="flex items-center mt-3 text-(--text-secondary) text-xs sm:text-sm">
            <div className="flex items-center mr-4">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
            <div>
              <span>{studycredit} {t('moduleDetail.ec')}</span>
            </div>
          </div>
          {showReasonButton && onReasonClick && (
            <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation();
                  onReasonClick(); 
                }}
                className="text-sm text-(--color-brand) mt-2 underline z-10 relative hover:text-(--color-brand-hover)"
            >
                {t('ai.whyThisModule')}
            </button>
          )}
        </div>
        <button 
          onClick={toggleFavorite}
          disabled={isLoading}
          className="cursor-pointer focus:outline-hidden p-1 rounded-full hover:bg-(--bg-input) transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-6 h-6 shrink-0 text-(--color-brand)" />
          ) : (
            <HeartIcon className="w-6 h-6 shrink-0 text-(--icon-color) hover:text-(--color-brand)" />
          )}
        </button>
      </div>
    </Link>
  );
};

export default ModuleCard;
