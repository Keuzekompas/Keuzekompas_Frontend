import { Cog6ToothIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSettings = false }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-lg" style={{boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
      <h1 className="text-2xl font-bold text-black">{title}</h1>
      {showSettings && <Cog6ToothIcon className="w-6 h-6 text-black" />}
    </header>
  );
};

export default Header;
