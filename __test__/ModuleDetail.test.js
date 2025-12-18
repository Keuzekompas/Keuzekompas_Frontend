import { render, screen } from '@testing-library/react';
import Page from '../app/modules/[id]/page';
import { getModuleById } from '../lib/modules';
import { notFound } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../lib/modules', () => ({
  getModuleById: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('next/link', () => {
  // eslint-disable-next-line react/prop-types
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

const mockModule = {
  _id: '1',
  name_nl: 'Test Module NL',
  name_en: 'Test Module EN',
  description_nl: 'Beschrijving van de module',
  description_en: 'Description of the module',
  studycredit: 5,
  location: 'Breda',
  level: 'HBO-ICT',
  module_tags_nl: "['Tag1', 'Tag2']",
  module_tags_en: "['Tag1', 'Tag2']",
  start_date: '2024-09-01T00:00:00.000Z',
  available_spots: 20,
};

describe('Module Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls notFound when module is not found', async () => {
    (getModuleById).mockResolvedValue(null);

    const params = Promise.resolve({ id: '999' });
    
    try {
        await Page({ params });
    } catch (e) {
        // Page might throw if notFound throws, or just return null/undefined depending on mock implementation
    }

    expect(notFound).toHaveBeenCalled();
  });

  test('handles malformed tags gracefully', async () => {
    const moduleWithBadTags = {
      ...mockModule,
      module_tags_nl: "Bad Tag Format, Another Tag", // Not JSON array
    };
    (getModuleById).mockResolvedValue(moduleWithBadTags);

    const params = Promise.resolve({ id: '1' });
    const jsx = await Page({ params });
    render(jsx);

    expect(screen.getByText('Bad Tag Format')).toBeInTheDocument();
    expect(screen.getByText('Another Tag')).toBeInTheDocument();
  });

  test('handles empty tags', async () => {
    const moduleWithNoTags = {
      ...mockModule,
      module_tags_nl: "[]",
    };
    (getModuleById).mockResolvedValue(moduleWithNoTags);

    const params = Promise.resolve({ id: '1' });
    const jsx = await Page({ params });
    render(jsx);

    expect(screen.getByText('Geen tags')).toBeInTheDocument();
  });
});
