"use client";

import { Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../utils/apiFetch';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useRecommendations } from '../context/RecommendationContext';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSettings = false }) => {
  const { clearRecommendations } = useRecommendations();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    try {
      clearRecommendations();
      await apiFetch('/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // ignore errors on logout
    } finally {
      router.push('/');
    }
  }
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

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
              <span className="text-sm font-medium text-(--text-secondary)">{t('header.language')}</span>
              <div className="relative grid grid-cols-2 bg-(--bg-input) rounded-full p-1 w-24">
                <div
                  className={`absolute top-1 bottom-1 left-1 bg-(--bg-card) rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                    language === 'EN' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                  style={{ width: 'calc(50% - 4px)' }}
                />
                <button 
                  onClick={() => setLanguage('NL')}
                  className={`relative z-10 text-xs font-bold py-1 transition-colors duration-300 ${language === 'NL' ? 'text-(--text-primary)' : 'text-(--text-secondary) hover:text-(--text-primary)'}`}
                >
                  NL
                </button>
                <button 
                  onClick={() => setLanguage('EN')}
                  className={`relative z-10 text-xs font-bold py-1 transition-colors duration-300 ${language === 'EN' ? 'text-(--text-primary)' : 'text-(--text-secondary) hover:text-(--text-primary)'}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-(--text-secondary)" id="theme-toggle-label">{t('header.darkMode')}</span>
              <button 
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                aria-labelledby="theme-toggle-label"
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-brand) ${theme === 'dark' ? 'bg-(--color-brand)' : 'bg-gray-200'}`}
                onClick={toggleTheme}
              >
                <span 
                  className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} 
                />
              </button>
            </div>

            <div className="h-px bg-(--border-divider) my-2" />

            {/* Logout */}
            <button onClick={handleLogout} className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              {t('header.logout')}
            </button>
          </div>
        </details>
      )}
    </header>
  );
};

export default Header;
