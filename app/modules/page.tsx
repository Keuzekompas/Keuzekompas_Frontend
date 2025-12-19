"use client";

import { useState, useEffect } from "react";
import ModuleFilter from "../components/ModuleFilter";
import ModulesHeader from "../components/ModulesHeader";
import { getModules } from "@/lib/modules";
import type { ModuleResponse } from "@/app/types/module";

const ModulesPage = () => {
  const [modules, setModules] = useState<ModuleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const fetchedModules = await getModules();
        setModules(fetchedModules);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError("Modules konden niet worden geladen.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Laden…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{error}</p>
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
