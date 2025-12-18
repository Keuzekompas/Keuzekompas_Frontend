import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Module } from '../types/module';

type ModuleCardProps = Module;

const ModuleCard: React.FC<ModuleCardProps> = ({ _id, name_nl, description_nl, location, studycredit }) => {
  return (
    <Link href={`/modules/${_id}`} className="block mb-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{name_nl}</h3>
          <p className="text-gray-600 max-h-12 overflow-hidden text-ellipsis">{description_nl}</p>
          <div className="flex items-center mt-4">
            <div className="flex items-center mr-4">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
            <div>
              <span>EC&apos;s: {studycredit}</span>
            </div>
          </div>
        </div>
        <HeartIcon className="w-6 h-6 flex-shrink-0" />
      </div>
    </Link>
  );
};

export default ModuleCard;
