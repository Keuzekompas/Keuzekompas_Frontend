import ModuleFilter from "../components/ModuleFilter";
import { Module } from "../types/module";

async function getModules(): Promise<Module[]> {
  const res = await fetch("http://localhost:1000/modules", {
    next: { revalidate: 60 },
  });

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

const ModulesPage = async () => {
  const modules = await getModules();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Keuzemodules bij Avans</h2>
      <ModuleFilter modules={modules} />
    </div>
  );
};

export default ModulesPage;
