"use client";

import { useState, useEffect } from "react";
import ModuleFilter from "../components/ModuleFilter";
import ModulesHeader from "../components/ModulesHeader";
import { getModules } from "@/lib/modules";
import type { ModuleResponse } from "@/app/types/module";

const ModulesPage = () => {
  const [modules, setModules] = useState<ModuleResponse[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await getModules();
        setModules(fetchedModules);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
        // Optionally, handle the error state in the UI
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="p-4">
      <ModulesHeader />
      <ModuleFilter modules={modules} />
    </div>
  );
};

export default ModulesPage;
