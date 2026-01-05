"use client";

import { useState } from "react";

export default function ModulesHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-(--text-primary)]">Elective modules of Avans</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center justify-center rounded-full p-1 hover:bg-(--bg-input)] focus:outline-none transition-colors ${
            isOpen ? "text-(--color-brand)]" : "text-(--text-primary)]"
          }`}
          aria-label={isOpen ? "Hide info" : "Show info"}
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
        <div className="mt-2 rounded-md border border-(--border-divider) p-4 text-sm text-(--text-secondary)">
          <p>
            On this page you will find an overview of all available elective modules. 
            Use the filters to search for modules that match your interests and study.
          </p>
        </div>
      )}
    </div>
  );
}
