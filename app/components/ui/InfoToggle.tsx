"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface InfoToggleProps {
  title: string;
  subtitle?: string; // New optional prop
  description: string;
}

export default function InfoToggle({ title, subtitle, description }: InfoToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-(--text-primary)">{title}</h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex items-center justify-center rounded-full p-1 hover:bg-(--bg-input) focus:outline-none transition-colors ${
              isOpen ? "text-(--color-brand)" : "text-(--text-primary)"
            }`}
            aria-label={isOpen ? t('modulesHeader.hideInfo') : t('modulesHeader.showInfo')}
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
        {subtitle && (
          <p className="text-sm text-(--text-secondary) pr-8">{subtitle}</p>
        )}
      </div>
      
      {isOpen && (
        <div className="mt-3 rounded-md border border-(--border-divider) p-4 text-sm text-(--text-secondary) animate-in fade-in slide-in-from-top-1 bg-(--bg-input)/50">
          <p className="whitespace-pre-line">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}