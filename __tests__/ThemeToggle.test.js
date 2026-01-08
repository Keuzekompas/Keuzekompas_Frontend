import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import '@testing-library/jest-dom';
import Header from '../app/components/Header';

// Mock lib/ai (specific to this context/component usage)
jest.mock('../lib/ai', () => ({
  getRecommendations: jest.fn().mockResolvedValue([]),
}));

describe('Theme Toggle Functionality', () => {
  beforeEach(() => {
    // Clear the global localStorage mock we set up in jest.setup.js
    global.localStorage.clear();
    document.documentElement.className = '';
  });

  test('toggles theme from light to dark and back', () => {
    render(<Header title="Test Header" showSettings={true} />);

    // Find the toggle button by role
    const toggleButton = screen.getByRole('switch', { name: /header.darkMode/i });
    expect(toggleButton).toBeInTheDocument();
    
    // Initial state should be light (bg-gray-200)
    expect(toggleButton).toHaveClass('bg-gray-200');
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement).toHaveClass('light');

    // Click to toggle
    fireEvent.click(toggleButton);

    // Should be dark now
    expect(toggleButton).toHaveClass('bg-(--color-brand)');
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveClass('dark');
    expect(global.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Click again to toggle back
    fireEvent.click(toggleButton);

    // Should be light again
    expect(toggleButton).toHaveClass('bg-gray-200');
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement).toHaveClass('light');
    expect(global.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  test('respects system preference if no local storage', () => {
    // Mock system preference to dark
    // @ts-ignore
    global.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<Header title="Test Header" showSettings={true} />);

    const toggleButton = screen.getByRole('switch', { name: /header.darkMode/i });

    // Should be dark initially due to system preference
    expect(toggleButton).toHaveClass('bg-(--color-brand)');
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveClass('dark');
  });

  test('loads theme from local storage', () => {
    global.localStorage.getItem.mockReturnValue('dark');

    render(<Header title="Test Header" showSettings={true} />);

    const toggleButton = screen.getByRole('switch', { name: /header.darkMode/i });

    // Should be dark initially due to local storage
    expect(toggleButton).toHaveClass('bg-(--color-brand)');
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveClass('dark');
  });
});