import Image from 'next/image';
import LocationIcon from './icons/location.svg';
import StarIcon from './icons/star.svg';

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
            <Image src={LocationIcon} alt="Location" width={16} height={16} className="mr-1" />
            <span>{location}</span>
          </div>
          <div>
            <span>ECs: {ects}</span>
          </div>
        </div>
      </div>
      <Image src={StarIcon} alt="Favorite" width={24} height={24} />
    </div>
  );
};

export default ModuleCard;
