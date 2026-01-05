"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ModuleCard from "./ModuleCard";
import { ModuleListResponse } from "../types/moduleList";

const ModuleFilter = ({ modules }: { modules: ModuleListResponse[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Geen");
  const [ects, setEcts] = useState(0);

  const filteredModules = modules.filter((module) => {
    const searchMatch = module.name
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
          className="w-full p-2 pl-10 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary) placeholder-(--text-placeholder)"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-(--icon-color)" />
        </div>
      </div>

      <div className="flex flex-row gap-4 mb-4">
        <div className="w-1/2">
          <label
            htmlFor="locatie"
            className="block text-sm font-medium text-(--text-secondary)"
          >
            Locatie
          </label>
          <select
            id="locatie"
            className="w-full p-2 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary)"
            onChange={(e) => setLocation(e.target.value)}
          >
            <option>Geen</option>
            <option>Breda</option>
            <option>Den Bosch</option>
            <option>Tilburg</option>
          </select>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="ects"
            className="block text-sm font-medium text-(--text-secondary)"
          >
            EC&apos;s
          </label>
          <select
            id="ects"
            className="w-full p-2 border border-(--border-input) rounded-lg bg-(--bg-input) text-(--text-primary)"
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
          <div className="text-center text-(--text-secondary) mt-8">
            Geen module gevonden.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleFilter;
