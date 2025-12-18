"use client";

import { useState } from "react";

export default function ModulesHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Keuzemodules bij Avans</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 focus:outline-none transition-colors ${
            isOpen ? "text-blue-600" : "text-gray-900"
          }`}
          aria-label={isOpen ? "Verberg info" : "Toon info"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v.01M12 11v5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="mt-2 rounded-md border border-gray-200 p-4 text-sm text-gray-600">
          <p>
            Op deze pagina vind je een overzicht van alle beschikbare keuzemodules. 
            Gebruik de filters om modules te zoeken die bij jouw interesses en studie passen.
          </p>
        </div>
      )}
    </div>
  );
}
