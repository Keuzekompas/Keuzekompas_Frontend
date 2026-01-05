import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ModuleResponse } from '../types/module';

type ModuleCardProps = ModuleResponse;

const ModuleCard: React.FC<ModuleCardProps> = ({ _id, name_nl, description_nl, location, studycredit }) => {
  return (
    <Link href={`/modules/${_id}`} className="block mb-4">
      <div className="bg-(--bg-input) text-(--text-primary) p-4 rounded-lg shadow-md flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-bold text-lg">{name_nl}</h3>
          <p className="text-(--text-secondary) max-h-12 overflow-hidden text-ellipsis">{description_nl}</p>
          <div className="flex items-center mt-4 text-(--text-secondary)">
            <div className="flex items-center mr-4">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
            <div>
              <span>EC&apos;s: {studycredit}</span>
            </div>
          </div>
        </div>
        <HeartIcon className="w-6 h-6 shrink-0 text-(--icon-color)" />
      </div>
    </Link>
  );
};

export default ModuleCard;
