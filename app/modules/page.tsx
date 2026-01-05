"use client";

import { useState, useEffect } from "react";
import ModuleFilter from "../components/ModuleFilter";
import ModulesHeader from "../components/ModulesHeader";
import { getModules } from "@/lib/modules";
import type { ModuleListResponse } from "@/app/types/moduleList";
import { useLanguage } from "@/app/context/LanguageContext";

const ModulesPage = () => {
  const [modules, setModules] = useState<ModuleListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const fetchedModules = await getModules(language);
        setModules(fetchedModules);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError("Modules konden niet worden geladen.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-(--text-primary)">Laden…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-(--color-error)">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ModulesHeader />
      <ModuleFilter modules={modules} />
    </div>
  );
};

export default ModulesPage;
