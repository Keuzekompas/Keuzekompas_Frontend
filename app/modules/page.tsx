"use client";
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ModuleCard from '../components/ModuleCard';

const modules = [
  {
    title: 'Cybersecurity',
    description: 'Je leert veilig om te gaan met code',
    location: 'Breda',
    ects: 15,
  },
  {
    title: 'AI for Business',
    description: 'Ontdek de zakelijke kansen van AI',
    location: 'Den Bosch',
    ects: 30,
  },
  {
    title: 'Game Development',
    description: 'Bouw je eigen game van A tot Z',
    location: 'Breda',
    ects: 30,
  },
  {
    title: 'Frontend Development',
    description: 'Specialiseer je in moderne webinterfaces',
    location: 'Tilburg',
    ects: 15,
  },
  {
    title: 'Data Science',
    description: 'Leer data analyseren en visualiseren',
    location: 'Den Bosch',
    ects: 30,
  },
  {
    title: 'UX/UI Design',
    description: 'Ontwerp gebruiksvriendelijke interfaces',
    location: 'Breda',
    ects: 15,
  },
  {
    title: 'Cloud Engineering',
    description: 'Word een expert in cloud-oplossingen',
    location: 'Tilburg',
    ects: 30,
  },
  {
    title: 'Mobile App Development',
    description: 'Ontwikkel apps voor iOS en Android',
    location: 'Breda',
    ects: 30,
  },
  {
    title: 'Creative Programming',
    description: 'Combineer code met kunst en design',
    location: 'Den Bosch',
    ects: 15,
  },
  {
    title: 'Ethical Hacking',
    description: 'Leer systemen te beveiligen door ze aan te vallen',
    location: 'Breda',
    ects: 15,
  },
];

const ModulesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Geen');
  const [ects, setEcts] = useState(0);

  const filteredModules = modules.filter(module => {
    const searchMatch = module.title.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = location === 'Geen' || module.location === location;
    const ectsMatch = ects === 0 || module.ects === ects;
    return searchMatch && locationMatch && ectsMatch;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Keuzemodules bij Avans</h2>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Value"
          className="w-full p-2 pl-10 border rounded-lg"
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="locatie" className="block text-sm font-medium text-gray-700">
            Locatie
          </label>
          <select
            id="locatie"
            className="w-full p-2 border rounded-lg"
            onChange={e => setLocation(e.target.value)}
          >
            <option>Geen</option>
            <option>Breda</option>
            <option>Den Bosch</option>
            <option>Tilburg</option>
          </select>
        </div>
        <div className="w-1/2 pl-2">
          <label htmlFor="ects" className="block text-sm font-medium text-gray-700">
            ECT's
          </label>
          <select
            id="ects"
            className="w-full p-2 border rounded-lg"
            onChange={e => setEcts(parseInt(e.target.value))}
          >
            <option value="0">Alle</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredModules.length > 0 ? (
          filteredModules.map((module, index) => (
            <ModuleCard key={index} {...module} />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">Geen modules gevonden</div>
        )}
      </div>
    </div>
  );
};

export default ModulesPage;