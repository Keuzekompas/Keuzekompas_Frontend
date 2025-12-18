import { render, screen, act } from '@testing-library/react';
import NotFound from '../app/not-found'; 

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