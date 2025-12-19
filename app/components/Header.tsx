"use client";

import { Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSettings = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4 bg-(--bg-card) shadow-lg border-b border-(--border-divider)" style={{boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
      <h1 className="text-2xl font-bold text-(--color-brand)">{title}</h1>
      {showSettings && (
        <details className="relative">
          <summary className="list-none cursor-pointer p-1 rounded-full hover:bg-(--bg-input) focus:outline-none [&::-webkit-details-marker]:hidden">
            <Cog6ToothIcon className="w-6 h-6 text-(--text-primary)" />
          </summary>

          <div className="absolute right-0 mt-2 w-64 bg-(--bg-card) rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 p-4 border border-(--border-divider)">
            {/* Language Toggle */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-(--text-secondary)">Language</span>
              <div className="flex bg-(--bg-input) rounded-full p-1">
                <button className="px-3 py-1 text-xs font-bold bg-(--bg-card) rounded-full shadow-sm text-(--text-primary)">NL</button>
                <button className="px-3 py-1 text-xs font-medium text-(--text-secondary) hover:text-(--text-primary)">EN</button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-(--text-secondary)">Dark Mode</span>
              <div 
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-(--color-brand)' : 'bg-gray-200'}`}
                onClick={toggleTheme}
              >
                <span 
                  className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} 
                />
              </div>
            </div>

            <div className="h-px bg-(--border-divider) my-2" />

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
