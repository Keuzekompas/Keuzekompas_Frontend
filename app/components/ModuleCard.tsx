"use client";
import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ModuleListResponse } from '../types/moduleList';
import { useTranslation } from 'react-i18next';

type ModuleCardProps = ModuleListResponse & {
  score?: number;
  onReasonClick?: () => void;
  showReasonButton?: boolean;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ _id, name, description, location, studycredit, score, onReasonClick, showReasonButton }) => {
  const { t } = useTranslation();
  
  return (
    <Link href={`/modules/${_id}`} className="block mb-4 group relative">
      <div className="bg-(--bg-input) text-(--text-primary) p-4 rounded-lg shadow-md flex justify-between items-start transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-[1.01] group-hover:bg-(--bg-card)">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex justify-between items-center mb-1">
             <h3 className="font-bold text-lg leading-tight">{name}</h3>
          </div>
          <p className="text-(--text-secondary) max-h-12 overflow-hidden text-ellipsis text-sm">{description}</p>
          <div className="flex items-center mt-3 text-(--text-secondary) text-xs sm:text-sm">
            <div className="flex items-center mr-4">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
            <div>
              <span>{t('moduleDetail.ec')}: {studycredit}</span>
            </div>
          </div>
          {showReasonButton && onReasonClick && (
            <button 
                onClick={(e) => { e.preventDefault(); onReasonClick(); }}
                className="text-sm text-(--color-brand) mt-2 underline z-10 relative hover:text-(--color-brand-hover)"
            >
                {t('ai.whyThisModule')}
            </button>
          )}
        </div>
        <HeartIcon className="w-6 h-6 shrink-0 text-(--icon-color)" />
      </div>
    </Link>
  );
};

export default ModuleCard;
