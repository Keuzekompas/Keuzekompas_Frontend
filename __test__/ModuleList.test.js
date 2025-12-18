import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModuleFilter from '../app/components/ModuleFilter';
import '@testing-library/jest-dom';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock data
const mockModules = [
  {
    _id: '1',
    name_nl: 'Introductie Programmeren',
    description_nl: 'Leer de basis van programmeren.',
    location: 'Breda',
    studycredit: 30,
    name_en: 'Introduction to Programming',
    description_en: 'Learn the basics of programming.',
    level: 'Beginner',
    module_tags_en: 'Programming, Basics',
    module_tags_nl: 'Programmeren, Basis',
    start_date: '2024-09-01',
    available_spots: 20,
  },
  {
    _id: '2',
    name_nl: 'Geavanceerde AI',
    description_nl: 'Verdieping in kunstmatige intelligentie.',
    location: 'Den Bosch',
    studycredit: 15,
    name_en: 'Advanced AI',
    description_en: 'Deep dive into artificial intelligence.',
    level: 'Advanced',
    module_tags_en: 'AI, Machine Learning',
    module_tags_nl: 'AI, Machine Learning',
    start_date: '2024-09-01',
    available_spots: 15,
  },
  {
    _id: '3',
    name_nl: 'Web Development',
    description_nl: 'Bouw moderne websites.',
    location: 'Breda',
    studycredit: 30,
    name_en: 'Web Development',
    description_en: 'Build modern websites.',
    level: 'Intermediate',
    module_tags_en: 'Web, Frontend',
    module_tags_nl: 'Web, Frontend',
    start_date: '2024-09-01',
    available_spots: 25,
  },
];

describe('ModuleFilter Component', () => {
  test('renders all modules initially', () => {
    render(<ModuleFilter modules={mockModules} />);
    
    expect(screen.getByText('Introductie Programmeren')).toBeInTheDocument();
    expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
  });

  test('filters modules by search query', () => {
    render(<ModuleFilter modules={mockModules} />);
    
    const searchInput = screen.getByPlaceholderText('Search for modules');
    fireEvent.change(searchInput, { target: { value: 'AI' } });

    expect(screen.queryByText('Introductie Programmeren')).not.toBeInTheDocument();
    expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
    expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
  });

  test('filters modules by location', () => {
    render(<ModuleFilter modules={mockModules} />);
    
    const locationSelect = screen.getByLabelText('Locatie');
    fireEvent.change(locationSelect, { target: { value: 'Den Bosch' } });

    expect(screen.queryByText('Introductie Programmeren')).not.toBeInTheDocument();
    expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
    expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
  });

  test('filters modules by ECTS', () => {
    render(<ModuleFilter modules={mockModules} />);
    
    const ectsSelect = screen.getByLabelText("EC's");
    fireEvent.change(ectsSelect, { target: { value: '15' } });

    expect(screen.queryByText('Introductie Programmeren')).not.toBeInTheDocument();
    expect(screen.getByText('Geavanceerde AI')).toBeInTheDocument();
    expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
  });

  test('filters modules by combined criteria', () => {
    render(<ModuleFilter modules={mockModules} />);
    
    const searchInput = screen.getByPlaceholderText('Search for modules');
    const locationSelect = screen.getByLabelText('Locatie');
    
    fireEvent.change(searchInput, { target: { value: 'Programmeren' } });
    fireEvent.change(locationSelect, { target: { value: 'Breda' } });

    expect(screen.getByText('Introductie Programmeren')).toBeInTheDocument();
    expect(screen.queryByText('Geavanceerde AI')).not.toBeInTheDocument();
    expect(screen.queryByText('Web Development')).not.toBeInTheDocument();
  });

  test('shows "Geen module gevonden" when no modules match', () => {
    render(<ModuleFilter modules={mockModules} />);
    
    const searchInput = screen.getByPlaceholderText('Search for modules');
    fireEvent.change(searchInput, { target: { value: 'NonExistentModule' } });

    expect(screen.getByText('Geen module gevonden.')).toBeInTheDocument();
  });
});
