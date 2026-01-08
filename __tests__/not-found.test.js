import { render, screen, act } from '@testing-library/react';
import NotFound from '../app/not-found'; 
import '@testing-library/jest-dom';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'notFound.title') return '404';
      if (key === 'notFound.message') return "Oops! The page you're looking for doesn't exist.";
      if (key === 'notFound.button') return 'Go to Modules';
      return key;
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

describe('NotFound Page', () => {
  
  it('renders de statische elementen correct', () => {
    render(<NotFound />);

    const textElement = screen.getByText(/Oops! The page you're looking for/i);
    expect(textElement).toBeInTheDocument();

    const linkElement = screen.getByRole('link', { name: /Go to Modules/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/modules');

    const imageElement = screen.getByAltText('404 Not Found');
    expect(imageElement).toBeInTheDocument();
  });

  it('start met typen van 404', async () => {
    jest.useFakeTimers();
    render(<NotFound />);

    act(() => {
      jest.advanceTimersByTime(300); 
    });

    const textPart = await screen.findByText('4');
    expect(textPart).toBeInTheDocument();

    jest.useRealTimers();
  });
});