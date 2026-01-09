import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { LanguageProvider } from '@/app/context/LanguageContext';
import { RecommendationProvider } from '@/app/context/RecommendationContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RecommendationProvider>
          {children}
        </RecommendationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
