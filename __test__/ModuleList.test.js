import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ModuleFilter from '../app/components/ModuleFilter';
import '@testing-library/jest-dom';

// Mock modules lib
const mockModules = [
  {
    _id: '1',
    name: 'Introductie Programmeren',
    description: 'Leer de basis van programmeren.',
    location: 'Breda',
    studycredit: 30,
  },
  {
    _id: '2',
    name: 'Geavanceerde AI',
    description: 'Verdieping in kunstmatige intelligentie.',
    location: 'Den Bosch',
    studycredit: 15,
  },
  {
    _id: '3',
    name: 'Web Development',
    description: 'Bouw moderne websites.',
    location: 'Breda',
    studycredit: 30,
  },
];

jest.mock('../lib/modules', () => ({
  getModules: jest.fn().mockImplementation(async (lang, page, limit, search, location, ects) => {
    let filtered = [...mockModules];
    
    if (search) {
      filtered = filtered.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (location && location !== 'None') {
      filtered = filtered.filter(m => m.location === location);
    }
    if (ects && ects !== 0) {
      filtered = filtered.filter(m => m.studycredit === ects);
    }
    
    // Simple pagination mock
    return filtered.slice(0, limit);
  }),
}));

// Mock useDebounce
jest.mock('../app/hooks/useDebounce', () => ({
  useDebounce: (value) => value,
}));

describe('ModuleFilter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all modules initially', async () => {
    render(<ModuleFilter favoriteIds={new Set()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Introductie Programmeren')).toBeInTheDocument();
      expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });
  });

  test('filters modules by search query', async () => {
    render(<ModuleFilter favoriteIds={new Set()} />);
    
    // Wait for initial load
    await waitFor(() => screen.getByText('Introductie Programmeren'));

    const searchInput = screen.getByPlaceholderText('moduleFilter.searchPlaceholder');
    fireEvent.change(searchInput, { target: { value: 'AI' } });

    await waitFor(() => {
      expect(screen.queryByText('Introductie Programmeren')).not.toBeInTheDocument();
      expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
    });
  });

  test('filters modules by location', async () => {
    render(<ModuleFilter favoriteIds={new Set()} />);
    
    await waitFor(() => screen.getByText('Introductie Programmeren'));

    const locationSelect = screen.getByLabelText('moduleFilter.location');
    fireEvent.change(locationSelect, { target: { value: 'Den Bosch' } });

    await waitFor(() => {
      expect(screen.queryByText('Introductie Programmeren')).not.toBeInTheDocument();
      expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
    });
  });

  test('filters modules by ECTS', async () => {
    render(<ModuleFilter favoriteIds={new Set()} />);
    
    await waitFor(() => screen.getByText('Introductie Programmeren'));
    
    const ectsSelect = screen.getByLabelText('moduleFilter.ects');
    fireEvent.change(ectsSelect, { target: { value: '15' } });

    await waitFor(() => {
      expect(screen.queryByText('Introductie Programmeren')).not.toBeInTheDocument();
      expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
    });
  });

  test('filters modules by combined criteria', async () => {
    render(<ModuleFilter favoriteIds={new Set()} />);
    
    await waitFor(() => screen.getByText('Introductie Programmeren'));
    
    const searchInput = screen.getByPlaceholderText('moduleFilter.searchPlaceholder');
    const locationSelect = screen.getByLabelText('moduleFilter.location');
    
    fireEvent.change(searchInput, { target: { value: 'Programmeren' } });
    fireEvent.change(locationSelect, { target: { value: 'Breda' } });

    await waitFor(() => {
      expect(screen.getByText('Introductie Programmeren')).toBeInTheDocument();
      expect(screen.queryByText('Geavanceerde AI')).not.toBeInTheDocument();
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
    });
  });

  test('shows "Geen module gevonden" when no modules match', async () => {
    render(<ModuleFilter favoriteIds={new Set()} />);
    
    await waitFor(() => screen.getByText('Introductie Programmeren'));
    
    const searchInput = screen.getByPlaceholderText('moduleFilter.searchPlaceholder');
    fireEvent.change(searchInput, { target: { value: 'NonExistentModule' } });

    await waitFor(() => {
      expect(screen.getByText('moduleFilter.noModulesFound')).toBeInTheDocument();
    });
  });
});