import { render, screen, waitFor } from '@testing-library/react';
import Page from '../app/modules/[id]/page';
import { getModuleById } from '../lib/modules';
import { notFound, useParams } from 'next/navigation';
import '@testing-library/jest-dom';
import { LanguageProvider } from '../app/context/LanguageContext';

// Mock dependencies
jest.mock('../lib/modules', () => ({
  getModuleById: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('next/link', () => {
  // eslint-disable-next-line react/prop-types
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

const mockModule = {
  _id: '1',
  name: 'Test Module NL',
  description: 'Beschrijving van de module',
  studycredit: 5,
  location: 'Breda',
  level: 'HBO-ICT',
  module_tags: "['Tag1', 'Tag2']",
  start_date: '2024-09-01T00:00:00.000Z',
  available_spots: 20,
};

// Helper to render with providers
const renderWithProviders = (ui) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('Module Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls notFound when module is not found', async () => {
    (useParams).mockReturnValue({ id: '999' });
    (getModuleById).mockResolvedValue(null);

    renderWithProviders(<Page />);
    
    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  test('renders module details when found', async () => {
    (useParams).mockReturnValue({ id: '1' });
    (getModuleById).mockResolvedValue({ data: mockModule });

    renderWithProviders(<Page />);

    await waitFor(() => {
      expect(screen.getAllByText('Test Module NL')[0]).toBeInTheDocument();
      expect(screen.getByText('Beschrijving van de module')).toBeInTheDocument();
      expect(screen.getByText('Tag1')).toBeInTheDocument();
    });
  });

  test('handles malformed tags gracefully', async () => {
    const moduleWithBadTags = {
      ...mockModule,
      module_tags: "Bad Tag Format, Another Tag", // Not JSON array
    };
    (useParams).mockReturnValue({ id: '1' });
    (getModuleById).mockResolvedValue({ data: moduleWithBadTags });

    renderWithProviders(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Bad Tag Format')).toBeInTheDocument();
      expect(screen.getByText('Another Tag')).toBeInTheDocument();
    });
  });

  test('handles empty tags', async () => {
    const moduleWithNoTags = {
      ...mockModule,
      module_tags: "[]",
    };
    (useParams).mockReturnValue({ id: '1' });
    (getModuleById).mockResolvedValue({ data: moduleWithNoTags });

    renderWithProviders(<Page />);

    await waitFor(() => {
      expect(screen.getByText('moduleDetail.noTags')).toBeInTheDocument();
    });
  });
});