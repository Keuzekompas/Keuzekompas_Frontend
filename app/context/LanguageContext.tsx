"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type Language = 'NL' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('NL');

  const updateLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    // Optionally save to local storage here
    localStorage.setItem('language', lang);
  }, []);

  const value = useMemo(() => ({ language, setLanguage: updateLanguage }), [language, updateLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
