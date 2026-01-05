import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../app/components/Header';
import { LanguageProvider } from '../app/context/LanguageContext';
import { ThemeProvider } from '../app/context/ThemeContext';

// Mock i18n instance used in LanguageContext
jest.mock('../app/i18n/i18n', () => ({
  changeLanguage: jest.fn(),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'header.language': 'Language',
        'header.darkMode': 'Dark Mode',
        'header.logout': 'Logout',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    key: jest.fn(),
    length: 0,
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia for ThemeProvider
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import i18n from '../app/i18n/i18n';

describe('Language Switch Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  const renderHeader = () => {
    return render(
      <ThemeProvider>
        <LanguageProvider>
          <Header title="Test App" showSettings={true} />
        </LanguageProvider>
      </ThemeProvider>
    );
  };

  test('renders with default language (NL)', () => {
    renderHeader();
    
    // The buttons are inside a details element, so they might be considered hidden if details is closed.
    // We can use { hidden: true } to find them regardless of visibility in JSDOM
    const nlButton = screen.getByText('NL');
    const enButton = screen.getByText('EN');
    
    expect(nlButton).toBeInTheDocument();
    expect(enButton).toBeInTheDocument();
    
    // Check if NL is active. 
    // Based on the implementation:
    // className={`... ${language === 'NL' ? 'text-(--text-primary)' : 'text-(--text-secondary) ...'}`}
    // We can check for the class that indicates active state.
    // Note: tailwind classes might be complex to match exactly string-wise if order changes, 
    // but here we can check for the specific text color class.
    
    expect(nlButton).toHaveClass('text-(--text-primary)');
    expect(enButton).toHaveClass('text-(--text-secondary)');
  });

  test('switches language to EN when EN button is clicked', () => {
    renderHeader();

    const enButton = screen.getByText('EN');
    
    fireEvent.click(enButton);

    // Verify i18n.changeLanguage was called
    expect(i18n.changeLanguage).toHaveBeenCalledWith('EN');
    
    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'EN');
  });

  test('switches language back to NL when NL button is clicked', () => {
    renderHeader();

    // First switch to EN
    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);
    
    expect(i18n.changeLanguage).toHaveBeenCalledWith('EN');
    
    // Then switch back to NL
    const nlButton = screen.getByText('NL');
    fireEvent.click(nlButton);
    
    expect(i18n.changeLanguage).toHaveBeenCalledWith('NL');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'NL');
  });

  test('loads language from localStorage on mount', () => {
    // Set localStorage before render
    localStorageMock.getItem.mockReturnValue('EN');

    renderHeader();

    // Should have called changeLanguage with EN on mount
    expect(i18n.changeLanguage).toHaveBeenCalledWith('EN');
  });
});
