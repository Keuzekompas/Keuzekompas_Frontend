import Image from 'next/image';
import SettingsIcon from './icons/settings.svg';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSettings = false }) => {
  return (
    <header className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {showSettings && <Image src={SettingsIcon} alt="Settings" width={24} height={24} />}
    </header>
  );
};

export default Header;
