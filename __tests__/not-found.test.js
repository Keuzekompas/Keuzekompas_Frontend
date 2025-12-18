import { render, screen, act } from '@testing-library/react';
import NotFound from '../app/not-found'; // Pas het pad aan indien nodig

describe('NotFound Page', () => {
  
  it('renders de statische elementen correct', () => {
    render(<NotFound />);

    // 1. Check of de uitleg tekst er is
    const textElement = screen.getByText(/Oops! The page you're looking for/i);
    expect(textElement).toBeInTheDocument();

    // 2. Check of de link naar de modules er is en correct verwijst
    const linkElement = screen.getByRole('link', { name: /Go to Modules/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/modules');

    // 3. Check of de afbeelding er is (via alt tekst)
    const imageElement = screen.getByAltText('404 Not Found');
    expect(imageElement).toBeInTheDocument();
  });

  // (Optioneel) Geavanceerd: Testen of het typ-effect werkt
  it('start met typen van 404', async () => {
    jest.useFakeTimers(); // Neem de tijd over
    render(<NotFound />);

    // In het begin is de tekst leeg
    // We zoeken de H1 waar de tekst in komt (de parent van de span)
    // Omdat de tekst dynamisch is, kunnen we niet direct getByText("404") doen
    
    // Spoel de tijd vooruit (bijv. 300ms voor de eerste letter)
    act(() => {
      jest.advanceTimersByTime(300); 
    });

    // Nu zou er "4" moeten staan. 
    // findByText is asynchroon en wacht even, handig voor updates
    const textPart = await screen.findByText('4');
    expect(textPart).toBeInTheDocument();

    jest.useRealTimers(); // Ruim op
  });
});