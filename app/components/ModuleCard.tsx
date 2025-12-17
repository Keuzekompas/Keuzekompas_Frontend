import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ModuleCardProps {
  id: number;
  title: string;
  description: string;
  location: string;
  ects: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ id, title, description, location, ects }) => {
  return (
    <Link href={`/modules/${id}`} className="block mb-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-gray-600">{description}</p>
          <div className="flex items-center mt-4">
            <div className="flex items-center mr-4">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{location}</span>
            </div>
            <div>
              <span>EC&apos;s: {ects}</span>
            </div>
          </div>
        </div>
        <HeartIcon className="w-6 h-6" />
      </div>
    </Link>
  );
};

export default ModuleCard;
