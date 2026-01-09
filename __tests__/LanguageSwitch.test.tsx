import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import '@testing-library/jest-dom';
import Header from '../app/components/Header';
import i18n from '../app/i18n/i18n';

// Mock app's i18n instance
jest.mock('../app/i18n/i18n', () => ({
  changeLanguage: jest.fn(),
}));

// Mock lib/ai
jest.mock('../lib/ai', () => ({
  getRecommendations: jest.fn().mockResolvedValue([]),
}));

describe('Language Switch Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.localStorage.clear();
  });

  const renderHeader = () => {
    return render(<Header title="Test App" showSettings={true} />);
  };

  test('renders with default language (NL)', () => {
    renderHeader();
    
    const nlButton = screen.getByText('NL');
    const enButton = screen.getByText('EN');
    
    expect(nlButton).toBeInTheDocument();
    expect(enButton).toBeInTheDocument();
    
    expect(nlButton).toHaveClass('text-(--text-primary)');
    expect(enButton).toHaveClass('text-(--text-secondary)');
  });

  test('switches language to EN when EN button is clicked', () => {
    renderHeader();

    const enButton = screen.getByText('EN');
    
    fireEvent.click(enButton);

    expect(i18n.changeLanguage).toHaveBeenCalledWith('EN');
    expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('language', 'EN');
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
    expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('language', 'NL');
  });

  test('loads language from localStorage on mount', () => {
    globalThis.localStorage.getItem.mockReturnValue('EN');

    renderHeader();

    expect(i18n.changeLanguage).toHaveBeenCalledWith('EN');
  });
});