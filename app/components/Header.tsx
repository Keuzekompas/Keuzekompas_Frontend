import { Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSettings = false }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-lg" style={{boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
      <h1 className="text-2xl font-bold text-black">{title}</h1>
      {showSettings && (
        <details className="relative">
          <summary className="list-none cursor-pointer p-1 rounded-full hover:bg-gray-100 focus:outline-none [&::-webkit-details-marker]:hidden">
            <Cog6ToothIcon className="w-6 h-6 text-black" />
          </summary>

          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 p-4 border border-gray-100">
            {/* Language Toggle */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Language</span>
              <div className="flex bg-gray-100 rounded-full p-1">
                <button className="px-3 py-1 text-xs font-bold bg-white rounded-full shadow-sm text-gray-900">NL</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">EN</button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Dark Mode</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </div>
            </div>

            <div className="h-px bg-gray-100 my-2" />

            {/* Logout */}
            <button className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </details>
      )}
    </header>
  );
};

export default Header;
