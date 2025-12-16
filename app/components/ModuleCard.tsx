import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline';

interface ModuleCardProps {
  title: string;
  description: string;
  location: string;
  ects: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, location, ects }) => {
  return (
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
            <span>ECs: {ects}</span>
          </div>
        </div>
      </div>
      <StarIcon className="w-6 h-6" />
    </div>
  );
};

export default ModuleCard;
