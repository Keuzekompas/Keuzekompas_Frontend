"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ModuleCard from "./ModuleCard";
import { Module } from "../types/module";

const ModuleFilter = ({ modules }: { modules: Module[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Geen");
  const [ects, setEcts] = useState(0);

  const filteredModules = modules.filter((module) => {
    const searchMatch = module.name_nl
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const locationMatch =
      location === "Geen" ||
      module.location?.toLowerCase().includes(location.toLowerCase());

    const ectsMatch = ects === 0 || module.studycredit === ects;
    return searchMatch && locationMatch && ectsMatch;
  });

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for modules"
          className="w-full p-2 pl-10 border rounded-lg"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label
            htmlFor="locatie"
            className="block text-sm font-medium text-gray-700"
          >
            Locatie
          </label>
          <select
            id="locatie"
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setLocation(e.target.value)}
          >
            <option>Geen</option>
            <option>Breda</option>
            <option>Den Bosch</option>
            <option>Tilburg</option>
          </select>
        </div>
        <div className="w-1/2 pl-2">
          <label
            htmlFor="ects"
            className="block text-sm font-medium text-gray-700"
          >
            EC&apos;s
          </label>
          <select
            id="ects"
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setEcts(Number.parseInt(e.target.value))}
          >
            <option value="0">Alle</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <ModuleCard key={module._id} {...module} />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Geen module gevonden.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleFilter;
