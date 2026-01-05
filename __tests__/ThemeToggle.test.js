import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../app/components/Header';
import { ThemeProvider } from '../app/context/ThemeContext';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Theme Toggle Functionality', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = '';
  });

  test('toggles theme from light to dark and back', () => {
    render(
      <ThemeProvider>
        <Header title="Test Header" showSettings={true} />
      </ThemeProvider>
    );

    // Find the "Dark Mode" text
    const darkModeText = screen.getByText('Dark Mode');
    expect(darkModeText).toBeInTheDocument();

    // The toggle is the div next to the text. 
    // Since the div doesn't have a role, we can find it by class or structure.
    // Or we can add a data-testid to the component. 
    // Let's try to find it by the container.
    const toggleButton = darkModeText.nextElementSibling;
    
    // Initial state should be light (bg-gray-200)
    expect(toggleButton).toHaveClass('bg-gray-200');
    expect(document.documentElement).toHaveClass('light');

    // Click to toggle
    fireEvent.click(toggleButton);

    // Should be dark now
    expect(toggleButton).toHaveClass('bg-(--color-brand)');
    expect(document.documentElement).toHaveClass('dark');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Click again to toggle back
    fireEvent.click(toggleButton);

    // Should be light again
    expect(toggleButton).toHaveClass('bg-gray-200');
    expect(document.documentElement).toHaveClass('light');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  test('respects system preference if no local storage', () => {
    // Mock system preference to dark
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <Header title="Test Header" showSettings={true} />
      </ThemeProvider>
    );

    const darkModeText = screen.getByText('Dark Mode');
    const toggleButton = darkModeText.nextElementSibling;

    // Should be dark initially due to system preference
    expect(toggleButton).toHaveClass('bg-(--color-brand)');
    expect(document.documentElement).toHaveClass('dark');
  });

  test('loads theme from local storage', () => {
    window.localStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <Header title="Test Header" showSettings={true} />
      </ThemeProvider>
    );

    const darkModeText = screen.getByText('Dark Mode');
    const toggleButton = darkModeText.nextElementSibling;

    // Should be dark initially due to local storage
    expect(toggleButton).toHaveClass('bg-(--color-brand)');
    expect(document.documentElement).toHaveClass('dark');
  });
});
